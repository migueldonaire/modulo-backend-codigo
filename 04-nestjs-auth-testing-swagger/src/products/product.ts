// Así llega una fila desde PostgreSQL
export type ProductRow = {
  id: number;
  name: string;
  price: string; // NUMERIC llega como texto
  created_at: Date;
};

// Así la devuelve nuestra API
export type Product = {
  id: number;
  name: string;
  price: number;
  createdAt: Date;
};

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    createdAt: row.created_at,
  };
}
