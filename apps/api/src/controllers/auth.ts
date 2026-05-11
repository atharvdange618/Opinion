import { Request, Response } from "express";
import { syncUser, getMe } from "../services/authService.js";
import { UnauthorizedError } from "../lib/errors.js";

export async function syncUserHandler(
  req: Request,
  res: Response,
): Promise<void> {
  if (!req.user) throw new UnauthorizedError();
  const user = await syncUser(req.user);
  res.json(user);
}

export async function getMeHandler(req: Request, res: Response): Promise<void> {
  if (!req.user) throw new UnauthorizedError();
  const user = await getMe(req.user);
  res.json(user);
}
