import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENV } from '@/config/environment.config';
import * as bcrypt from 'bcrypt';
import { type SignupDto } from '../dto/signup.dto';
import { type LoginDto } from '../dto/login.dto';
import { CacheService } from '@/modules/cache/service/cache.service';
import { ACCESS_TOKEN_CACHE_KEY } from '../constant/access-token-cache.const';
import { User } from '@/modules/user/entity/user.entity';
import { UserService } from '@/modules/user/service/user.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    private readonly userService: UserService,
  ) {}

  async signup(user: SignupDto): Promise<Omit<User, 'password'>> {
    const userExists = await this.userService.exists({
      where: [{ username: user.username }, { email: user.email }],
    });
    if (userExists) {
      throw new ConflictException('Tên đăng nhập hoặc email đã tồn tại!');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUserInput: CreateUserDto = { ...user, password: hashedPassword };

    const createdUser = await this.userService.createOne(newUserInput);

    const { password: _, ...userWithoutPassword } = createdUser;

    return userWithoutPassword;
  }

  async login(credential: LoginDto): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    const user = await this.userService.findOneOrThrow({
      where: {
        username: credential.username,
      },
    });

    const passwordMatch = await bcrypt.compare(credential.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Mật khẩu không đúng, vui lòng thử lại!');
    }

    const accessToken = this.signAccessToken({
      id: user.id,
      role: user.role,
      jti: uuidv4(),
    });
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken };
  }

  async logout(token: AccessTokenPayload): Promise<void> {
    return this.cacheService.set(ACCESS_TOKEN_CACHE_KEY.blackList(token.jti), '1', ENV.JWT.ACCESS_TOKEN_EXPIRES_IN);
  }

  async verifyAccessToken(accessToken: string): Promise<AccessTokenPayload> {
    try {
      const decoded = this.jwtService.verify<AccessTokenPayload>(accessToken, {
        secret: ENV.JWT.ACCESS_TOKEN_SECRET,
      });
      const isBlackListed = await this.cacheService.exists(ACCESS_TOKEN_CACHE_KEY.blackList(decoded.jti));
      if (isBlackListed) {
        throw new UnauthorizedException('Token is expired (2)!');
      }
      return decoded;
    } catch {
      throw new UnauthorizedException('Token is expired (1)!');
    }
  }

  private signAccessToken(payload: AccessTokenPayload): string {
    return this.jwtService.sign(payload, {
      algorithm: 'HS256',
      expiresIn: `${ENV.JWT.ACCESS_TOKEN_EXPIRES_IN}s`,
      secret: ENV.JWT.ACCESS_TOKEN_SECRET,
    });
  }
}
