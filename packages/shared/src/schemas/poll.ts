import { z } from 'zod';

export const createPollSchema = z.object({
  description: z.string().max(1000).default(''),
  expiresAt: z
    .string()
    .min(1, 'Expiration date is required')
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    })
    .transform((val) => new Date(val).toISOString()),
  questions: z
    .array(
      z.object({
        isMandatory: z.boolean().default(false),
        options: z
          .array(z.string().min(1))
          .min(2, 'At least 2 options required')
          .max(10, 'Maximum 10 options'),
        order: z.number().int().min(0),
        text: z.string().min(1, 'Question text is required').max(500),
      }),
    )
    .min(1, 'At least 1 question required')
    .max(20, 'Maximum 20 questions'),
  responseMode: z.enum(['anonymous', 'authenticated']),
  title: z.string().min(1, 'Title is required').max(200),
});

export const updatePollSchema = createPollSchema.partial();

export type CreatePollInput = z.infer<typeof createPollSchema>;
export type UpdatePollInput = z.infer<typeof updatePollSchema>;
