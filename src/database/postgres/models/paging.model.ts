import { PagingSchema } from '@/shared/models/paging.model';

export const PostgresPagingSchema = PagingSchema.transform(({ pageIndex, pageSize }) => ({
  take: pageSize,
  from: pageIndex - 1,
}));
