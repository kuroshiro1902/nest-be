import { z } from 'zod';

export const LoginDto = z.object({
  username: z.string().trim().min(5).max(30),
  password: z.string().min(6).max(30),
});

export type LoginDto = z.infer<typeof LoginDto>;
