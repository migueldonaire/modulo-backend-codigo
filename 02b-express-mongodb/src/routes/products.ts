import { Router } from "express";
import { ObjectId } from "mongodb";
import { getDb } from "../db";

const router = Router();

type Product = {
  name: string;
  price: number;
};

function productsCollection() {
  return getDb().collection<Product>("products");
}

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

router.get("/", async (_req, res) => {
  const products = await productsCollection().find().toArray();
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
    price: body.price
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

  if (body.name === undefined && body.price === undefined) {
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
