import { Request, Response } from "express";
import * as pollService from "../services/pollService.js";
import { UnauthorizedError } from "../lib/errors.js";

export async function createPoll(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError();
  const result = await pollService.createPoll(req.user, req.body);
  res.status(201).json(result);
}

export async function getMyPolls(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError();
  const polls = await pollService.getMyPolls(req.user);
  res.json(polls);
}

export async function getPoll(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError();
  const result = await pollService.getPoll(req.user, req.params.id as string);
  res.json(result);
}

export async function updatePoll(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError();
  const result = await pollService.updatePoll(
    req.user,
    req.params.id as string,
    req.body,
  );
  res.json(result);
}

export async function deletePoll(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError();
  await pollService.deletePoll(req.user, req.params.id as string);
  res.json({ message: "Poll deleted" });
}

export async function publishPoll(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError();
  const result = await pollService.publishPoll(
    req.user,
    req.params.id as string,
  );
  res.json(result);
}

export async function getAnalytics(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError();
  const analytics = await pollService.getAnalytics(
    req.user,
    req.params.id as string,
  );
  res.json(analytics);
}
