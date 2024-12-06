import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TJwtRefreshToken } from '../_types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users';
import { TRequest } from '@common/types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: TRequest) => {
          return req?.cookies?.refresh_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(payload: TJwtRefreshToken) {
    const authUser = await this.usersService.findById(payload.sub);
    if (!authUser) throw new UnauthorizedException();

    return {
      attributes: authUser,
      refreshTokenExpires: new Date(payload.exp * 1000),
    };
  }
}
