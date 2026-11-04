import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { Book, BookRow, toBook } from './book';
import { BooksContract } from './books.contract';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService implements BooksContract {
  constructor(private readonly pool: Pool) {} // NestJS nos da el Pool

  async findAll(author?: string): Promise<Book[]> {
    if (!author) {
      const result = await this.pool.query<BookRow>(
        'SELECT id, title, author, pages, created_at FROM books ORDER BY id',
      );
      return result.rows.map(toBook); // cada fila → un libro de la API
    }

    const result = await this.pool.query<BookRow>(
      `SELECT id, title, author, pages, created_at
       FROM books
       WHERE author ILIKE '%' || $1 || '%'
       ORDER BY id`,
      [author],
    );
    return result.rows.map(toBook);
  }

  async findOne(id: number): Promise<Book> {
    const result = await this.pool.query<BookRow>(
      'SELECT id, title, author, pages, created_at FROM books WHERE id = $1',
      [id],
    );
    if (result.rows.length === 0) {
      throw new NotFoundException('Libro no encontrado');
    }
    return toBook(result.rows[0]);
  }

  async create(dto: CreateBookDto): Promise<Book> {
    const result = await this.pool.query<BookRow>(
      `INSERT INTO books (title, author, pages)
       VALUES ($1, $2, $3)
       RETURNING id, title, author, pages, created_at`,
      [dto.title, dto.author, dto.pages],
    );
    return toBook(result.rows[0]);
  }

  async update(id: number, dto: UpdateBookDto): Promise<Book> {
    if (
      dto.title === undefined &&
      dto.author === undefined &&
      dto.pages === undefined
    ) {
      throw new BadRequestException('Envía al menos un campo');
    }
    const book = await this.findOne(id); // 404 si no existe

    const result = await this.pool.query<BookRow>(
      `UPDATE books
       SET title = $1, author = $2, pages = $3
       WHERE id = $4
       RETURNING id, title, author, pages, created_at`,
      [
        dto.title ?? book.title,
        dto.author ?? book.author,
        dto.pages ?? book.pages,
        id,
      ],
    );
    return toBook(result.rows[0]);
  }

  async remove(id: number): Promise<Book> {
    const book = await this.findOne(id); // 404 si no existe
    await this.pool.query('DELETE FROM books WHERE id = $1', [id]);
    return book;
  }
}
