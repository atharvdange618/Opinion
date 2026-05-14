import { z } from 'zod';

export const submitResponseSchema = z.object({
  answers: z
    .array(
      z.object({
        questionId: z.string(),
        selectedOption: z.string().min(1, 'Option is required'),
      }),
    )
    .min(1),
  turnstileToken: z.string().optional(),
});

export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
