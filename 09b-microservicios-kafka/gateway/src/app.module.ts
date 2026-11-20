import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BooksController } from './books/books.controller';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [
    // Los "clientes": cómo encontrar a cada microservicio
    ClientsModule.register([
      {
        name: 'BOOKS_SERVICE', // el nombre con el que lo pediremos
        transport: Transport.TCP, // el mismo transporte que usa el servicio
        options: {
          host: process.env.BOOKS_HOST ?? 'localhost', // dónde está
          port: 3001, // en qué puerto escucha
        },
      },
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ORDERS_HOST ?? 'localhost',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [BooksController, OrdersController],
})
export class AppModule {}
