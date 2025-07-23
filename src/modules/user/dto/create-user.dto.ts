import { z } from 'zod';

export const CreateUserDto = z.object({
  name: z.string().trim().min(1).max(255),
  username: z.string().trim().min(1).max(255),
  password: z.string().trim().min(1).max(255),
  email: z.string().trim().email().optional(),
  dob: z.string().trim().optional(),
  description: z.string().trim().optional(),
  avatarUrl: z.string().trim().optional(),
  bgUrl: z.string().trim().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;
