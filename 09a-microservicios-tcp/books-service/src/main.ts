import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // createMicroservice en vez de create: no es una API HTTP
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP, // hablamos por TCP, el transporte más sencillo
      options: {
        host: '0.0.0.0', // acepta conexiones desde cualquier máquina
        port: 3001, // el puerto donde escucha este servicio
      },
    },
  );
  await app.listen();
  console.log('books-service escuchando por TCP en el puerto 3001');
}
bootstrap();
