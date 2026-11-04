import { Link, useParams } from "react-router";
import { useGetCursoQuery } from "../services/api";

export function CursoPage() {
  const { id = "" } = useParams(); // = "": valor por defecto
  const { data: curso, isLoading, isError } = useGetCursoQuery(id);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (isError || !curso) {
    return (
      <>
        <p className="error">Ese curso no existe.</p>
        <Link to="/">Volver al catálogo</Link>
      </>
    );
  }

  return (
    <article>
      <Link to="/">← Volver al catálogo</Link>
      <h1>{curso.titulo}</h1>
      <p>{curso.descripcion}</p>
      <p>
        {curso.horas} horas · {curso.precio} € · {curso.plazas} plazas libres
      </p>
      <Link to={`/inscripcion?curso=${curso.id}`}>Inscribirme</Link>
    </article>
  );
}
