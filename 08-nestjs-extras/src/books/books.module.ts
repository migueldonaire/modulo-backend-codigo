import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EventsModule } from '../events/events.module';
import { RedisModule } from '../redis/redis.module';
import { BooksController } from './books.controller';
import { BooksResolver } from './books.resolver';
import { BooksService } from './books.service';

@Module({
  imports: [DatabaseModule, RedisModule, EventsModule],
  controllers: [BooksController],
  providers: [BooksService, BooksResolver],
  exports: [BooksService], // CoversModule lo usa
})
export class BooksModule {}
