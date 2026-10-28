import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'node:crypto';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';

// Guardamos un hash del token, nunca el token
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class RefreshTokensService {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly config: ConfigService,
  ) {}

  // Crea un refresh token para el usuario y lo devuelve
  async create(userId: number): Promise<string> {
    const token = randomBytes(32).toString('base64url');
    const days = Number(this.config.get('REFRESH_TOKEN_EXPIRES_IN_DAYS') ?? 7);

    await this.pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + make_interval(days => $3))`,
      [userId, hashToken(token), days],
    );

    return token;
  }

  // Gasta el token: lo borra y devuelve su usuario.
  // Si no existe o ha caducado, devuelve undefined.
  async consume(token: string): Promise<number | undefined> {
    const result = await this.pool.query<{ user_id: number }>(
      `DELETE FROM refresh_tokens
       WHERE token_hash = $1 AND expires_at > NOW()
       RETURNING user_id`,
      [hashToken(token)],
    );

    return result.rows[0]?.user_id;
  }

  // Revoca un token (cerrar sesión)
  async revoke(token: string): Promise<void> {
    await this.pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1', [
      hashToken(token),
    ]);
  }

  // Revoca todos los tokens de un usuario (cerrar sesión en todos los dispositivos)
  async revokeAllForUser(userId: number): Promise<void> {
    await this.pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [
      userId,
    ]);
  }
}
