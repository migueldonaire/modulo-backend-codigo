import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmailsProcessor } from './emails.processor';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    DatabaseModule,
    BullModule.registerQueue({ name: 'emails' }), // la cola "emails"
  ],
  controllers: [OrdersController],
  providers: [OrdersService, EmailsProcessor],
})
export class OrdersModule {}
