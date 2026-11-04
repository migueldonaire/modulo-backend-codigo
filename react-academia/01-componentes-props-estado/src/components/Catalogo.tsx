import { useState } from "react";
import { getCursos } from "../services/cursosService";
import { CursoCard } from "./CursoCard";

const categorias = ["Todas", "Programación", "Diseño", "Idiomas", "Ofimática"];

export function Catalogo() {
  const cursos = getCursos();
  const [categoria, setCategoria] = useState("Todas"); // lo que elige el usuario

  // Calculado en cada render: no va al estado
  const cursosVisibles =
    categoria === "Todas" ? cursos : cursos.filter((curso) => curso.categoria === categoria);

  return (
    <main>
      <h1>Catálogo de cursos</h1>

      <div className="filtros">
        {categorias.map((cat) => (
          <button key={cat} onClick={() => setCategoria(cat)} disabled={cat === categoria}>
            {cat}
          </button>
        ))}
      </div>

      <p>{cursosVisibles.length === 1 ? "1 curso" : `${cursosVisibles.length} cursos`}</p>

      <div className="rejilla">
        {cursosVisibles.map((curso) => (
          <CursoCard key={curso.id} curso={curso} />
        ))}
      </div>
    </main>
  );
}
