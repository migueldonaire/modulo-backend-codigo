import { Link } from "react-router";
import type { Curso } from "../services/api";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { anadir, quitar } from "../features/misCursos/misCursosSlice";
import { Insignia } from "./Insignia";
import styles from "./CursoCard.module.css";

type CursoCardProps = {
  curso: Curso;
};

export function CursoCard({ curso }: CursoCardProps) {
  // Selector: ¿este curso está elegido?
  const elegido = useAppSelector((state) => state.misCursos.ids.includes(curso.id));
  const dispatch = useAppDispatch();

  return (
    <article className={styles.tarjeta}>
      <Insignia>{curso.categoria}</Insignia>
      {curso.plazas <= 3 && <Insignia aviso>Últimas plazas</Insignia>}
      <h2 className={styles.titulo}>
        <Link to={`/cursos/${curso.id}`}>{curso.titulo}</Link>
      </h2>
      <p>{curso.horas} horas</p>
      <p className={styles.precio}>{curso.precio} €</p>
      {/* anadir(...) crea la acción y dispatch la envía */}
      <button
        className={elegido ? `${styles.boton} ${styles.botonActivo}` : styles.boton}
        onClick={() => dispatch(elegido ? quitar(curso.id) : anadir(curso.id))}
      >
        {elegido ? "Quitar de Mis cursos" : "Añadir a Mis cursos"}
      </button>
    </article>
  );
}
