import { z } from 'zod';

export const UpdateTagDto = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(1000).nullable().optional(),
});

export type UpdateTagDto = z.infer<typeof UpdateTagDto>;
