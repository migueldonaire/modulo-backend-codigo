import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthRequest } from './jwt-payload';

// AUTORIZACIÓN: ¿puedes hacer esto? Va siempre DESPUÉS de AuthGuard
@Injectable()
export class EmployeeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    if (request.user.role !== 'employee') {
      throw new ForbiddenException('Solo para empleados'); // → 403
    }
    return true;
  }
}
