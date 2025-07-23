import { z } from 'zod';

export const CreateNoteDto = z.object({
  title: z.string().trim().max(255).nullable().optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  content: z.string().trim().max(10000),
  userId: z.string(),
  notebookId: z.string().optional(),
});

export type CreateNoteDto = z.infer<typeof CreateNoteDto>;
