import { z } from 'zod';

export interface TPageData<T> {
  data: T[];
  pageInfo: TPageInfo;
}

export type TPageInfo = {
  pageIndex?: number;
  pageSize?: number;
  hasNextPage?: boolean;
  totalPage?: number;
};

export type TPagingInput = {
  pageIndex?: number;
  pageSize?: number;
};

export const PagingSchema = z
  .object({
    pageIndex: z.number().int().positive().default(1),
    pageSize: z.number().int().positive().default(12),
  })
  .default({ pageIndex: 1, pageSize: 12 });
