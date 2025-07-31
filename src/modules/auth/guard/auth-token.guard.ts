import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const accessTokenParts = request.headers['authorization']?.split(' ');

    if (accessTokenParts?.[0]?.toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Invalid token format!');
    }

    const accessToken = accessTokenParts?.[1];

    if (!accessToken) {
      throw new UnauthorizedException('Token not found!');
    }

    const user = await this.authService.verifyAccessToken(accessToken);
    request.user = user;
    return true;
  }
}
