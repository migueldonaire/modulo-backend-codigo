import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { Pool } from 'pg';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PG_POOL } from '../src/database/database.module';

describe('API de productos (integración)', () => {
  let app: INestApplication<App>;
  let pool: Pool;
  let adminToken: string;
  let userToken: string;

  // Pide un token a la API, igual que haría el frontend
  async function login(email: string): Promise<string> {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'unaPasswordLarga1' });
    const body = res.body as { accessToken: string };
    return body.accessToken;
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app); // la misma configuración que main.ts
    await app.init();

    pool = app.get(PG_POOL);
  });

  beforeEach(async () => {
    // Cada test empieza con la base de datos de pruebas igual
    await pool.query('TRUNCATE products, users RESTART IDENTITY');
    await pool.query(
      "INSERT INTO products (name, price) VALUES ('Teclado', 29.99), ('Ratón', 15)",
    );

    const hash = await argon2.hash('unaPasswordLarga1');
    await pool.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES ('admin@local.test', $1, 'admin'), ('user@local.test', $1, 'user')`,
      [hash],
    );

    adminToken = await login('admin@local.test');
    userToken = await login('user@local.test');
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/products devuelve la lista', async () => {
    const res = await request(app.getHttpServer()).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject([
      { id: 1, name: 'Teclado', price: 29.99 },
      { id: 2, name: 'Ratón', price: 15 },
    ]);
  });

  it('GET /api/products/999 devuelve 404', async () => {
    await request(app.getHttpServer()).get('/api/products/999').expect(404);
  });

  it('POST sin token devuelve 401', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .send({ name: 'Silla', price: 49.5 })
      .expect(401);
  });

  it('POST con rol user devuelve 403', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Silla', price: 49.5 })
      .expect(403);
  });

  it('POST con rol admin crea el producto y queda guardado', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Silla', price: 49.5 })
      .expect(201);

    expect(res.body).toMatchObject({ id: 3, name: 'Silla', price: 49.5 });

    // Comprobamos que está de verdad en la base de datos
    const fila = await pool.query<{ name: string }>(
      'SELECT name FROM products WHERE id = 3',
    );
    expect(fila.rows[0].name).toBe('Silla');
  });

  it('POST con precio negativo devuelve 400', async () => {
    await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Silla', price: -5 })
      .expect(400);
  });

  it('PATCH de un producto que no existe devuelve 404', async () => {
    await request(app.getHttpServer())
      .patch('/api/products/999')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 10 })
      .expect(404);
  });

  it('DELETE como admin borra el producto', async () => {
    await request(app.getHttpServer())
      .delete('/api/products/1')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);

    await request(app.getHttpServer()).get('/api/products/1').expect(404);
  });
});
