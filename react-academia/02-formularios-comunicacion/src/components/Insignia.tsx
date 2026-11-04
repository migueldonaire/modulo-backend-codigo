import type { ReactNode } from "react"; // un tipo: "cualquier cosa que React sabe pintar"
import styles from "./Insignia.module.css";

type InsigniaProps = {
  children: ReactNode; // lo que va entre <Insignia> y </Insignia>
  aviso?: boolean; // naranja para los avisos
};

export function Insignia({ children, aviso = false }: InsigniaProps) {
  const clases = aviso ? `${styles.insignia} ${styles.aviso}` : styles.insignia;
  return <span className={clases}>{children}</span>;
}
