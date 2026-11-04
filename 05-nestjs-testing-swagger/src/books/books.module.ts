import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [DatabaseModule, UsersModule], // el Pool, y UsersService para el AuthGuard
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
