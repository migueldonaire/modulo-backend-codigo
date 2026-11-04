import { Link } from "react-router";
import type { Curso } from "../services/cursosService";
import { useMisCursos } from "../context/MisCursosContext";
import { Insignia } from "./Insignia";
import styles from "./CursoCard.module.css";

type CursoCardProps = {
  curso: Curso;
};

export function CursoCard({ curso }: CursoCardProps) {
  const { ids, anadir, quitar } = useMisCursos();
  const elegido = ids.includes(curso.id); // calculado, no va al estado

  return (
    <article className={styles.tarjeta}>
      <Insignia>{curso.categoria}</Insignia>
      {curso.plazas <= 3 && <Insignia aviso>Últimas plazas</Insignia>}
      <h2 className={styles.titulo}>
        <Link to={`/cursos/${curso.id}`}>{curso.titulo}</Link>
      </h2>
      <p>{curso.horas} horas</p>
      <p className={styles.precio}>{curso.precio} €</p>
      <button
        className={elegido ? `${styles.boton} ${styles.botonActivo}` : styles.boton}
        onClick={() => (elegido ? quitar(curso.id) : anadir(curso.id))}
      >
        {elegido ? "Quitar de Mis cursos" : "Añadir a Mis cursos"}
      </button>
    </article>
  );
}
