import { useState } from "react";
import type { Curso } from "../services/cursosService";
import { Insignia } from "./Insignia";
import styles from "./CursoCard.module.css";

type CursoCardProps = {
  curso: Curso; // una sola prop: el curso completo
};

export function CursoCard({ curso }: CursoCardProps) {
  // meInteresa: el valor actual. setMeInteresa: la función para cambiarlo.
  const [meInteresa, setMeInteresa] = useState(false);

  function alternarInteres() {
    setMeInteresa(!meInteresa); // cambia el valor y React vuelve a pintar
  }

  return (
    <article className={styles.tarjeta}>
      <Insignia>{curso.categoria}</Insignia>
      {curso.plazas <= 3 && <Insignia aviso>Últimas plazas</Insignia>}
      <h2 className={styles.titulo}>{curso.titulo}</h2>
      <p>{curso.horas} horas</p>
      <p className={styles.precio}>{curso.precio} €</p>
      <button
        className={meInteresa ? `${styles.boton} ${styles.botonActivo}` : styles.boton}
        onClick={alternarInteres}
      >
        {meInteresa ? "Te interesa" : "Me interesa"}
      </button>
    </article>
  );
}
