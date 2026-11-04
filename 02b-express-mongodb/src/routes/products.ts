import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db";

const router = Router();

// Ejercicio 5: categoría en cada producto
export type Product = {
  name: string;
  price: number;
  category: string;
};

export function productsCollection() {
  return getDb().collection<Product>("products");
}

// Devuelve un mensaje de error, o null si los datos son válidos.
// partial = true: los campos pueden faltar (para PATCH).
export function validateProduct(
  body: { name?: unknown; price?: unknown; category?: unknown },
  partial: boolean
): string | null {
  const { name, price, category } = body;

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

  // Ejercicio 5: la categoría es opcional, pero si llega tiene que ser un texto
  if (category !== undefined) {
    if (typeof category !== "string" || category.trim() === "") {
      return "La categoría debe ser un texto no vacío";
    }
  }

  return null;
}

// Ejercicios 5 y 6: GET /api/products?category=muebles&search=sil
router.get("/", async (req, res) => {
  const filter: { category?: string; name?: { $regex: string; $options: string } } = {};

  // Ejercicio 5: filtrar por categoría
  if (typeof req.query.category === "string") {
    filter.category = req.query.category;
  }

  // Ejercicio 6: buscar por nombre sin distinguir mayúsculas
  if (typeof req.query.search === "string") {
    filter.name = { $regex: req.query.search, $options: "i" };
  }

  const products = await productsCollection().find(filter).toArray();
  res.json(products);
});

router.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: "El ID no tiene un formato válido" });
    return;
  }

  const product = await productsCollection().findOne({ _id: new ObjectId(req.params.id) });

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json(product);
});

router.post("/", async (req, res) => {
  const body = req.body ?? {};
  const error = validateProduct(body, false);

  if (error) {
    res.status(400).json({ error });
    return;
  }

  const newProduct: Product = {
    name: body.name.trim(),
    price: body.price,
    // Ejercicio 5: si no llega categoría, "sin-categoria"
    category: body.category?.trim() ?? "sin-categoria"
  };

  const result = await productsCollection().insertOne(newProduct);

  res.status(201).json({ _id: result.insertedId, ...newProduct });
});

router.patch("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: "El ID no tiene un formato válido" });
    return;
  }

  const body = req.body ?? {};

  if (body.name === undefined && body.price === undefined && body.category === undefined) {
    res.status(400).json({ error: "Debes enviar al menos un campo para modificar" });
    return;
  }

  const error = validateProduct(body, true);

  if (error) {
    res.status(400).json({ error });
    return;
  }

  // Solo los campos que han llegado
  const changes: Partial<Product> = {};
  if (body.name !== undefined) changes.name = body.name.trim();
  if (body.price !== undefined) changes.price = body.price;
  if (body.category !== undefined) changes.category = body.category.trim();

  const updated = await productsCollection().findOneAndUpdate(
    { _id: new ObjectId(req.params.id) },
    { $set: changes },
    { returnDocument: "after" }
  );

  if (!updated) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: "El ID no tiene un formato válido" });
    return;
  }

  const result = await productsCollection().deleteOne({ _id: new ObjectId(req.params.id) });

  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.status(204).send();
});

export default router;
