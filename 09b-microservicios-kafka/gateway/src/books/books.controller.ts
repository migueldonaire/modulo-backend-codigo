import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { callService } from '../call-service';
import { CreateBookDto } from './create-book.dto';

@Controller('books') // GET /api/books, GET /api/books/1, POST /api/books
export class BooksController {
  // Pedimos el cliente por el nombre que pusimos en AppModule
  constructor(
    @Inject('BOOKS_SERVICE') private readonly booksClient: ClientProxy,
  ) {}

  @Get()
  findAll() {
    return callService(this.booksClient, 'get_books', {}); // sin datos
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const book = await callService(this.booksClient, 'get_book', id);
    if (!book) {
      throw new NotFoundException('Libro no encontrado'); // → 404
    }
    return book;
  }

  @Post()
  create(@Body() dto: CreateBookDto) {
    return callService(this.booksClient, 'create_book', dto);
  }
}
