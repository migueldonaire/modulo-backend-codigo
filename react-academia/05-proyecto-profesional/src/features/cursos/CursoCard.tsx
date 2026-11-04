import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import type { Curso } from "../../app/api";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { anadir, quitar } from "../misCursos/misCursosSlice";
import { Insignia } from "../../components/ui/Insignia";
import { formatearPrecio } from "../../i18n/formato";
import styles from "./CursoCard.module.css";

type CursoCardProps = {
  curso: Curso;
};

export function CursoCard({ curso }: CursoCardProps) {
  const { t, i18n } = useTranslation();
  const elegido = useAppSelector((state) => state.misCursos.ids.includes(curso.id));
  const dispatch = useAppDispatch();

  return (
    <article className={styles.tarjeta}>
      <Insignia>{curso.categoria}</Insignia>
      {curso.plazas <= 3 && <Insignia aviso>{t("curso.ultimasPlazas")}</Insignia>}
      <h2 className={styles.titulo}>
        <Link to={`/cursos/${curso.id}`}>{curso.titulo}</Link>
      </h2>
      <p>{t("curso.horas", { horas: curso.horas })}</p>
      <p className={styles.precio}>{formatearPrecio(curso.precio, i18n.language)}</p>
      <button
        className={elegido ? `${styles.boton} ${styles.botonActivo}` : styles.boton}
        onClick={() => dispatch(elegido ? quitar(curso.id) : anadir(curso.id))}
      >
        {elegido ? t("curso.quitar") : t("curso.anadir")}
      </button>
    </article>
  );
}
