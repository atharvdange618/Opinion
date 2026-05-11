import crypto from "crypto";
import mongoose from "mongoose";
import { Request } from "express";
import { Poll } from "../models/Poll.js";
import { Question } from "../models/Question.js";
import { Response as ResponseModel } from "../models/Response.js";
import { User } from "../models/User.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../lib/errors.js";
import type { AuthPayload } from "../middleware/auth.js";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) return false;

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

function hashFingerprint(ip: string): string {
  const salt = process.env.FINGERPRINT_SALT || "default-salt";
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("hex");
}

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.ip || req.socket.remoteAddress || "unknown";
}

async function checkExpiry(pollId: mongoose.Types.ObjectId) {
  const poll = await Poll.findById(pollId);
  if (!poll) return;
  const now = new Date();
  if (poll.status === "active" && now > poll.expiresAt) {
    poll.status = "expired";
    await poll.save();
  }
}

export async function getPublicPoll(slug: string) {
  const poll = await Poll.findOne({ slug });
  if (!poll) throw new NotFoundError("Poll not found");

  await checkExpiry(poll._id);

  if (poll.status === "published" || poll.status === "expired") {
    const questions = await Question.find({ poll: poll._id }).sort({
      order: 1,
    });
    return { ...poll.toJSON(), questions };
  }

  const questions = await Question.find({ poll: poll._id }).sort({ order: 1 });
  const safeQuestions = questions.map((q) => ({
    _id: q._id,
    text: q.text,
    options: q.options,
    isMandatory: q.isMandatory,
    order: q.order,
  }));

  return {
    _id: poll._id,
    title: poll.title,
    description: poll.description,
    responseMode: poll.responseMode,
    status: poll.status,
    slug: poll.slug,
    expiresAt: poll.expiresAt.toISOString(),
    createdAt: poll.createdAt.toISOString(),
    questions: safeQuestions,
  };
}

export async function getPublicResults(slug: string) {
  const poll = await Poll.findOne({ slug });
  if (!poll) throw new NotFoundError("Poll not found");

  if (poll.status !== "published") {
    throw new ForbiddenError("Results have not been published yet");
  }

  const questions = await Question.find({ poll: poll._id }).sort({ order: 1 });

  const totalResponses = await ResponseModel.countDocuments({ poll: poll._id });

  const questionSummaries = await Promise.all(
    questions.map(async (question) => {
      const responses = await ResponseModel.find({
        poll: poll._id,
        question: question._id,
      });
      const totalAnswers = responses.length;

      const optionCounts = question.options.map((option) => {
        const count = responses.filter(
          (r) => r.selectedOption === option,
        ).length;
        return {
          option,
          count,
          percentage:
            totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0,
        };
      });

      return {
        questionId: question._id.toString(),
        questionText: question.text,
        options: optionCounts,
        totalAnswers,
      };
    }),
  );

  return { totalResponses, questionSummaries };
}

export async function submitResponse(
  slug: string,
  answers: { questionId: string; selectedOption: string }[],
  turnstileToken: string | undefined,
  req: Request,
  userInfo?: AuthPayload,
) {
  const poll = await Poll.findOne({ slug });
  if (!poll) throw new NotFoundError("Poll not found");

  const now = new Date();
  if (poll.status === "expired" || now > poll.expiresAt) {
    poll.status = "expired";
    await poll.save();
    throw new BadRequestError("This poll has ended");
  }

  if (poll.status !== "active") {
    throw new BadRequestError("This poll is not accepting responses");
  }

  const questions = await Question.find({ poll: poll._id }).sort({ order: 1 });

  const mandatoryQuestions = questions.filter((q) => q.isMandatory);
  const answeredQuestionIds = answers.map((a) => a.questionId);

  for (const q of mandatoryQuestions) {
    if (!answeredQuestionIds.includes(q._id.toString())) {
      throw new BadRequestError(
        `Mandatory question "${q.text}" is not answered`,
      );
    }
  }

  for (const answer of answers) {
    const question = questions.find(
      (q) => q._id.toString() === answer.questionId,
    );
    if (!question) {
      throw new BadRequestError(
        `Question ${answer.questionId} not found in this poll`,
      );
    }
    if (!question.options.includes(answer.selectedOption)) {
      throw new BadRequestError(
        `"${answer.selectedOption}" is not a valid option for question "${question.text}"`,
      );
    }
  }

  if (poll.responseMode === "anonymous") {
    if (!turnstileToken || !(await verifyTurnstileToken(turnstileToken))) {
      throw new BadRequestError("Security check failed. Please try again.");
    }

    const ip = getClientIp(req);
    const fingerprint = hashFingerprint(ip);

    const respondentId = req.cookies?.respondentId || crypto.randomUUID();

    const existing = await ResponseModel.findOne({
      poll: poll._id,
      respondentId,
    });
    if (existing) {
      throw new BadRequestError("You have already responded to this poll");
    }

    const responseDocs = answers.map((a) => ({
      poll: poll._id,
      question: a.questionId,
      respondent: null,
      selectedOption: a.selectedOption,
      respondentId,
      fingerprint,
    }));

    await ResponseModel.insertMany(responseDocs);

    return { respondentId, isNewCookie: !req.cookies?.respondentId, pollId: poll._id.toString() };
  }

  // authenticated mode
  if (!userInfo) {
    throw new UnauthorizedError("Authentication required for this poll");
  }

  const user = await User.findOne({ sub: userInfo.sub });
  if (!user) throw new NotFoundError("User not found");

  const existing = await ResponseModel.findOne({
    poll: poll._id,
    respondent: user._id,
  });
  if (existing) {
    throw new BadRequestError("You have already responded to this poll");
  }

  const responseDocs = answers.map((a) => ({
    poll: poll._id,
    question: a.questionId,
    respondent: user._id,
    selectedOption: a.selectedOption,
  }));

  await ResponseModel.insertMany(responseDocs);

  return { respondentId: null, isNewCookie: false, pollId: poll._id.toString() };
}
