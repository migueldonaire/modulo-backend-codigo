// Reto 1: devolver "id" (texto) en lugar de "_id", sin cambiar lo que se guarda en MongoDB.
//
// Es el router de productos completo usando toApi() en todas las respuestas.
// Para usarlo, en src/index.ts cambia el import de productsRouter por:
//   import productsRouter from "./soluciones/reto-1-products-id";
import { Router } from "express";
import { ObjectId } from "mongodb";
import type { WithId } from "mongodb";
import { productsCollection, validateProduct } from "../routes/products";
import type { Product } from "../routes/products";

const router = Router();

// Convierte un documento de MongoDB en lo que devuelve la API
function toApi(document: WithId<Product>) {
  const { _id, ...rest } = document;
  return { id: _id.toHexString(), ...rest };
}

router.get("/", async (req, res) => {
  const filter: { category?: string; name?: { $regex: string; $options: string } } = {};

  if (typeof req.query.category === "string") {
    filter.category = req.query.category;
  }

  if (typeof req.query.search === "string") {
    filter.name = { $regex: req.query.search, $options: "i" };
  }

  const products = await productsCollection().find(filter).toArray();
  res.json(products.map(toApi));
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

  res.json(toApi(product));
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
    category: body.category?.trim() ?? "sin-categoria"
  };

  const result = await productsCollection().insertOne(newProduct);

  res.status(201).json(toApi({ _id: result.insertedId, ...newProduct }));
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

  res.json(toApi(updated));
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
