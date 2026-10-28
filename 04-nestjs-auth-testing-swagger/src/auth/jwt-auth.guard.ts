import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Role } from '../users/users.service';

export type AuthenticatedUser = {
  id: number;
  email: string;
  role: Role;
};

export type AuthenticatedRequest = Request & { user: AuthenticatedUser };

type TokenPayload = { sub: number; email: string; role: Role };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Falta el token de acceso');
    }

    const token = authorization.slice('Bearer '.length);

    try {
      // Comprueba la firma y la caducidad
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token);

      request.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      return true;
    } catch {
      throw new UnauthorizedException('Token no válido o caducado');
    }
  }
}
