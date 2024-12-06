import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenRepo } from './refreshToken.repo';
import { PrismaModule } from '@common/prisma/prisma.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    PrismaModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    RefreshTokenRepo,
  ],
})
export class AuthModule {}
