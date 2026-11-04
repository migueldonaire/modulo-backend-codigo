import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest, JwtPayload } from './jwt-payload';

// AUTENTICACIÓN: ¿el token es bueno? Si no → 401
// Solo mira el token. No va a la base de datos.
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Cogemos la petición (el req de Express)
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // 2. Separamos "Bearer" del token
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta el token');
    }

    try {
      // 3. Comprobamos la firma y la caducidad. Si algo falla, salta al catch
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);

      // 4. Apuntamos en la petición el id que venía en el token
      request.userId = payload.sub;
      return true; // puede pasar
    } catch {
      throw new UnauthorizedException('Token no válido o caducado');
    }
  }
}
