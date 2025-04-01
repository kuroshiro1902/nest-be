import { Global, Module } from '@nestjs/common';
import { PostgresService } from './postgres/postgres.service';

@Global()
@Module({
  providers: [PostgresService],
  exports: [PostgresService],
})
export class DatabaseModule {}
