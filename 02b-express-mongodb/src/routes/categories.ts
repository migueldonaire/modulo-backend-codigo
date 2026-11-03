// Reto 2: el CRUD de categorías del apunte 02 (ejercicio 13), ahora en MongoDB.
// El nombre no se repite gracias a un índice único (ver connectDb en src/db.ts
// y mongo/seed.js). Si se repite, el driver lanza un error con code 11000 → 409.
import { Router } from "express";
import { MongoServerError, ObjectId } from "mongodb";
import { getDb } from "../db";

const router = Router();

type Category = {
  name: string;
};

function categoriesCollection() {
  return getDb().collection<Category>("categories");
}

// ¿Es el error de "clave duplicada" del índice único?
function isDuplicateKey(err: unknown): boolean {
  return err instanceof MongoServerError && err.code === 11000;
}

// Devuelve un mensaje de error, o null si el nombre es válido
function validateName(name: unknown): string | null {
  if (typeof name !== "string" || name.trim() === "") {
    return "El nombre debe ser un texto no vacío";
  }
  return null;
}

router.get("/", async (_req, res) => {
  const categories = await categoriesCollection().find().toArray();
  res.json(categories);
});

router.get("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: "El ID no tiene un formato válido" });
    return;
  }

  const category = await categoriesCollection().findOne({ _id: new ObjectId(req.params.id) });

  if (!category) {
    res.status(404).json({ error: "Categoría no encontrada" });
    return;
  }

  res.json(category);
});

router.post("/", async (req, res) => {
  const { name } = req.body ?? {};
  const error = validateName(name);

  if (error) {
    res.status(400).json({ error });
    return;
  }

  const newCategory: Category = { name: name.trim() };

  try {
    const result = await categoriesCollection().insertOne(newCategory);
    res.status(201).json({ _id: result.insertedId, ...newCategory });
  } catch (err) {
    if (isDuplicateKey(err)) {
      res.status(409).json({ error: "Ya existe una categoría con ese nombre" });
      return;
    }
    throw err; // cualquier otro error, al middleware de errores (500)
  }
});

router.patch("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: "El ID no tiene un formato válido" });
    return;
  }

  const { name } = req.body ?? {};

  if (name === undefined) {
    res.status(400).json({ error: "Debes enviar al menos un campo para modificar" });
    return;
  }

  const error = validateName(name);

  if (error) {
    res.status(400).json({ error });
    return;
  }

  try {
    const updated = await categoriesCollection().findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { name: name.trim() } },
      { returnDocument: "after" }
    );

    if (!updated) {
      res.status(404).json({ error: "Categoría no encontrada" });
      return;
    }

    res.json(updated);
  } catch (err) {
    if (isDuplicateKey(err)) {
      res.status(409).json({ error: "Ya existe una categoría con ese nombre" });
      return;
    }
    throw err;
  }
});

router.delete("/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: "El ID no tiene un formato válido" });
    return;
  }

  const result = await categoriesCollection().deleteOne({ _id: new ObjectId(req.params.id) });

  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Categoría no encontrada" });
    return;
  }

  res.status(204).send();
});

export default router;
