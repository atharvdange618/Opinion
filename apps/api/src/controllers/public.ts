import { Request, Response } from "express";
import * as publicService from "../services/publicService.js";
import { getIO } from "../lib/io.js";

export async function getPublicPoll(
  req: Request,
  res: Response,
): Promise<void> {
  const result = await publicService.getPublicPoll(req.params.slug as string);
  res.json(result);
}

export async function getPublicResults(
  req: Request,
  res: Response,
): Promise<void> {
  const result = await publicService.getPublicResults(
    req.params.slug as string,
  );
  res.json(result);
}

export async function submitResponse(
  req: Request,
  res: Response,
): Promise<void> {
  const { respondentId, isNewCookie, pollId } =
    await publicService.submitResponse(
      req.params.slug as string,
      req.body.answers,
      req.body.turnstileToken,
      req,
      req.user || undefined,
    );

  if (isNewCookie && respondentId) {
    res.cookie("respondentId", respondentId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
  }

  getIO().to(`poll:${pollId}`).emit("analytics:update");

  res.json({ message: "Response submitted successfully" });
}
