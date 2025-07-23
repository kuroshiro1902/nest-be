import { z } from 'zod';

export const CreateTagDto = z.object({
  userId: z.string().uuid(),
  name: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z0-9\s]+$/, 'Tên tag chỉ được chứa chữ cái và số'),
  description: z.string().trim().max(1000).optional(),
});

export type CreateTagDto = z.infer<typeof CreateTagDto>;
