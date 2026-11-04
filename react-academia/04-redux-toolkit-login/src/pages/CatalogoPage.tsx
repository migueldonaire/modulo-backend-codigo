import { useEffect, useState } from "react";
import { useGetCursosQuery } from "../services/api";
import { CursoCard } from "../components/CursoCard";
import { Buscador } from "../components/Buscador";

const categorias = ["Todas", "Programación", "Diseño", "Idiomas", "Ofimática"];

export function CatalogoPage() {
  // data se renombra a cursos. Mientras no llegan, []
  const { data: cursos = [], isLoading, isError } = useGetCursosQuery();
  const [categoria, setCategoria] = useState("Todas");
  const [texto, setTexto] = useState("");

  // Filtra por categoría y por texto a la vez
  const cursosVisibles = cursos
    .filter((curso) => categoria === "Todas" || curso.categoria === categoria)
    .filter((curso) => curso.titulo.toLowerCase().includes(texto.toLowerCase()));

  // Cambia el título de la pestaña
  useEffect(() => {
    document.title = `${cursosVisibles.length} cursos · Academia`;
  }, [cursosVisibles.length]);

  if (isLoading) {
    return <p>Cargando cursos...</p>;
  }

  if (isError) {
    return <p className="error">No se han podido cargar los cursos.</p>;
  }

  return (
    <>
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
    </>
  );
}
