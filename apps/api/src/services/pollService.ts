import { nanoid } from "nanoid";
import mongoose from "mongoose";
import { Poll, IPoll } from "../models/Poll.js";
import { Question } from "../models/Question.js";
import { Response as ResponseModel } from "../models/Response.js";
import { User } from "../models/User.js";
import { BadRequestError, NotFoundError } from "../lib/errors.js";
import type { AuthPayload } from "../middleware/auth.js";
import type { AnalyticsData, EngagementStats, PollHealthStats } from "@opinion/shared";

async function getUserBySub(userInfo: AuthPayload) {
  const user = await User.findOne({ sub: userInfo.sub });
  if (!user) throw new NotFoundError("User not found");
  return user;
}

async function getOwnPoll(pollId: string, userId: mongoose.Types.ObjectId) {
  const poll = await Poll.findOne({ _id: pollId, creator: userId });
  if (!poll) throw new NotFoundError("Poll not found");
  return poll;
}

export async function createPoll(
  userInfo: AuthPayload,
  body: {
    title: string;
    description: string;
    expiresAt: string;
    responseMode: "anonymous" | "authenticated";
    questions: {
      text: string;
      options: string[];
      isMandatory: boolean;
      order: number;
    }[];
  },
) {
  const user = await getUserBySub(userInfo);

  const poll = await Poll.create({
    creator: user._id,
    title: body.title,
    description: body.description,
    expiresAt: new Date(body.expiresAt),
    responseMode: body.responseMode,
    slug: nanoid(8),
  });

  const questionDocs = body.questions.map((q) => ({
    poll: poll._id,
    text: q.text,
    options: q.options,
    isMandatory: q.isMandatory,
    order: q.order,
  }));

  await Question.insertMany(questionDocs);

  const createdQuestions = await Question.find({ poll: poll._id }).sort({
    order: 1,
  });

  return { ...poll.toJSON(), questions: createdQuestions };
}

export async function getMyPolls(userInfo: AuthPayload) {
  const user = await getUserBySub(userInfo);

  const polls = await Poll.find({ creator: user._id })
    .sort({ createdAt: -1 })
    .lean();

  const pollsWithCounts = await Promise.all(
    polls.map(async (poll) => {
      const responseCount = await ResponseModel.countDocuments({
        poll: poll._id,
      });
      return { ...poll, responseCount };
    }),
  );

  return pollsWithCounts;
}

export async function getPoll(userInfo: AuthPayload, pollId: string) {
  const user = await getUserBySub(userInfo);
  const poll = await getOwnPoll(pollId, user._id);

  const questions = await Question.find({ poll: poll._id }).sort({ order: 1 });

  return { ...poll.toJSON(), questions };
}

export async function updatePoll(
  userInfo: AuthPayload,
  pollId: string,
  body: {
    title?: string;
    description?: string;
    expiresAt?: string;
    responseMode?: "anonymous" | "authenticated";
    questions?: {
      text: string;
      options: string[];
      isMandatory: boolean;
      order: number;
    }[];
  },
) {
  const user = await getUserBySub(userInfo);
  const poll = await getOwnPoll(pollId, user._id);

  const existingResponses = await ResponseModel.countDocuments({
    poll: poll._id,
  });
  if (existingResponses > 0) {
    throw new BadRequestError("Cannot edit a poll that already has responses");
  }

  if (body.title !== undefined) poll.title = body.title;
  if (body.description !== undefined) poll.description = body.description;
  if (body.expiresAt !== undefined) poll.expiresAt = new Date(body.expiresAt);
  if (body.responseMode !== undefined) poll.responseMode = body.responseMode;

  await poll.save();

  if (body.questions) {
    await Question.deleteMany({ poll: poll._id });
    const questionDocs = body.questions.map((q) => ({
      poll: poll._id,
      text: q.text,
      options: q.options,
      isMandatory: q.isMandatory,
      order: q.order,
    }));
    await Question.insertMany(questionDocs);
  }

  const updatedQuestions = await Question.find({ poll: poll._id }).sort({
    order: 1,
  });

  return { ...poll.toJSON(), questions: updatedQuestions };
}

export async function deletePoll(userInfo: AuthPayload, pollId: string) {
  const user = await getUserBySub(userInfo);
  const poll = await getOwnPoll(pollId, user._id);

  const existingResponses = await ResponseModel.countDocuments({
    poll: poll._id,
  });
  if (existingResponses > 0) {
    throw new BadRequestError("Cannot delete a poll that has responses");
  }

  await Question.deleteMany({ poll: poll._id });
  await Poll.deleteOne({ _id: poll._id });
}

export async function publishPoll(userInfo: AuthPayload, pollId: string) {
  const user = await getUserBySub(userInfo);
  const poll = await getOwnPoll(pollId, user._id);

  poll.status = "published";
  await poll.save();

  return poll.toJSON();
}

export async function getAnalytics(
  userInfo: AuthPayload,
  pollId: string,
): Promise<AnalyticsData> {
  const user = await getUserBySub(userInfo);
  const poll = await getOwnPoll(pollId, user._id);

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

  const allResponses = await ResponseModel.find({ poll: poll._id }).sort({
    createdAt: 1,
  });

  const timelineMap = new Map<string, number>();
  allResponses.forEach((r) => {
    const date = r.createdAt.toISOString().split("T")[0];
    timelineMap.set(date, (timelineMap.get(date) || 0) + 1);
  });
  const timeline = Array.from(timelineMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  const anonymousCount = await ResponseModel.countDocuments({
    poll: poll._id,
    respondent: null,
  });
  const authenticatedCount = await ResponseModel.countDocuments({
    poll: poll._id,
    respondent: { $ne: null },
  });

  const engagement = computeEngagementStats(allResponses, poll.createdAt);
  const pollHealth = computePollHealth(
    totalResponses,
    allResponses.length,
    poll.createdAt,
    poll.status,
  );

  return {
    totalResponses,
    questionSummaries,
    timeline,
    participationInsights: {
      anonymous: anonymousCount,
      authenticated: authenticatedCount,
    },
    engagement,
    pollHealth,
  };
}

function computeEngagementStats(
  responses: InstanceType<typeof ResponseModel>[],
  pollCreatedAt: Date,
): EngagementStats {
  if (responses.length === 0) {
    return {
      firstResponseAt: null,
      lastResponseAt: null,
      responseVelocity: 0,
      peakActivity: { hour: null, dayOfWeek: null },
      uniqueRespondents: 0,
    };
  }

  const sortedResponses = [...responses].sort(
    (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  );

  const firstResponseAt = sortedResponses[0].createdAt.toISOString();
  const lastResponseAt = sortedResponses[sortedResponses.length - 1].createdAt.toISOString();

  const uniqueRespondents = new Set(
    responses.map((r) => r.respondentId || r._id.toString()),
  ).size;

  const hourCounts = new Map<number, number>();
  const dayCounts = new Map<number, number>();

  responses.forEach((r) => {
    const hour = r.createdAt.getHours();
    const day = r.createdAt.getDay();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
  });

  const peakHour = [...hourCounts.entries()].reduce((a, b) =>
    b[1] > a[1] ? b : a,
  )[0];
  const peakDay = [...dayCounts.entries()].reduce((a, b) =>
    b[1] > a[1] ? b : a,
  )[0];

  const hoursSinceFirst =
    (sortedResponses[0].createdAt.getTime() - pollCreatedAt.getTime()) /
    (1000 * 60 * 60);
  const responseVelocity =
    hoursSinceFirst > 0 ? Math.round(responses.length / hoursSinceFirst) : 0;

  return {
    firstResponseAt,
    lastResponseAt,
    responseVelocity,
    peakActivity: {
      hour: peakHour,
      dayOfWeek: peakDay,
    },
    uniqueRespondents,
  };
}

function computePollHealth(
  totalResponses: number,
  responsesWithData: number,
  pollCreatedAt: Date,
  status: string,
): PollHealthStats {
  const hoursSinceCreation = Math.round(
    (Date.now() - pollCreatedAt.getTime()) / (1000 * 60 * 60),
  );

  const avgResponsesPerHour =
    hoursSinceCreation > 0
      ? Math.round((totalResponses / hoursSinceCreation) * 10) / 10
      : 0;

  let statusAge = "new";
  if (status === "active" && hoursSinceCreation > 1) {
    statusAge = "hot";
  } else if (status === "expired" || status === "published") {
    statusAge = status;
  }

  const completionRate = 0;

  return {
    completionRate,
    avgResponsesPerHour,
    hoursSinceCreation,
    statusAge,
  };
}
