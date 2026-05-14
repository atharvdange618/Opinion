import { z } from 'zod';

export const syncUserSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().nullable().optional(),
});

export type SyncUserInput = z.infer<typeof syncUserSchema>;
