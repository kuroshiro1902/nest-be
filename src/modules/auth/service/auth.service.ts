import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ENV } from '@/config/environment.config';
import * as bcrypt from 'bcrypt';
import { type SignupDto } from '../dto/signup.dto';
import { type LoginDto } from '../dto/login.dto';
import { type TAccessTokenPayload } from '../dto/access-token-payload.dto';
import { CacheService } from '@/modules/cache/service/cache.service';
import { ACCESS_TOKEN_CACHE } from '../constant/access-token-cache.const';
import { User } from '@/modules/user/entity/user.entity';
import { UserService } from '@/modules/user/service/user.service';
import { CreateUserDto } from '@/modules/user/dto/create-user.dto';

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

    const accessToken = await this.cacheService.getOrSet(
      ACCESS_TOKEN_CACHE.key(user.id),
      () => this.signAccessToken({ id: user.id, role: user.role }),
      ENV.JWT.ACCESS_TOKEN_EXPIRES_IN,
    );

    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken };
  }

  verifyAccessToken(accessToken: string): TAccessTokenPayload {
    try {
      const decoded = this.jwtService.verify<TAccessTokenPayload>(accessToken, {
        secret: ENV.JWT.ACCESS_TOKEN_SECRET,
      });
      return decoded;
    } catch {
      throw new UnauthorizedException('Token is expired!');
    }
  }

  private signAccessToken(payload: TAccessTokenPayload): string {
    return this.jwtService.sign(
      {
        id: payload.id,
        role: payload.role,
      },
      {
        algorithm: 'HS256',
        expiresIn: `${ENV.JWT.ACCESS_TOKEN_EXPIRES_IN}s`,
        secret: ENV.JWT.ACCESS_TOKEN_SECRET,
      },
    );
  }
}
