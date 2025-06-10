import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from '@/modules/database/service/database.service';
import { ENV } from '@/env';
import { AUTH_CONFIG } from '@/config/auth.config';
import * as bcrypt from 'bcrypt';
import { TSignupInput } from '../model/signup-input.model';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
  ) {}

  async signup(user: TSignupInput): Promise<Omit<User, 'password'>> {
    const conditions: Prisma.UserWhereInput[] = [{ username: user.username }];
    if (user.email) conditions.push({ email: user.email });
    const createdUser = await this.databaseService.$transaction(async (tx) => {
      const userExists = await tx.user.findFirst({
        where: { OR: conditions },
        select: { id: true },
      });
      if (userExists?.id) {
        throw new ConflictException('Tên đăng nhập hoặc email đã tồn tại!');
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUserInput = { ...user, password: hashedPassword };

      const createdUser = await tx.user.create({
        data: newUserInput,
      });

      const { password: _, ...userWithoutPassword } = createdUser;

      return userWithoutPassword;
    });
    return createdUser;
  }

  // public _verifyAccessToken<T extends AccessTokenPayloadDto | RefreshTokenPayloadDto>(
  //   token?: string,
  //   secret: string,
  // ): T {
  //   if (!access_token) {
  //     throw new UnauthorizedException(this.renewAccessTokenDirection);
  //   }
  //   try {
  //     const decoded = this.jwtService.verify<TAccessTokenJWTPayload>(access_token, {
  //       secret: ENV.ACCESS_TOKEN_SECRET,
  //     });
  //     return decoded;
  //   } catch {
  //     throw new UnauthorizedException(this.renewAccessTokenDirection);
  //   }
  // }

  // private _createAccessToken(payload: AccessTokenPayloadDto): string {
  //   return this.jwtService.sign(
  //     {
  //       id: payload.id,
  //     },
  //     {
  //       algorithm: 'HS256',
  //       expiresIn: `${AUTH_CONFIG.accessToken.expired_seconds}s`,
  //       secret: ENV.ACCESS_TOKEN_SECRET,
  //     },
  //   );
  // }

  // private _createRefreshToken(payload: RefreshTokenPayloadDto): string {
  //   return this.jwtService.sign(
  //     { id: payload.id },
  //     {
  //       algorithm: 'HS256',
  //       expiresIn: `${AUTH_CONFIG.refreshToken.expired_seconds}s`,
  //       secret: ENV.REFRESH_TOKEN_SECRET,
  //     },
  //   );
  // }
}
