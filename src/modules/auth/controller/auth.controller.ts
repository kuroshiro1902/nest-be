import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ZodBody, DevOnlyApiRequestLog, DevOnlyApiResponseLog } from '@/modules/common/decorators';

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
  @HttpCode(HttpStatus.OK)
  async login(@ZodBody(LoginDto) loginInput: LoginDto) {
    return this.authService.login(loginInput);
  }
}
