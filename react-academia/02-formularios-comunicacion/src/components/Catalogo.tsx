import { useState } from "react";
import { getCursos } from "../services/cursosService";
import { CursoCard } from "./CursoCard";
import { Buscador } from "./Buscador";

const categorias = ["Todas", "Programación", "Diseño", "Idiomas", "Ofimática"];

export function Catalogo() {
  const cursos = getCursos();
  const [categoria, setCategoria] = useState("Todas");
  const [texto, setTexto] = useState(""); // el estado está en el padre

  // Filtra por categoría y por texto a la vez
  const cursosVisibles = cursos
    .filter((curso) => categoria === "Todas" || curso.categoria === categoria)
    .filter((curso) => curso.titulo.toLowerCase().includes(texto.toLowerCase()));

  return (
    <main>
      <h1>Catálogo de cursos</h1>

      <Buscador texto={texto} onCambiarTexto={setTexto} />

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
