import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA, // este servicio solo escucha a Kafka
      options: {
        client: {
          clientId: 'notifications-service',
          brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
        },
        consumer: {
          groupId: 'notifications', // el grupo de consumidores de este servicio
        },
        // Grupo nuevo: lee el topic desde el principio. Si no, sigue por donde iba
        subscribe: { fromBeginning: true },
      },
    },
  );
  app.enableShutdownHooks(); // con Ctrl + C se despide de Kafka antes de cerrarse
  await app.listen();
  console.log('notifications-service escuchando eventos de Kafka');
}
bootstrap();
