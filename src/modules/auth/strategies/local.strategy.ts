import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TUser } from '@common/types';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<TUser> {
    const user = await this.authService.validateUser(email, password, {
      roles: true,
      organization: true,
      policies: true,
      units: true,
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return user;
  }
}
