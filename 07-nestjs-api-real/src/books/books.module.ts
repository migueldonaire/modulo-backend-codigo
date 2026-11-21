import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [DatabaseModule], // para poder pedir el Pool
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
