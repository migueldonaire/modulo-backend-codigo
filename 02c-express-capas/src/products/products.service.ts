// Servicio: las reglas de la aplicación.
// No sabe nada de HTTP: ni req, ni res, ni códigos de estado.

import * as productsModel from "./products.model";
import type { CreateProductDto, UpdateProductDto } from "./products.dto";

export function getAll() {
  return productsModel.findAll();
}

export function getById(id: number) {
  return productsModel.findById(id);
}

export class DuplicateNameError extends Error {}

export function create(dto: CreateProductDto) {
  const name = dto.name.trim();
  const exists = productsModel
    .findAll()
    .some((product) => product.name.toLowerCase() === name.toLowerCase());

  if (exists) {
    throw new DuplicateNameError(`Ya existe un producto llamado ${name}`);
  }

  return productsModel.insert({ name, price: dto.price });
}

export function update(id: number, dto: UpdateProductDto) {
  const changes: UpdateProductDto = {};
  if (dto.name !== undefined) changes.name = dto.name.trim();
  if (dto.price !== undefined) changes.price = dto.price;

  return productsModel.update(id, changes);
}

export function remove(id: number) {
  return productsModel.remove(id);
}
