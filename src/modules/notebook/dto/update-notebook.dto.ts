import { z } from 'zod';

export const UpdateNoteBookDto = z.object({
  title: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().nullable().optional(),
});

export type UpdateNoteBookDto = z.infer<typeof UpdateNoteBookDto>;
