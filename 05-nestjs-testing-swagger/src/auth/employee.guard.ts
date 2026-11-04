import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRequest } from './jwt-payload';

// AUTORIZACIÓN: ¿eres empleado? Si no → 403
// Va siempre DESPUÉS de AuthGuard, que ha dejado el id en request.userId
@Injectable()
export class EmployeeGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    // Buscamos al usuario AHORA, para tener su rol actual
    const user = await this.usersService.findById(request.userId);
    if (!user) {
      throw new UnauthorizedException('El usuario ya no existe'); // → 401
    }

    if (user.role !== 'employee') {
      throw new ForbiddenException('Solo para empleados'); // → 403
    }
    return true; // es empleado: puede pasar
  }
}
