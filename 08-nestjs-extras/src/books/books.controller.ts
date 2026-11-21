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
  Version,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ListBooksQueryDto } from './dto/list-books-query.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books') // /api/v1/books (la v1 es la versión por defecto)
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get() // GET /api/v1/books → un array, como siempre
  findAll(@Query('author') author?: string) {
    return this.booksService.findAll(author);
  }

  @Get()
  @Version('2') // GET /api/v2/books → { data, total, page, limit, totalPages }
  findPage(@Query() query: ListBooksQueryDto) {
    return this.booksService.findPage(query);
  }

  @Get(':id') // GET /api/v1/books/1
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Post() // POST /api/v1/books → 201
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Patch(':id') // PATCH /api/v1/books/1
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id') // DELETE /api/v1/books/1 → 200 con el libro borrado
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
