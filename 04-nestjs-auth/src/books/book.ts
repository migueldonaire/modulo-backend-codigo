// Así es un libro en nuestra API
export interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
}

// Un libro sin id (el id lo pone quien guarda el libro)
export type BookData = Omit<Book, 'id'>;
