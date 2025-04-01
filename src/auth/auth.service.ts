import { PostgresService } from '@/database/postgres/postgres.service';
import { EPermissionId } from '@/permission/constants/permissions.const';
import { TUserCreate, UserDefaultDTO, UserDefaultSelect } from '@/user/models/user.model';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TUserJWTPayload } from './models/user-jwt-payload.model';
import { CONFIG } from '@/config/config';
import { ENV } from '@/environment/environment';
import { UserService } from '@/user/user.service';
import { TRefreshToken, TUserLogin } from './models/user-login.model';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private renewAccessTokenDirection = 'VALID_ACCESS_TOKEN_REQUIRED';

  constructor(
    private userService: UserService,
    // private permissionService: PermissionService,
    private postgresService: PostgresService,
    private jwtService: JwtService,
  ) {}

  async signUp(user: TUserCreate) {
    const createdUser = await this.postgresService.$transaction(async (tx) => {
      const userExists = await tx.user.findFirst({
        where: { email: user.email },
      });
      if (userExists) {
        throw new ConflictException('User already exists!');
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUserInput = { ...user, password: hashedPassword };

      // Create user
      const createdUser = await tx.user.create({
        data: newUserInput,
        select: UserDefaultSelect,
      });

      // Assign default permissions
      await tx.userPermission.create({
        data: { user_id: createdUser.id, permission_id: EPermissionId.user },
      });

      const permissions = await tx.userPermission.findMany({
        where: { user_id: createdUser.id },
        select: { permission_id: true },
      });

      const data = { ...createdUser, permissions };
      return data;
    });
    return createdUser;
  }

  private createAccessToken(payload: TUserJWTPayload): string {
    return this.jwtService.sign(
      {
        id: payload.id,
        permissions: payload.permissions ?? [],
      },
      {
        algorithm: 'HS256',
        expiresIn: `${CONFIG.access_token.expired_minutes}m`,
        secret: ENV.ACCESS_TOKEN_SECRET,
      },
    );
  }

  private createRefreshToken(payload: TUserJWTPayload): string {
    return this.jwtService.sign(
      { id: payload.id },
      {
        algorithm: 'HS256',
        expiresIn: `${CONFIG.refresh_token.expired_days}d`,
        secret: ENV.REFRESH_TOKEN_SECRET,
      },
    );
  }

  verifyAccessToken(token?: string) {
    if (!token) {
      throw new UnauthorizedException(this.renewAccessTokenDirection);
    }
    try {
      const decoded = this.jwtService.verify<TUserJWTPayload>(token, {
        secret: ENV.ACCESS_TOKEN_SECRET,
      });
      return decoded;
    } catch {
      throw new UnauthorizedException(this.renewAccessTokenDirection);
    }
  }

  private verifyRefreshToken(token?: string) {
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const decoded = this.jwtService.verify<TUserJWTPayload>(token, {
        secret: ENV.REFRESH_TOKEN_SECRET,
      });
      return decoded;
    } catch (error: any) {
      throw new UnauthorizedException(
        error?.message || 'Expired or invalid refresh token!',
      );
    }
  }

  async refreshAccessToken(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('[118] Invalid refresh token!');
    }

    const user = await this.userService.findUserByRefreshToken(refreshToken);
    if (!user) {
      throw new ForbiddenException('Invalid refresh token!');
    }

    try {
      const decoded = this.verifyRefreshToken(refreshToken);

      if (user.id !== decoded.id) {
        throw new ForbiddenException('[130] Invalid refresh token!');
      }

      const newAccessToken = this.createAccessToken(user);

      return {
        access_token: newAccessToken,
        user: UserDefaultDTO(user),
      };
    } catch (error: any) {
      throw new UnauthorizedException(
        error?.message || 'Expired or invalid refresh token!',
      );
    }
  }

  async logIn(userInput: TUserLogin & { refresh_token: TRefreshToken }) {
    const { email, password, refresh_token } = userInput;

    const user = await this.postgresService.user.findFirst({
      where: { email },
      include: {
        refresh_tokens: { select: { token: true } },
        permissions: { select: { permission_id: true } },
      },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong password!');
    }

    if (refresh_token) {
      // handle refresh token
      const foundToken = user.refresh_tokens.find(
        (token) => token.token === refresh_token,
      );
      // If token does not exist -> Token has been deleted before -> Reuse token attack!
      if (!foundToken) {
        console.warn('Detected refresh token reuse! User is maybe being attacked!');
        // Xóa tất cả refresh token của user để bảo vệ tài khoản
        await this.postgresService.user.update({
          where: { id: user.id },
          data: { refresh_tokens: { deleteMany: {} } },
        });

        throw new UnauthorizedException(
          'Suspicious activity detected! Please log in again.',
        );
      }
    }

    // if (user.refresh_tokens.length >= CONFIG.refresh_token.max_amount_per_user) {
    //   return ResponseData.fail(
    //     'You have reached the maximum device. Please log out from another device!',
    //     StatusCodes.TOO_MANY_REQUESTS,
    //   );
    //   // Không hợp lý, hacker có thể đã đăng nhập vào nhiều thiết bị và đẩy người dùng thật ra.
    // }

    // User JWT Payload - Access Token
    const userJWTPayload: TUserJWTPayload = {
      id: user.id,
      permissions: user.permissions.map((p) => p.permission_id),
    };
    const newAccessToken = this.createAccessToken(userJWTPayload);
    const newRefreshToken = {
      token: this.createRefreshToken({ id: user.id }), // Không có permissions
    };

    await this.postgresService.$transaction(async (tx) => {
      if (refresh_token) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            refresh_tokens: { deleteMany: { token: refresh_token } },
          },
        });
      }

      await tx.user.update({
        where: { id: user.id },
        data: {
          refresh_tokens: { create: { token: newRefreshToken.token } },
        },
      });
    });

    return {
      user: UserDefaultDTO(user),
      access_token: newAccessToken,
      refresh_token: newRefreshToken.token,
    };
  }

  async logOut(refreshToken?: string) {
    if (refreshToken) {
      const user = await this.userService.findUserByRefreshToken(refreshToken);
      if (user) {
        await this.postgresService.user.update({
          where: { id: user.id },
          data: { refresh_tokens: { delete: { token: refreshToken } } },
        });
      }
    }
    return true;
  }

  @Cron('0 0 * * *') // Every day at midnight
  private async deleteOldRefreshTokens() {
    const deleteTime = new Date();
    deleteTime.setDate(
      deleteTime.getDate() - CONFIG.refresh_token.deleted_from_db_after_days,
    );
    return this.postgresService.refreshToken
      .deleteMany({
        where: {
          created_at: {
            lte: deleteTime,
          },
        },
      })
      .then(({ count }) => {
        this.logger.log(`Deleted ${count} old refresh tokens.`);
      });
  }
}
