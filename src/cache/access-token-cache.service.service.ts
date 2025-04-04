import { Injectable, Inject } from '@nestjs/common';
import { Cache } from '@nestjs/cache-manager';
import { TAccessToken, TUserJWTPayload } from '@/auth/models/auth.model';
import { CONFIG } from '@/config/config';
import { ECacheToken } from './cache-token.const';

@Injectable()
export class AccessTokenCacheService {
  private prefix = 'at';
  private ttl = CONFIG.access_token.expired_minutes * 60 * 1000;

  private key(token: string): string {
    return this.prefix + token;
  }

  constructor(@Inject(ECacheToken.ACCESS_TOKEN_CACHE) private cacheManager: Cache) {}

  /**
   * @param ttl miliseconds
   */
  async setToken(
    token: TAccessToken,
    decoded: TUserJWTPayload,
  ): Promise<TUserJWTPayload> {
    return await this.cacheManager.set(this.key(token), decoded, this.ttl);
  }

  async getToken(token: string): Promise<TUserJWTPayload | null> {
    const result = await this.cacheManager.get<TUserJWTPayload>(this.key(token));
    return result;
  }

  async deleteToken(token: string): Promise<boolean> {
    return await this.cacheManager.del(this.key(token));
  }
}
