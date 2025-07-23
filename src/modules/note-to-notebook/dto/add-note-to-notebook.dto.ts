import { z } from 'zod';

export const AddNoteToNotebookDto = z.object({
  noteId: z.string().uuid(),
  notebookId: z.string().uuid(),
});

export type AddNoteToNotebookDto = z.infer<typeof AddNoteToNotebookDto>;
