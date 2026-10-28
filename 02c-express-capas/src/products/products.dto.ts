// DTO: la forma de los datos que ENTRAN en la API.
// No llevan id: eso lo decide el servidor.

export type CreateProductDto = {
  name: string;
  price: number;
};

export type UpdateProductDto = Partial<CreateProductDto>;

// Devuelve un mensaje de error, o null si los datos son válidos.
// partial = true: los campos pueden faltar (para PATCH).
export function validateProduct(body: { name?: unknown; price?: unknown }, partial: boolean): string | null {
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
