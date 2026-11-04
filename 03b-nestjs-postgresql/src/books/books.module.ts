import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { BooksController } from './books.controller';
import { BooksRepository } from './books.repository';
import { BooksRepositoryMemory } from './books.repository.memory';
import { BooksRepositoryPostgres } from './books.repository.postgres';
import { BooksService } from './books.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BooksController],
  providers: [
    BooksService,
    // Cuando alguien pida un BooksRepository, NestJS le da...
    { provide: BooksRepository, useClass: BooksRepositoryPostgres },
    // { provide: BooksRepository, useClass: BooksRepositoryMemory },
  ],
})
export class BooksModule {}
