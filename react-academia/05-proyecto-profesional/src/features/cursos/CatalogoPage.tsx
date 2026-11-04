import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetCursosQuery } from "../../app/api";
import { CursoCard } from "./CursoCard";
import { Buscador } from "../../components/ui/Buscador";

const categorias = ["Todas", "Programación", "Diseño", "Idiomas", "Ofimática"];

export function CatalogoPage() {
  const { t } = useTranslation(); // t("clave") devuelve el texto en el idioma actual
  const { data: cursos = [], isLoading, isError } = useGetCursosQuery();
  const [categoria, setCategoria] = useState("Todas");
  const [texto, setTexto] = useState("");

  // Filtra por categoría y por texto a la vez
  const cursosVisibles = cursos
    .filter((curso) => categoria === "Todas" || curso.categoria === categoria)
    .filter((curso) => curso.titulo.toLowerCase().includes(texto.toLowerCase()));

  // Cambia el título de la pestaña
  useEffect(() => {
    document.title = `${cursosVisibles.length} · Academia`;
  }, [cursosVisibles.length]);

  if (isLoading) {
    return <p>{t("catalogo.cargando")}</p>;
  }

  if (isError) {
    return <p className="error">{t("catalogo.error")}</p>;
  }

  return (
    <>
      <h1>{t("catalogo.titulo")}</h1>

      <Buscador texto={texto} onCambiarTexto={setTexto} />

      <div className="filtros">
        {categorias.map((cat) => (
          <button key={cat} onClick={() => setCategoria(cat)} disabled={cat === categoria}>
            {cat === "Todas" ? t("catalogo.todas") : cat}
          </button>
        ))}
      </div>

      {/* count es el nombre especial que activa los plurales */}
      <p>{t("catalogo.cursos", { count: cursosVisibles.length })}</p>

      <div className="rejilla">
        {cursosVisibles.map((curso) => (
          <CursoCard key={curso.id} curso={curso} />
        ))}
      </div>
    </>
  );
}
