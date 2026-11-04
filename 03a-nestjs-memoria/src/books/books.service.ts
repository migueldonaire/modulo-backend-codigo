import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './book';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable() // NestJS puede crear esta clase e inyectarla donde se pida
export class BooksService {
  // Los libros viven en memoria: se pierden al reiniciar
  private books: Book[] = [
    {
      id: 1,
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      pages: 471,
    },
    {
      id: 2,
      title: 'El principito',
      author: 'Antoine de Saint-Exupéry',
      pages: 96,
    },
    {
      id: 3,
      title: 'Crónica de una muerte anunciada',
      author: 'Gabriel García Márquez',
      pages: 122,
    },
  ];
  private nextId = 4;

  // GET /api/books  y  GET /api/books?author=garcia
  findAll(author?: string): Book[] {
    if (!author) {
      return this.books;
    }
    return this.books.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase()),
    );
  }

  // GET /api/books/:id
  findOne(id: number): Book {
    const book = this.books.find((b) => b.id === id);
    if (!book) {
      throw new NotFoundException('Libro no encontrado'); // → 404
    }
    return book;
  }

  // POST /api/books
  create(dto: CreateBookDto): Book {
    const book: Book = { id: this.nextId++, ...dto };
    this.books.push(book);
    return book;
  }

  // PATCH /api/books/:id
  update(id: number, dto: UpdateBookDto): Book {
    if (
      dto.title === undefined &&
      dto.author === undefined &&
      dto.pages === undefined
    ) {
      throw new BadRequestException('Envía al menos un campo'); // → 400
    }
    const book = this.findOne(id); // si no existe, findOne ya lanza el 404
    // Cambiamos solo los campos que han llegado
    if (dto.title !== undefined) book.title = dto.title;
    if (dto.author !== undefined) book.author = dto.author;
    if (dto.pages !== undefined) book.pages = dto.pages;
    return book;
  }

  // DELETE /api/books/:id
  remove(id: number): Book {
    const book = this.findOne(id);
    this.books = this.books.filter((b) => b.id !== id);
    return book;
  }
}
