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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { EmployeeGuard } from '../auth/employee.guard';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books') // agrupa estas rutas en Swagger
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
  @UseGuards(AuthGuard, EmployeeGuard) // solo empleados con sesión
  @ApiBearerAuth() // en Swagger: esta ruta necesita token
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Patch(':id') // PATCH /api/books/1
  @UseGuards(AuthGuard, EmployeeGuard) // solo empleados con sesión
  @ApiBearerAuth() // en Swagger: esta ruta necesita token
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id') // DELETE /api/books/1  → 200 con el libro borrado
  @UseGuards(AuthGuard, EmployeeGuard) // solo empleados con sesión
  @ApiBearerAuth() // en Swagger: esta ruta necesita token
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
