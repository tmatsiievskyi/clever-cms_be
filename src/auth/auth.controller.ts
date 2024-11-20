import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp() {
    return this.authService.handleSignUp();
  }

  @Post('sign-in')
  signIn() {
    return 'sign-in';
  }
}
