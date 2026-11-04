import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Pool } from 'pg';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

describe('API de libros (de verdad, con PostgreSQL)', () => {
  let app: INestApplication;

  // Antes de todos los tests: arrancamos la aplicación entera
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app); // la misma configuración que main.ts
    await app.init();
  });

  // Después de todos: cerramos la conexión y la aplicación
  afterAll(async () => {
    await app.get(Pool).end();
    await app.close();
  });

  it('GET /api/books responde 200 con una lista', async () => {
    const response = await request(app.getHttpServer()).get('/api/books');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/books/999999 responde 404', async () => {
    const response = await request(app.getHttpServer()).get(
      '/api/books/999999',
    );

    expect(response.status).toBe(404);
  });

  it('POST /api/books sin token responde 401', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/books')
      .send({ title: 'Momo', author: 'Michael Ende', pages: 256 });

    expect(response.status).toBe(401);
  });
});
