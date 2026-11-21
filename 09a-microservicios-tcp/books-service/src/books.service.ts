import { Injectable } from '@nestjs/common';
import { Book, NewBook } from './book';

@Injectable()
export class BooksService {
  // Los libros viven en memoria, solo dentro de este servicio
  private books: Book[] = [
    {
      id: 1,
      title: 'Cien años de soledad',
      author: 'Gabriel García Márquez',
      price: 12,
      stock: 5,
    },
    {
      id: 2,
      title: 'El principito',
      author: 'Antoine de Saint-Exupéry',
      price: 8,
      stock: 10,
    },
    {
      id: 3,
      title: 'Crónica de una muerte anunciada',
      author: 'Gabriel García Márquez',
      price: 9,
      stock: 2,
    },
  ];
  private nextId = 4;

  findAll(): Book[] {
    return this.books;
  }

  // Si no existe devuelve null: quien pregunta decide qué hacer
  findOne(id: number): Book | null {
    return this.books.find((book) => book.id === id) ?? null;
  }

  create(data: NewBook): Book {
    const book: Book = { id: this.nextId++, ...data };
    this.books.push(book);
    return book;
  }
}
