import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({ secret: 'test' });
    authService = new AuthService(jwtService);
  });

  it('deve gerar um token para credenciais válidas', () => {
    const token = authService.validateUser('admin', 'admin');
    expect(token).toBeDefined();
  });

  it('deve lançar um erro para credenciais inválidas', () => {
    expect(() => authService.validateUser('user', 'wrong')).toThrow();
  });
});
