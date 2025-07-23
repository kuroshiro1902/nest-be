import { z } from 'zod';

export const CreateNotebookDto = z.object({
  userId: z.string().uuid(),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().max(1000).optional(),
});

export type CreateNotebookDto = z.infer<typeof CreateNotebookDto>;
