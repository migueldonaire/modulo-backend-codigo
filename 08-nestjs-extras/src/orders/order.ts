// Una fila del JOIN entre orders, order_items y books
export interface OrderRow {
  id: number;
  created_at: Date;
  book_id: number;
  title: string;
  quantity: number;
}

// Una línea del pedido, como la devuelve la API
export interface OrderItem {
  bookId: number;
  title: string;
  quantity: number;
}

// Un pedido con sus líneas dentro
export interface Order {
  id: number;
  createdAt: Date;
  items: OrderItem[];
}

// Varias filas (una por línea) → un solo pedido con sus líneas
export function toOrder(rows: OrderRow[]): Order {
  return {
    id: rows[0].id,
    createdAt: rows[0].created_at,
    items: rows.map((row) => ({
      bookId: row.book_id,
      title: row.title,
      quantity: row.quantity,
    })),
  };
}
