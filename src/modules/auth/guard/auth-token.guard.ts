import { Injectable, CanActivate, ExecutionContext, HttpException, UnauthorizedException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // const response: Response = context.switchToHttp().getResponse();

    const accessToken = request.headers['authorization']?.split(' ')[1];

    if (!accessToken) {
      throw new UnauthorizedException('Token not found!');
    }

    const cacheUser = await this.authService.getAccessTokenCache(accessToken);
    if (!cacheUser?.id) {
      throw new UnauthorizedException('Token not found!');
    } else {
      // const user = this.authService.verifyAccessToken(accessToken);
      // request.user = user;
      request.user = cacheUser;
    }
    return true;
  }
}
