import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ZodBody, DevOnlyApiRequestLog, DevOnlyApiResponseLog } from '@/modules/common/decorators';
import { AuthTokenGuard } from '../guard/auth-token.guard';
import { Request } from 'express';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
@DevOnlyApiRequestLog()
@DevOnlyApiResponseLog()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@ZodBody(SignupDto) signupInput: SignupDto) {
    return this.authService.signup(signupInput);
  }

  @Post('login')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  async login(@ZodBody(LoginDto) loginInput: LoginDto) {
    return this.authService.login(loginInput);
  }

  @Post('logout')
  @UseGuards(AuthTokenGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    return this.authService.logout(req.user);
  }
}
