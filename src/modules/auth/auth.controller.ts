import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Get,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { ControllerCore } from '@common/core';
import { JwtAuthGuard, JwtRefreshAuthGuard, LocalAuthGuard } from './guards';
import { Public } from './decorators';
import { TReqWithUser, TReqWithUserRefresh } from '@common/types';

@Controller('auth')
export class AuthController extends ControllerCore {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpData: SignUpDto) {
    const data = await this.authService.handleSignUp(signUpData);
    return this.formatSuccessResp({
      data,
      message: 'User successfully registered!',
    });
  }

  @Public()
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Req() req: TReqWithUser) {
    const { user } = req;

    const data = await this.authService.handleSignIn(user.id);
    req.res.setHeader('Set-Cookie', Object.values(data.cookies));
    return this.formatSuccessResp({ data: data.user, message: 'ok' });
  }

  @Public()
  @HttpCode(200)
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-tokens')
  async refreshTokens(@Req() req: TReqWithUserRefresh) {
    if (!req.user.attributes) throw new InternalServerErrorException();

    const data = await this.authService.handleRefresh(
      req.user.attributes.id,
      req.cookies.refresh_token,
      req.user.refreshTokenExpires,
    );

    req.res.setHeader('Set-Cookie', Object.values(data.cookies));
    return this.formatSuccessResp({ data: {}, message: 'ok' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: TReqWithUser) {
    const data = await this.authService.handleGetMe(req.user.id);
    return this.formatSuccessResp({ data, message: 'ok' });
  }
}
