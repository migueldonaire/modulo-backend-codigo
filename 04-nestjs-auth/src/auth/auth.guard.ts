import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest, JwtPayload } from './jwt-payload';

// AUTENTICACIÓN: ¿quién eres? Sin un token válido → 401
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // La cabecera llega así:  Authorization: Bearer eyJhbGciOi...
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta el token');
    }

    try {
      // Comprueba la firma y la caducidad. Si algo falla, lanza un error
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request.user = payload; // así el controlador sabe quién es
      return true; // true = puede pasar
    } catch {
      throw new UnauthorizedException('Token no válido o caducado');
    }
  }
}
