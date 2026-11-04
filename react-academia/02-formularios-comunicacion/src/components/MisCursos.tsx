import { getCursos } from "../services/cursosService";
import { useMisCursos } from "../context/MisCursosContext";

export function MisCursos() {
  const { ids, quitar } = useMisCursos();
  const elegidos = getCursos().filter((curso) => ids.includes(curso.id));
  const total = elegidos.reduce((suma, curso) => suma + curso.precio, 0);

  if (elegidos.length === 0) {
    return <p>Todavía no has elegido ningún curso.</p>;
  }

  return (
    <section>
      <h2>Mis cursos</h2>
      <ul>
        {elegidos.map((curso) => (
          <li key={curso.id}>
            {curso.titulo} · {curso.precio} €{" "}
            <button onClick={() => quitar(curso.id)}>Quitar</button>
          </li>
        ))}
      </ul>
      <p>Total: {total} €</p>
    </section>
  );
}
