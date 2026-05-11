import { z } from "zod";

export const createPollSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).default(""),
  expiresAt: z
    .string()
    .min(1, "Expiration date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    })
    .transform((val) => new Date(val).toISOString()),
  responseMode: z.enum(["anonymous", "authenticated"]),
  questions: z
    .array(
      z.object({
        text: z.string().min(1, "Question text is required").max(500),
        options: z
          .array(z.string().min(1))
          .min(2, "At least 2 options required")
          .max(10, "Maximum 10 options"),
        isMandatory: z.boolean().default(false),
        order: z.number().int().min(0),
      }),
    )
    .min(1, "At least 1 question required")
    .max(20, "Maximum 20 questions"),
});

export const updatePollSchema = createPollSchema.partial();

export type CreatePollInput = z.infer<typeof createPollSchema>;
export type UpdatePollInput = z.infer<typeof updatePollSchema>;
