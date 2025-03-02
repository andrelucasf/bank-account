import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

interface UserAuth {
  username: string;
  pass: string;
}

@Controller('login')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() body: UserAuth): { token: string } {
    try {
      return { token: this.authService.validateUser(body.username, body.pass) };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
