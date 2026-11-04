import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { EmployeeGuard } from './employee.guard';

// Crea un "contexto" falso con el usuario que queramos dentro de la petición
function contextWithRole(role: string): ExecutionContext {
  const request = { user: { id: 1, email: 'x@mail.com', role } };
  return {
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('EmployeeGuard', () => {
  const guard = new EmployeeGuard();

  it('deja pasar a un empleado', () => {
    expect(guard.canActivate(contextWithRole('employee'))).toBe(true);
  });

  it('no deja pasar a un cliente (403)', () => {
    expect(() => guard.canActivate(contextWithRole('customer'))).toThrow(
      ForbiddenException,
    );
  });
});
