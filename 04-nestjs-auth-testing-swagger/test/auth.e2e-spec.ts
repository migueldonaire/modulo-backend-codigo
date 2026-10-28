import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PG_POOL } from '../src/database/database.module';

describe('Autenticación (integración)', () => {
  let app: INestApplication<App>;
  let pool: Pool;

  const ana = { email: 'ana@local.test', password: 'unaPasswordLarga1' };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app);
    await app.init();

    pool = app.get(PG_POOL);
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE users RESTART IDENTITY CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  it('registrar dos veces el mismo correo devuelve 409', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(ana)
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(ana)
      .expect(409);
  });

  it('GET /api/auth/me devuelve el usuario del token', async () => {
    await request(app.getHttpServer()).post('/api/auth/register').send(ana);
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(ana)
      .expect(200);
    const { accessToken } = login.body as { accessToken: string };

    const res = await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toEqual({ id: 1, email: 'ana@local.test', role: 'user' });
  });

  it('el refresh token se puede usar una sola vez y logout lo revoca', async () => {
    await request(app.getHttpServer()).post('/api/auth/register').send(ana);
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(ana)
      .expect(200);
    const first = (login.body as { refreshToken: string }).refreshToken;

    // Lo cambiamos por uno nuevo
    const refreshed = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: first })
      .expect(200);
    const second = (refreshed.body as { refreshToken: string }).refreshToken;
    expect(second).not.toBe(first);

    // El primero ya está gastado
    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: first })
      .expect(401);

    // Cerramos sesión: el segundo deja de valer
    await request(app.getHttpServer())
      .post('/api/auth/logout')
      .send({ refreshToken: second })
      .expect(204);
    await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: second })
      .expect(401);
  });
});
