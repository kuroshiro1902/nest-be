import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from '@/modules/database/service/database.service';
import { ENV } from '@/env';
import { AUTH_CONFIG } from '@/config/auth.config';
import * as bcrypt from 'bcrypt';
import { TSignup } from '../model/signup.model';
import { TLogin } from '../model/login.model';
import { TAccessTokenPayload } from '../model/access-token-payload.model';
import { CacheService } from '@/modules/cache/service/cache.service';
import { accessTokenCacheKey } from '../constant/access-token-cache.const';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly databaseService: DatabaseService,
    private readonly cacheService: CacheService,
  ) {}

  async signup(user: TSignup): Promise<Omit<User, 'password'>> {
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

  async login(credential: TLogin): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    const user = await this.databaseService.user.findUnique({
      where: {
        username: credential.username,
      },
    });

    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại!');
    }

    const passwordMatch = await bcrypt.compare(credential.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Mật khẩu không đúng, vui lòng thử lại!');
    }

    const accessToken = this._createAccessToken({ id: user.id });
    await this.setAccessTokenCache(accessToken, user);

    const { password: _, ...userWithoutPassword } = user;

    console.log({ accessToken });

    return { user: userWithoutPassword, accessToken };
  }

  verifyAccessToken(accessToken?: string): TAccessTokenPayload {
    if (!accessToken) {
      throw new UnauthorizedException('Token not found!');
    }
    try {
      const decoded = this.jwtService.verify<TAccessTokenPayload>(accessToken, {
        secret: ENV.ACCESS_TOKEN_SECRET,
      });
      return decoded;
    } catch {
      void this.deleteAccessTokenCache(accessToken);
      throw new UnauthorizedException('Token is expired!');
    }
  }

  // Cache

  async getAccessTokenCache(accessToken: string): Promise<TAccessTokenPayload | null> {
    return await this.cacheService.getJSON<TAccessTokenPayload>(accessTokenCacheKey(accessToken));
  }

  async setAccessTokenCache(accessToken: string, { id }: TAccessTokenPayload) {
    await this.cacheService.setJSON(accessTokenCacheKey(accessToken), { id }, AUTH_CONFIG.accessToken.expired_seconds);
  }

  async deleteAccessTokenCache(accessToken: string) {
    await this.cacheService.delete(accessTokenCacheKey(accessToken));
  }

  private _createAccessToken(payload: TAccessTokenPayload): string {
    return this.jwtService.sign(
      {
        id: payload.id,
      },
      {
        algorithm: 'HS256',
        expiresIn: `${AUTH_CONFIG.accessToken.expired_seconds}s`,
        secret: ENV.ACCESS_TOKEN_SECRET,
      },
    );
  }

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
