import { PageInputDto } from '@/modules/common/dto/pagination.model';
import { z } from 'zod';
import { Note } from '../entity/note.entity';

export const SearchNoteDto = z
  .object({
    search: z.string().trim().max(255).optional(),
  })
  .merge(PageInputDto<Note>(['createdAt', 'title', 'updatedAt']));

export type SearchNoteDto = z.infer<typeof SearchNoteDto>;
