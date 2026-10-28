import { INestApplication, ValidationPipe } from '@nestjs/common';

// Configuración común: la usan main.ts y los tests de integración
export function configureApp(app: INestApplication) {
  // Todas las rutas empiezan por /api
  app.setGlobalPrefix('api');

  // Permite peticiones desde el frontend de React (Vite)
  app.enableCors({ origin: 'http://localhost:5173' });

  // Valida los DTOs en todas las rutas
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
