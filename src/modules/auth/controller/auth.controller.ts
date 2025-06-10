import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { TSignupInput, ZSignupInput } from '../model/signup-input.model';
import { zodValidate } from '@/modules/common/utils/zod-validate.util';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupInput) {
    return this.authService.signup(zodValidate(ZSignupInput, signupInput));
  }
}
