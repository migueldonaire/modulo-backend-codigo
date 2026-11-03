// Ejercicio 7: el PATCH de productos con updateOne en lugar de findOneAndUpdate.
//
// No está montado en la API. Para probarlo, en src/index.ts cambia
//   app.use("/api/products", productsRouter);
// por
//   app.use("/api/products", patchWithUpdateOne, productsRouter);
// e importa: import patchWithUpdateOne from "./soluciones/ejercicio-07-patch-updateOne";
// (al ir delante, su PATCH responde antes que el del router de productos)
import { Router } from "express";
import { ObjectId } from "mongodb";
import { productsCollection, validateProduct } from "../routes/products";
import type { Product } from "../routes/products";

const router = Router();

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

  const id = new ObjectId(req.params.id);

  // updateOne NO devuelve el documento: devuelve { matchedCount, modifiedCount, ... }
  const result = await productsCollection().updateOne({ _id: id }, { $set: changes });

  // matchedCount = cuántos documentos cumplían el filtro. 0 → no existe.
  if (result.matchedCount === 0) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  // Para devolver el producto modificado hace falta una segunda consulta.
  // findOneAndUpdate hace las dos cosas en una sola operación.
  const updated = await productsCollection().findOne({ _id: id });
  res.json(updated);
});

export default router;
