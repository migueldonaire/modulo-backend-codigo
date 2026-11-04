export function formatearPrecio(precio: number, idioma: string) {
  return new Intl.NumberFormat(idioma, { style: "currency", currency: "EUR" }).format(precio);
}
