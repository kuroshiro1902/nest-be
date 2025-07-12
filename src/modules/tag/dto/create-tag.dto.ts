import { z } from 'zod';

export const CreateTagDto = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(1000).optional(),
});

export type CreateTagDto = z.infer<typeof CreateTagDto>;
