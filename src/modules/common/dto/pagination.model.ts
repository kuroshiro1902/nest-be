import { z } from 'zod';
import { BaseEntity } from '../entity/base.entity';

type StringKeyof<T> = keyof T & string;

export const PageInputDto = <T extends BaseEntity>(sortKeys: (keyof T)[] = ['createdAt']) =>
  z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    sort: z.enum(sortKeys as [StringKeyof<T>, ...StringKeyof<T>[]]).default(sortKeys[0] as StringKeyof<T>),
    order: z.enum(['asc', 'desc', 'ASC', 'DESC']).default('DESC'),
  });

export type PageInputDto<T extends BaseEntity> = z.infer<ReturnType<typeof PageInputDto<T>>>;

export type PageResult<T extends BaseEntity> = {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
};
