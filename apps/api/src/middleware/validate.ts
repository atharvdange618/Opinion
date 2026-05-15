import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues;
      res.status(400).json({
        errors: issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
        message: 'Validation failed',
      });
      return;
    }
    req.body = result.data;
    next();
  };
}
