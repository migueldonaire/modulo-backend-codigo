import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

// Crea un ExecutionContext falso con el usuario que queramos
function contextWithUser(role: 'user' | 'admin') {
  return {
    getHandler: () => null,
    getClass: () => null,
    switchToHttp: () => ({
      getRequest: () => ({ user: { id: 1, email: 'a@local.test', role } }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  const reflector = { getAllAndOverride: jest.fn() };
  const guard = new RolesGuard(reflector as unknown as Reflector);

  it('deja pasar si la ruta no tiene @Roles', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    expect(guard.canActivate(contextWithUser('user'))).toBe(true);
  });

  it('deja pasar a un admin en una ruta de admin', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);
    expect(guard.canActivate(contextWithUser('admin'))).toBe(true);
  });

  it('rechaza a un user en una ruta de admin', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);
    expect(() => guard.canActivate(contextWithUser('user'))).toThrow(
      ForbiddenException,
    );
  });
});
