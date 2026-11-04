import { Link, useParams } from "react-router";
import { useCurso } from "../hooks/useCurso";

export function CursoPage() {
  const { id } = useParams(); // en /cursos/6, id vale "6"
  const { curso, cargando, error } = useCurso(id ?? ""); // ?? "": por si TypeScript cree que falta

  if (cargando) {
    return <p>Cargando...</p>;
  }

  if (error || curso === null) {
    return (
      <>
        <p className="error">{error}</p>
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
