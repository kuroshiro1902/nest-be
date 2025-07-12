import { PageInputDto } from '@/modules/common/dto/pagination.model';
import { z } from 'zod';
import { Tag } from '../entity/tag.entity';

export const SearchTagDto = z
  .object({
    search: z.string().trim().max(255).optional(),
  })
  .merge(PageInputDto<Tag>(['createdAt', 'name', 'updatedAt']));

export type SearchTagDto = z.infer<typeof SearchTagDto>;
