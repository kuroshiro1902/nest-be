import { Module } from '@nestjs/common';
import { CacheService } from './service/cache.service';

@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
