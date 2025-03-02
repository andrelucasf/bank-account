import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly users = [{ username: 'admin', pass: 'admin' }];

  constructor(private readonly jwtService: JwtService) {}

  validateUser(username: string, pass: string): string {
    const user = this.users.find(
      (user) => user.username === username && user.pass === pass,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.jwtService.sign({ username });
  }
}
