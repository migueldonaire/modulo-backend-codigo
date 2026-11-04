import { Book, BookData } from './book';

// EL PUERTO: qué se puede hacer con los libros guardados, no cómo.
// Es una "abstract class" y no una "interface" porque NestJS necesita
// algo que siga existiendo cuando TypeScript se convierte en JavaScript.
export abstract class BooksRepository {
  abstract findAll(): Promise<Book[]>;
  abstract findById(id: number): Promise<Book | undefined>;
  abstract create(data: BookData): Promise<Book>;
  abstract update(id: number, data: BookData): Promise<Book>;
  abstract remove(id: number): Promise<void>;
}
