import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from './dto';
import { UsersService } from '../users';
import { Crypting, getFromObj, removeFromObj } from '@common/utils';

import { JwtService } from '@nestjs/jwt';
import { TUser } from '@common/types';
import { ConfigService } from '@nestjs/config';
import { TUserIncludes } from '../users/users.repo';
import { RefreshTokenRepo } from './refreshToken.repo';
import { RefreshToken } from '@prisma/client';

@Injectable()
export class AuthService {
  private DATA_IN_ACCESS_TOKEN = [
    'email',
    'id',
    'organization',
    'units',
    'roles',
    'policies',
  ];
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepo: RefreshTokenRepo,
  ) {}

  async handleSignUp(signUpData: SignUpDto) {
    const hashedPassword = await Crypting.hashString(signUpData.password);

    const createdUser = await this.usersService.create({
      ...signUpData,
      password: hashedPassword,
    });
    return removeFromObj(createdUser, ['password']);
  }

  async handleSignIn(userId: number) {
    // const user = await this.validateUser(signInData.email, signInData.password);

    const user = await this.usersService.findById(userId, {
      organization: true,
      units: true,
      roles: true,
      policies: true,
    });

    const tokens = await this.getAuthTokens(user);

    const hashedRefToken = await Crypting.hashString(
      tokens.refresh_token.token,
    );

    await this.refreshTokenRepo.create({
      data: {
        token: hashedRefToken,
        userId: user.id,
        expiresAt: new Date(
          new Date().getTime() + tokens.refresh_token.expiresIn * 1000,
        ),
      },
    });

    const cookies = {
      access_tokenCookies: this.getCookieForToken(
        'access_token',
        tokens.access_token.token,
        tokens.access_token.expiresIn,
      ),
      refresh_tokenCookies: this.getCookieForToken(
        'refresh_token',
        tokens.refresh_token.token,
        tokens.refresh_token.expiresIn,
      ),
      signed_in: `signed_in=true Path=/; Max-Age=${tokens.access_token.expiresIn}`,
    };

    return { user: removeFromObj(user, ['password']), tokens, cookies };
  }

  async validateUser(
    email: string,
    password: string,
    includes?: TUserIncludes,
  ): Promise<TUser | null> {
    const user = await this.usersService.findByEmail(email, includes);

    // if (!user.isVerified) { //TODO: add
    //   throw new UnauthorizedException('Email is not verified');
    // }

    if (user) {
      const pwMatch = await Crypting.compareStrings(user.password, password);
      return pwMatch ? user : null;
    }
    return null;
  }

  async getAuthTokens(user: TUser) {
    const payload = getFromObj(user, this.DATA_IN_ACCESS_TOKEN);

    const accessTokenExpiresIn = Number(
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    );
    const refreshTokenExpiresIn = Number(
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    );

    const tokens = {
      access_token: {
        token: this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: accessTokenExpiresIn,
        }),
        expiresIn: accessTokenExpiresIn,
      },
      refresh_token: {
        token: this.jwtService.sign(
          { sub: user.id },
          {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: refreshTokenExpiresIn,
          },
        ),
        expiresIn: refreshTokenExpiresIn,
      },
    };

    return tokens;
  }

  async handleRefresh(userId: number, refreshToken: string, expiresAt: Date) {
    const user = await this.usersService.findById(userId, {
      organization: true,
      units: true,
      roles: true,
      policies: true,
      refreshToken: true,
    });

    const { refreshToken: refreshTokensInDB, ...restUser } = user;

    const tokenMatch = await this.isTokenInDBMatch(
      refreshTokensInDB,
      refreshToken,
    );

    if (!tokenMatch || !tokenMatch.isMatch || new Date(expiresAt) < new Date())
      throw new UnauthorizedException('Invalid refresh_token');

    const tokens = await this.getAuthTokens(restUser);

    const hashedRefToken = await Crypting.hashString(
      tokens.refresh_token.token,
    );

    await this.refreshTokenRepo.update({
      where: {
        token: tokenMatch.refreshToken.token,
        userId: userId,
      },
      data: {
        token: hashedRefToken,
        expiresAt: new Date(
          new Date().getTime() + tokens.refresh_token.expiresIn * 1000,
        ),
      },
    });

    const cookies = {
      access_tokenCookies: this.getCookieForToken(
        'access_token',
        tokens.access_token.token,
        tokens.access_token.expiresIn,
      ),
      refresh_tokenCookies: this.getCookieForToken(
        'refresh_token',
        tokens.refresh_token.token,
        tokens.refresh_token.expiresIn,
      ),
      signed_in: `signed_in=true Path=/; Max-Age=${tokens.access_token.expiresIn}`,
    };

    return { user: removeFromObj(user, ['password']), tokens, cookies };
  }

  async handleGetMe(userId: number) {
    const user = await this.usersService.findById(userId, {
      organization: true,
      units: true,
      roles: true,
      policies: true,
    });

    return removeFromObj(user, ['password']);
  }

  getCookieForToken(name: string, token: string, maxAge: number) {
    return `${name}=${token}; HttpOnly; Path=/; Max-Age=${maxAge}`;
  }

  async isTokenInDBMatch(
    tokensInDB: RefreshToken[],
    currentRefreshToken: string,
  ) {
    const comparePromises = tokensInDB.map(async (refreshToken) => {
      const isMatch = await Crypting.compareStrings(
        refreshToken.token,
        currentRefreshToken,
      );
      return { isMatch, refreshToken };
    });

    const result = await Promise.all(comparePromises);

    return result.find((res) => res.isMatch);
  }
}
