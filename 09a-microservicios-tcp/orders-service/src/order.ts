// Así es un pedido en el servicio de pedidos
export interface Order {
  id: number;
  bookId: number;
  title: string; // copiamos el título: así no hay que preguntar cada vez
  quantity: number;
  total: number; // precio × cantidad
  createdAt: string;
}

// Lo que llega para crear un pedido
export interface NewOrder {
  bookId: number;
  quantity: number;
}

// Lo que nos interesa de un libro (lo responde books-service)
export interface Book {
  id: number;
  title: string;
  price: number;
  stock: number;
}
