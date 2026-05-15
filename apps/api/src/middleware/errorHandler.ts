import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../lib/errors.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  void _next;
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
}
