import { Router } from "express";

const router = Router();

// Ejercicio 12: categoría en cada producto
type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

let nextId = 4;

const products: Product[] = [
  { id: 1, name: "Teclado", price: 29.99, category: "perifericos" },
  { id: 2, name: "Ratón", price: 15, category: "perifericos" },
  { id: 3, name: "Silla", price: 49.5, category: "muebles" }
];

// Ejercicio 11: validación en una sola función.
// Devuelve un mensaje de error, o null si los datos son válidos.
// partial = true: los campos pueden faltar (para PATCH).
function validateProduct(body: { name?: unknown; price?: unknown }, partial: boolean): string | null {
  const { name, price } = body;

  if (name !== undefined || !partial) {
    if (typeof name !== "string" || name.trim() === "") {
      return "El nombre debe ser un texto no vacío";
    }
  }

  if (price !== undefined || !partial) {
    if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
      return "El precio debe ser un número igual o mayor que cero";
    }
  }

  return null;
}

// Ejercicio 13 y reto 1: filtrar por categoría, buscar por nombre y paginar.
// GET /api/products?category=muebles&search=sil&page=1&limit=10
router.get("/", (req, res) => {
  const { category, search } = req.query;

  let result = products;

  // Ejercicio 13.1: filtrar por categoría
  if (typeof category === "string") {
    result = result.filter((product) => product.category === category);
  }

  // Ejercicio 13.2: buscar por nombre sin distinguir mayúsculas y minúsculas
  if (typeof search === "string") {
    const text = search.toLowerCase();
    result = result.filter((product) => product.name.toLowerCase().includes(text));
  }

  // Reto 1: paginación
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);

  if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > 50) {
    res.status(400).json({ error: "page debe ser >= 1 y limit debe estar entre 1 y 50" });
    return;
  }

  const start = (page - 1) * limit;
  res.json(result.slice(start, start + limit));
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "El ID debe ser un número entero" });
    return;
  }

  const product = products.find((item) => item.id === id);

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json(product);
});

router.post("/", (req, res) => {
  const body = req.body ?? {};
  const error = validateProduct(body, false);

  if (error) {
    res.status(400).json({ error });
    return;
  }

  const newProduct: Product = {
    id: nextId++,
    name: body.name.trim(),
    price: body.price,
    // Ejercicio 12: si no llega categoría, "sin-categoria"
    category: typeof body.category === "string" ? body.category : "sin-categoria"
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Ejercicio 14: PUT sustituye el producto entero.
// A diferencia de PATCH, name y price son obligatorios (si falta uno, 400).
// Si no llega category, se pone "sin-categoria", igual que al crear.
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "El ID debe ser un número entero" });
    return;
  }

  const index = products.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  const body = req.body ?? {};
  const error = validateProduct(body, false);

  if (error) {
    res.status(400).json({ error });
    return;
  }

  const replaced: Product = {
    id,
    name: body.name.trim(),
    price: body.price,
    category: typeof body.category === "string" ? body.category : "sin-categoria"
  };

  products[index] = replaced;
  res.json(replaced);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "El ID debe ser un número entero" });
    return;
  }

  const product = products.find((item) => item.id === id);

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  const body = req.body ?? {};

  if (body.name === undefined && body.price === undefined) {
    res.status(400).json({ error: "Debes enviar al menos un campo para modificar" });
    return;
  }

  const error = validateProduct(body, true);

  if (error) {
    res.status(400).json({ error });
    return;
  }

  if (body.name !== undefined) product.name = body.name.trim();
  if (body.price !== undefined) product.price = body.price;

  res.json(product);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "El ID debe ser un número entero" });
    return;
  }

  const index = products.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  products.splice(index, 1);
  res.status(204).send();
});

export default router;
