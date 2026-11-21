import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BOOKS_SERVICE',
        transport: Transport.TCP,
        options: { host: process.env.BOOKS_HOST ?? 'localhost', port: 3001 },
      },
      {
        name: 'KAFKA', // el cliente para publicar eventos en Kafka
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'orders-service', // quién publica
            brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'], // dónde está Kafka
          },
          producerOnlyMode: true, // solo publica, no escucha nada
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class AppModule {}
