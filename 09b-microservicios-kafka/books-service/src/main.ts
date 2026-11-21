import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Servicio "híbrido": escucha por dos sitios a la vez
  const app = await NestFactory.create(AppModule);

  // 1. Por TCP: preguntas que esperan respuesta (como en la clase anterior)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: '0.0.0.0', port: 3001 },
  });

  // 2. Por Kafka: eventos de otros servicios
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'books-service',
        brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
      },
      consumer: { groupId: 'books' }, // otro grupo: recibe TODOS los eventos
      // Grupo nuevo: lee el topic desde el principio. Si no, sigue por donde iba
      subscribe: { fromBeginning: true },
    },
  });

  app.enableShutdownHooks(); // con Ctrl + C se despide de Kafka antes de cerrarse
  await app.startAllMicroservices(); // arranca los dos
  await app.init(); // no llamamos a listen(): no queremos una API HTTP
  console.log('books-service: TCP en el puerto 3001 y eventos de Kafka');
}
bootstrap();
