import { NavLink } from "react-router";
import { useMisCursos } from "../context/MisCursosContext";
import { Reloj } from "./Reloj";

export function Cabecera() {
  const { ids } = useMisCursos();

  return (
    <header className="cabecera">
      <strong>Academia</strong>
      <nav>
        {/* end: activo solo en "/" exacto */}
        <NavLink to="/" end>
          Cursos
        </NavLink>
        <NavLink to="/mis-cursos">Mis cursos ({ids.length})</NavLink>
        <Reloj />
      </nav>
    </header>
  );
}
