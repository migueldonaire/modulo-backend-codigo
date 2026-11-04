import { Link } from "react-router";
import { useGetCursosQuery } from "../services/api";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { quitar } from "../features/misCursos/misCursosSlice";

export function MisCursosPage() {
  const ids = useAppSelector((state) => state.misCursos.ids);
  const dispatch = useAppDispatch();
  const { data: cursos = [], isLoading } = useGetCursosQuery(); // sale de la caché

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  const elegidos = cursos.filter((curso) => ids.includes(curso.id));
  const total = elegidos.reduce((suma, curso) => suma + curso.precio, 0);

  if (elegidos.length === 0) {
    return (
      <>
        <p>Todavía no has elegido ningún curso.</p>
        <Link to="/">Ver el catálogo</Link>
      </>
    );
  }

  return (
    <section>
      <h1>Mis cursos</h1>
      <ul>
        {elegidos.map((curso) => (
          <li key={curso.id}>
            <Link to={`/cursos/${curso.id}`}>{curso.titulo}</Link> · {curso.precio} €{" "}
            <button onClick={() => dispatch(quitar(curso.id))}>Quitar</button>
          </li>
        ))}
      </ul>
      <p>Total: {total} €</p>
    </section>
  );
}
