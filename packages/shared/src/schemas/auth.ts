import { z } from 'zod';

export const syncUserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  picture: z.string().nullable().optional(),
  sub: z.string(),
});

export type SyncUserInput = z.infer<typeof syncUserSchema>;
