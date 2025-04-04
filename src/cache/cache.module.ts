import { Module } from '@nestjs/common';
import { CACHE_MANAGER, CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ECacheToken } from './cache-token.const';
import { AccessTokenCacheService } from './access-token-cache.service.service';

@Module({
  imports: [NestCacheModule.register()],
  providers: [
    AccessTokenCacheService,
    {
      provide: ECacheToken.ACCESS_TOKEN_CACHE, // Định danh provider
      useExisting: CACHE_MANAGER, // Dùng chung CacheManager của NestJS
    },
  ],
  exports: [AccessTokenCacheService],
})
export class CacheModule {}
