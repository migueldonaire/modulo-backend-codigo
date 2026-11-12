import { existsSync } from 'node:fs';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { requestLogger } from './common/request-logger';

// En tu ordenador, lee el .env. En Render no hay .env: las variables las pone Render.
if (existsSync('.env')) process.loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // En Render, las peticiones llegan a través de un proxy:
  // así Express ve la IP de verdad de cada cliente (la usa el límite de peticiones)
  app.set('trust proxy', 1);

  app.use(
    helmet({
      // La página de pruebas de GraphQL carga scripts de internet: sin esto no se ve
      contentSecurityPolicy: false,
      // Deja que el frontend (otro origen) muestre las portadas de /uploads
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(requestLogger); // una línea en la consola por cada petición

  // Archivos tal cual: las portadas en /uploads/... y la página de WebSockets en /
  app.useStaticAssets('uploads', { prefix: '/uploads' });
  app.useStaticAssets('public');

  // Todas las rutas empiezan por /api
  app.setGlobalPrefix('api');

  // Versiones en la URL: /api/v1/..., /api/v2/...
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1', // la ruta que no diga nada es v1
  });

  // Comprueba los DTO en todas las rutas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Todos los errores con la misma forma
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({ origin: 'http://localhost:5173' });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
