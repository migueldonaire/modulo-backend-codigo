// Ejercicio 13: CRUD de categorías en memoria, montado en /api/categories
import { Router } from "express";

const router = Router();

type Category = {
  id: number;
  name: string;
};

let nextId = 3;

const categories: Category[] = [
  { id: 1, name: "perifericos" },
  { id: 2, name: "muebles" }
];

// Devuelve un mensaje de error, o null si el nombre es válido
function validateName(name: unknown): string | null {
  if (typeof name !== "string" || name.trim() === "") {
    return "El nombre debe ser un texto no vacío";
  }
  return null;
}

// ¿Hay ya otra categoría con ese nombre? (sin distinguir mayúsculas)
// excludeId: al modificar, la propia categoría no cuenta como repetida
function nameExists(name: string, excludeId?: number): boolean {
  const text = name.trim().toLowerCase();
  return categories.some((item) => item.name.toLowerCase() === text && item.id !== excludeId);
}

router.get("/", (_req, res) => {
  res.json(categories);
});

router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "El ID debe ser un número entero" });
    return;
  }

  const category = categories.find((item) => item.id === id);

  if (!category) {
    res.status(404).json({ error: "Categoría no encontrada" });
    return;
  }

  res.json(category);
});

router.post("/", (req, res) => {
  const { name } = req.body ?? {};
  const error = validateName(name);

  if (error) {
    res.status(400).json({ error });
    return;
  }

  if (nameExists(name)) {
    res.status(409).json({ error: "Ya existe una categoría con ese nombre" });
    return;
  }

  const newCategory: Category = { id: nextId++, name: name.trim() };

  categories.push(newCategory);
  res.status(201).json(newCategory);
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "El ID debe ser un número entero" });
    return;
  }

  const category = categories.find((item) => item.id === id);

  if (!category) {
    res.status(404).json({ error: "Categoría no encontrada" });
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

  if (nameExists(name, id)) {
    res.status(409).json({ error: "Ya existe una categoría con ese nombre" });
    return;
  }

  category.name = name.trim();
  res.json(category);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "El ID debe ser un número entero" });
    return;
  }

  const index = categories.findIndex((item) => item.id === id);

  if (index === -1) {
    res.status(404).json({ error: "Categoría no encontrada" });
    return;
  }

  categories.splice(index, 1);
  res.status(204).send();
});

export default router;
