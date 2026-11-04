import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { Book, BookData } from './book';
import { BooksRepository } from './books.repository';

// ADAPTADOR 2: guarda los libros en PostgreSQL
@Injectable()
export class BooksRepositoryPostgres implements BooksRepository {
  // Inyección: NestJS nos pasa el Pool que crea DatabaseModule
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Book[]> {
    const result = await this.pool.query<Book>(
      'SELECT id, title, author, pages FROM books ORDER BY id',
    );
    return result.rows; // rows es un array con las filas
  }

  async findById(id: number): Promise<Book | undefined> {
    const result = await this.pool.query<Book>(
      'SELECT id, title, author, pages FROM books WHERE id = $1',
      [id], // $1 se rellena con este valor (nunca lo metas dentro del texto)
    );
    return result.rows[0]; // undefined si no hay ninguna fila
  }

  async create(data: BookData): Promise<Book> {
    const result = await this.pool.query<Book>(
      `INSERT INTO books (title, author, pages)
       VALUES ($1, $2, $3)
       RETURNING id, title, author, pages`,
      [data.title, data.author, data.pages],
    );
    return result.rows[0]; // RETURNING nos devuelve el libro guardado, con su id
  }

  async update(id: number, data: BookData): Promise<Book> {
    const result = await this.pool.query<Book>(
      `UPDATE books
       SET title = $1, author = $2, pages = $3
       WHERE id = $4
       RETURNING id, title, author, pages`,
      [data.title, data.author, data.pages, id],
    );
    return result.rows[0];
  }

  async remove(id: number): Promise<void> {
    await this.pool.query('DELETE FROM books WHERE id = $1', [id]);
  }
}
