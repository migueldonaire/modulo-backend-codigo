import { Router } from "express";

const router = Router();

type Product = {
  id: number;
  name: string;
  price: number;
};

let nextId = 3;

const products: Product[] = [
  { id: 1, name: "Teclado", price: 29.99 },
  { id: 2, name: "Ratón", price: 15 }
];

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

router.get("/", (_req, res) => {
  res.json(products);
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
    price: body.price
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
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
