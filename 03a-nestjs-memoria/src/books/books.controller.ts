import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books') // todas las rutas de esta clase empiezan por /api/books
export class BooksController {
  // Inyección de dependencias: NestJS crea el servicio y nos lo pasa
  constructor(private readonly booksService: BooksService) {}

  @Get() // GET /api/books  (y  /api/books?author=garcia)
  findAll(@Query('author') author?: string) {
    return this.booksService.findAll(author);
  }

  @Get(':id') // GET /api/books/1
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Post() // POST /api/books  → 201
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Patch(':id') // PATCH /api/books/1
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id') // DELETE /api/books/1  → 200 con el libro borrado
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
