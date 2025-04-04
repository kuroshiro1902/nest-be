import { RequestValidationPipe } from '@/shared/pipes/request-validation.pipe';
import { TUserCreate, UserDefaultDTO, ZUserCreate } from '@/user/models/user.model';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TUserLogin, ZUserLogin } from './models/auth.model';
import { StatusCodes } from 'http-status-codes';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';
import { UserService } from '@/user/user.service';
import { CookieOptions, Request, Response } from 'express';
import { CONFIG } from '@/config/config';

@Controller('auth')
export class AuthController {
  private _cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };
  private _cookieMaxAge = CONFIG.refresh_token.expired_days * 24 * 60 * 60 * 1000;
  private _getRefreshTokenFromCookie = (req: Request) =>
    req.cookies?.[CONFIG.refresh_token.cookie_key] as string | undefined;

  private _clearRefreshTokenFromCookie = (res: Response) =>
    res.clearCookie(CONFIG.refresh_token.cookie_key, this._cookieOptions);

  private _setRefreshTokenToCookie = (res: Response, refreshToken: string) => {
    res.cookie(CONFIG.refresh_token.cookie_key, refreshToken, {
      ...this._cookieOptions,
      maxAge: this._cookieMaxAge,
    });
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('/signup')
  @HttpCode(StatusCodes.CREATED)
  @UsePipes(new RequestValidationPipe(ZUserCreate))
  signUp(@Body() body: TUserCreate) {
    return this.authService.signUp(body);
  }

  @Post('/login')
  @HttpCode(StatusCodes.OK)
  @UsePipes(new RequestValidationPipe(ZUserLogin))
  async logIn(
    @Body() body: TUserLogin,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshFromCookie = this._getRefreshTokenFromCookie(req);
    const resData = await this.authService.logIn({
      ...body,
      refresh_token: refreshFromCookie,
    });
    if (refreshFromCookie) {
      this._clearRefreshTokenFromCookie(res);
    }

    if (resData?.refresh_token) {
      this._setRefreshTokenToCookie(res, resData.refresh_token);
    }

    const { user, access_token } = resData;
    return { user, access_token };
  }

  @Post('/verify')
  @HttpCode(StatusCodes.OK)
  @UseGuards(JwtAccessTokenGuard)
  async verify(@Req() req: Request) {
    const user = await this.userService.findUserById(req.user!.id);
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }
    return UserDefaultDTO(user);
  }

  @Post('/logout')
  @HttpCode(StatusCodes.OK)
  async logOut(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this._getRefreshTokenFromCookie(req);
    if (refreshToken) {
      this._clearRefreshTokenFromCookie(res);
    }
    const responseData = await this.authService.logOut(refreshToken);
    return responseData;
  }

  @Post('/access-token')
  @HttpCode(StatusCodes.OK)
  async getAccessToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = this._getRefreshTokenFromCookie(req);

    try {
      const responseData = await this.authService.refreshAccessToken(refreshToken);
      return responseData;
    } catch {
      this._clearRefreshTokenFromCookie(res);
      throw new UnauthorizedException('Invalid refresh token!');
    }
  }
}
