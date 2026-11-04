import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './book';
import { BooksRepository } from './books.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  // El servicio pide "un BooksRepository". No sabe si es memoria o PostgreSQL.
  constructor(private readonly booksRepository: BooksRepository) {}

  async findAll(author?: string): Promise<Book[]> {
    const books = await this.booksRepository.findAll();
    if (!author) {
      return books;
    }
    return books.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase()),
    );
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findById(id);
    if (!book) {
      throw new NotFoundException('Libro no encontrado'); // → 404
    }
    return book;
  }

  create(dto: CreateBookDto): Promise<Book> {
    return this.booksRepository.create(dto);
  }

  async update(id: number, dto: UpdateBookDto): Promise<Book> {
    if (
      dto.title === undefined &&
      dto.author === undefined &&
      dto.pages === undefined
    ) {
      throw new BadRequestException('Envía al menos un campo'); // → 400
    }
    const book = await this.findOne(id); // si no existe, lanza el 404

    // Los campos que no llegan se quedan como estaban
    return this.booksRepository.update(id, {
      title: dto.title ?? book.title,
      author: dto.author ?? book.author,
      pages: dto.pages ?? book.pages,
    });
  }

  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id); // si no existe, lanza el 404
    await this.booksRepository.remove(id);
    return book; // el PRD pide devolver el libro borrado
  }
}
