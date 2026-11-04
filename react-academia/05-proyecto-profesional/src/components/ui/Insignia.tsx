import type { ReactNode } from "react";
import styles from "./Insignia.module.css";

type InsigniaProps = {
  children: ReactNode;
  aviso?: boolean;
};

export function Insignia({ children, aviso = false }: InsigniaProps) {
  const clases = aviso ? `${styles.insignia} ${styles.aviso}` : styles.insignia;
  return <span className={clases}>{children}</span>;
}
