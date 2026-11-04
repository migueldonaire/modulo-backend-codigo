import { Injectable } from '@nestjs/common';
import { Book, BookData } from './book';
import { BooksRepository } from './books.repository';

// ADAPTADOR 1: guarda los libros en un array (se pierden al reiniciar)
@Injectable()
export class BooksRepositoryMemory implements BooksRepository {
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

  async findAll(): Promise<Book[]> {
    return this.books;
  }

  async findById(id: number): Promise<Book | undefined> {
    return this.books.find((book) => book.id === id);
  }

  async create(data: BookData): Promise<Book> {
    const book: Book = { id: this.nextId++, ...data };
    this.books.push(book);
    return book;
  }

  async update(id: number, data: BookData): Promise<Book> {
    const book: Book = { id, ...data };
    this.books = this.books.map((b) => (b.id === id ? book : b));
    return book;
  }

  async remove(id: number): Promise<void> {
    this.books = this.books.filter((book) => book.id !== id);
  }
}
