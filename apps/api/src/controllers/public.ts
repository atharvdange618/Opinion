import type { Request, Response } from 'express';

import { getIO } from '../lib/io.js';
import * as publicService from '../services/publicService.js';
import * as verifyService from '../services/verifyService.js';

export async function createPollVerification(req: Request, res: Response): Promise<void> {
  const { turnstileToken } = req.body;

  const jwt = await verifyService.createVerification(req.params.slug as string, turnstileToken);

  res.cookie(`poll_verified_${req.params.slug}`, jwt, {
    httpOnly: true,
    maxAge: 30 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  res.json({ verified: true });
}

export async function getPollVerificationStatus(req: Request, res: Response): Promise<void> {
  const verified = await verifyService.checkVerification(
    req.params.slug as string,
    req.cookies?.[`poll_verified_${req.params.slug}`],
  );

  res.json({ verified });
}

export async function getPublicPoll(req: Request, res: Response): Promise<void> {
  const result = await publicService.getPublicPoll(req.params.slug as string);
  res.json(result);
}

export async function getPublicResults(req: Request, res: Response): Promise<void> {
  const result = await publicService.getPublicResults(req.params.slug as string);
  res.json(result);
}

export async function submitResponse(req: Request, res: Response): Promise<void> {
  const { isNewCookie, pollId, respondentId } = await publicService.submitResponse(
    req.params.slug as string,
    req.body.answers,
    req.body.turnstileToken,
    req,
    req.user || undefined,
  );

  if (isNewCookie && respondentId) {
    res.cookie('respondentId', respondentId, {
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });
  }

  getIO().to(`poll:${pollId}`).emit('analytics:update');

  res.json({ message: 'Response submitted successfully' });
}
