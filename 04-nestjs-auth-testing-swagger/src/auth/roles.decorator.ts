import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/users.service';

export const ROLES_KEY = 'roles';

// Uso: @Roles('admin')
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
