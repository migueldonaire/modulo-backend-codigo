import { Request } from 'express';

// Lo que guardamos dentro del token
export interface JwtPayload {
  sub: number; // "subject": el id del usuario
  email: string;
  role: string;
}

// Una petición a la que el AuthGuard ya le ha puesto el usuario
export interface AuthRequest extends Request {
  user: JwtPayload;
}
