import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { TSignup, ZSignup } from '../model/signup.model';
import { zodValidate } from '@/modules/common/utils/zod-validate.util';
import { ZLogin } from '../model/login.model';
import { AuthTokenGuard } from '../guard/auth-token.guard';
import { Request } from 'express';

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

  @Get('me')
  @UseGuards(AuthTokenGuard)
  async verifyToken(@Req() req: Request) {
    return this.authService.getUserById(req.user.id);
  }
}
