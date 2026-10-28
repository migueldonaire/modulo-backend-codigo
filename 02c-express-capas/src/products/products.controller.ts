// Controlador: traduce entre HTTP y el servicio.
// Lee la petición, llama al servicio y elige el código de estado.

import type { Request, Response } from "express";
import * as productsService from "./products.service";
import { validateProduct } from "./products.dto";

function parseId(req: Request, res: Response): number | null {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "El ID debe ser un número entero" });
    return null;
  }

  return id;
}

export function list(_req: Request, res: Response) {
  res.json(productsService.getAll());
}

export function getOne(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;

  const product = productsService.getById(id);

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json(product);
}

export function create(req: Request, res: Response) {
  const body = req.body ?? {};
  const error = validateProduct(body, false);

  if (error) {
    res.status(400).json({ error });
    return;
  }

  try {
    const product = productsService.create(body);
    res.status(201).json(product);
  } catch (err) {
    if (err instanceof productsService.DuplicateNameError) {
      res.status(409).json({ error: err.message });
      return;
    }
    throw err;
  }
}

export function update(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;

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

  const product = productsService.update(id, body);

  if (!product) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.json(product);
}

export function remove(req: Request, res: Response) {
  const id = parseId(req, res);
  if (id === null) return;

  if (!productsService.remove(id)) {
    res.status(404).json({ error: "Producto no encontrado" });
    return;
  }

  res.status(204).send();
}
