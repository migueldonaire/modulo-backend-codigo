import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module';
import { CoversController } from './covers.controller';
import { CoversService } from './covers.service';

@Module({
  imports: [BooksModule], // para usar BooksService
  controllers: [CoversController],
  providers: [CoversService],
})
export class CoversModule {}
