import { PageInputDto } from '@/modules/common/dto/pagination.model';
import { z } from 'zod';
import { NoteBook } from '../entity/notebook.entity';

export const SearchNotebookDto = z
  .object({
    search: z.string().trim().max(255).optional(),
  })
  .merge(PageInputDto<NoteBook>(['createdAt', 'title', 'updatedAt']));

export type SearchNotebookDto = z.infer<typeof SearchNotebookDto>;
