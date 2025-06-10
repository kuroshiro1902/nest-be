import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { TSignup, ZSignup } from '../model/signup.model';
import { zodValidate } from '@/modules/common/utils/zod-validate.util';
import { ZLogin } from '../model/login.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupInput) {
    return this.authService.signup(zodValidate(ZSignup, signupInput));
  }

  @Post('login')
  async login(@Body() loginInput) {
    return this.authService.login(zodValidate(ZLogin, loginInput));
  }
}
