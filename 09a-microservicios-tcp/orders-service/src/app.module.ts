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
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class AppModule {}
