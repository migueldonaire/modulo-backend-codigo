import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthRequest, JwtPayload } from './jwt-payload';

// AUTENTICACIÓN: ¿quién eres? Sin un token válido → 401
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Cogemos la petición (el req de Express)
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // 2. Separamos "Bearer" del token
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Falta el token');
    }

    // 3. Comprobamos la firma y la caducidad, y sacamos el id
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token no válido o caducado');
    }

    // 4. Buscamos al usuario en la base de datos, AHORA
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe');
    }

    // 5. Guardamos en la petición el usuario de la base de datos (sin el hash)
    request.user = { id: user.id, email: user.email, role: user.role };
    return true; // puede pasar
  }
}
