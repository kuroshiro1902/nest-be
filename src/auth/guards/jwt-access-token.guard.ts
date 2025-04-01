import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class JwtAccessTokenGuard implements CanActivate {
  constructor(
    // private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    // const response: Response = context.switchToHttp().getResponse();

    const accessToken = request.headers['authorization']?.split(' ')[1];

    try {
      const user = this.authService.verifyAccessToken(accessToken);
      request.user = user;
      return true;
    } catch (error: any) {
      throw new HttpException(
        error?.message || 'Error check access token!',
        StatusCodes.UNAUTHORIZED,
      );
    }
  }
}
