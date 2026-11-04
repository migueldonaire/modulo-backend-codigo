import { useMisCursos } from "../context/MisCursosContext";

export function Cabecera() {
  const { ids } = useMisCursos(); // lo leemos directamente, sin props

  return (
    <header className="cabecera">
      <strong>Academia</strong>
      <nav>
        <a href="#">Cursos</a>
        <a href="#">Mis cursos ({ids.length})</a>
      </nav>
    </header>
  );
}
