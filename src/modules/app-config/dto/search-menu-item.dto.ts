import { PageInputDto } from '@/modules/common/dto/pagination.model';
import { z } from 'zod';
import { MenuItem } from '../entity/menu-item.entity';

export const SearchMenuItemDto = z
  .object({
    search: z.string().trim().max(255).optional(),
  })
  .merge(PageInputDto<MenuItem>(['createdAt', 'label', 'updatedAt']));

export type SearchMenuItemDto = z.infer<typeof SearchMenuItemDto>;
