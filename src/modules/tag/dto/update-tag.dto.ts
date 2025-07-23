import { z } from 'zod';

export const UpdateTagDto = z.object({
  name: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^[a-zA-Z0-9\s]+$/, 'Tên tag chỉ được chứa chữ cái và số')
    .optional(),
  description: z.string().trim().max(1000).nullable().optional(),
});

export type UpdateTagDto = z.infer<typeof UpdateTagDto>;
