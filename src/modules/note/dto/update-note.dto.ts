import { z } from 'zod';

export const UpdateNoteDto = z.object({
  title: z.string().trim().max(255).nullable().optional(),
  description: z.string().trim().max(1000).nullable().optional(),
  content: z.string().trim().max(10000).optional(),
});

export type UpdateNoteDto = z.infer<typeof UpdateNoteDto>;
