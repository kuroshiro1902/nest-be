import { z } from 'zod';

export const AddNoteToNotebookDto = z.object({
  noteId: z.string().max(36),
  notebookId: z.string().max(36),
});

export type AddNoteToNotebookDto = z.infer<typeof AddNoteToNotebookDto>;
