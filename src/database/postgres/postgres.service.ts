import { TPagingInput } from '@/shared/models/paging.model';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PostgresPagingSchema } from './models/paging.model';

@Injectable()
export class PostgresService extends PrismaClient {
  public pagingInput(input: TPagingInput) {
    return PostgresPagingSchema.parse(input);
  }
}
