import { Request } from 'express';

// Lo ÚNICO que guardamos dentro del token: el id del usuario
export interface JwtPayload {
  sub: number; // "subject": el id del usuario
}

// El usuario sin el hash. El AuthGuard lo saca de la base de datos
export interface PublicUser {
  id: number;
  email: string;
  role: string;
}

// Una petición que ya ha pasado por el AuthGuard: lleva el usuario dentro
export interface AuthRequest extends Request {
  user: PublicUser;
}
