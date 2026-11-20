// Así es un libro en el servicio de libros
export interface Book {
  id: number;
  title: string;
  author: string;
  price: number; // en euros
  stock: number; // unidades en el almacén
}

// Lo que llega para crear un libro (todo menos el id)
export type NewBook = Omit<Book, 'id'>;
