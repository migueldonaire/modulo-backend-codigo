import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // este sí es una API HTTP

  app.setGlobalPrefix('api'); // todas las rutas empiezan por /api

  // El gateway es la puerta: aquí se validan los datos que llegan
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
  console.log('gateway escuchando en http://localhost:3000');
}
bootstrap();
