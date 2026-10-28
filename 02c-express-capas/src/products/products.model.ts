// Modelo: los datos y las operaciones para leerlos y guardarlos.
// Es el único archivo que sabe dónde viven los productos (ahora, en un array).

export type Product = {
  id: number;
  name: string;
  price: number;
};

let nextId = 3;

const products: Product[] = [
  { id: 1, name: "Teclado", price: 29.99 },
  { id: 2, name: "Ratón", price: 15 }
];

export function findAll(): Product[] {
  return products;
}

export function findById(id: number): Product | undefined {
  return products.find((item) => item.id === id);
}

export function insert(data: Omit<Product, "id">): Product {
  const product = { id: nextId++, ...data };
  products.push(product);
  return product;
}

export function update(id: number, changes: Partial<Omit<Product, "id">>): Product | undefined {
  const product = findById(id);
  if (!product) return undefined;

  Object.assign(product, changes);
  return product;
}

export function remove(id: number): boolean {
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) return false;

  products.splice(index, 1);
  return true;
}
