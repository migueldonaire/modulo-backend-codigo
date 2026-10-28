import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_POOL } from '../database/database.module';

export type Role = 'user' | 'admin';

export type UserRecord = {
  id: number;
  email: string;
  password_hash: string;
  role: Role;
};

@Injectable()
export class UsersService {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<UserRecord | undefined> {
    const result = await this.pool.query<UserRecord>(
      `SELECT id, email, password_hash, role
       FROM users
       WHERE email = $1`,
      [email],
    );

    return result.rows[0];
  }

  async create(email: string, passwordHash: string): Promise<UserRecord> {
    const result = await this.pool.query<UserRecord>(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, password_hash, role`,
      [email, passwordHash],
    );

    return result.rows[0];
  }
}
