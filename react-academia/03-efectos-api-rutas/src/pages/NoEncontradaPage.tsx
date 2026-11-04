import { Link } from "react-router";

export function NoEncontradaPage() {
  return (
    <>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link to="/">Volver al catálogo</Link>
    </>
  );
}
