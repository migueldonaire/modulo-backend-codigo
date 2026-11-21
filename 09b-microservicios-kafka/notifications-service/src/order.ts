// Lo que trae el evento 'order-created' (lo publica orders-service)
export interface Order {
  id: number;
  bookId: number;
  title: string;
  quantity: number;
  total: number;
  createdAt: string;
}
