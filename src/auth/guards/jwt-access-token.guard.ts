import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { StatusCodes } from 'http-status-codes';
import { AccessTokenCacheService } from '@/cache/access-token-cache.service.service';

@Injectable()
export class JwtAccessTokenGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private accessTokenCacheService: AccessTokenCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // const response: Response = context.switchToHttp().getResponse();

    const accessToken = request.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      throw new HttpException('Access token not found!', StatusCodes.UNAUTHORIZED);
    }

    const cacheUser = await this.accessTokenCacheService.getToken(accessToken);
    if (cacheUser) {
      request.user = cacheUser;
    } else {
      const user = this.authService.verifyAccessToken(accessToken);
      request.user = user;
      void this.accessTokenCacheService.setToken(accessToken, user);
    }
    return true;
  }
}
