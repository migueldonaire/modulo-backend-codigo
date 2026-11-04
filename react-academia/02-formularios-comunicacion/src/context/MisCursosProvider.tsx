import { useState } from "react";
import type { ReactNode } from "react";
import { MisCursosContext } from "./MisCursosContext";

type MisCursosProviderProps = {
  children: ReactNode;
};

export function MisCursosProvider({ children }: MisCursosProviderProps) {
  const [ids, setIds] = useState<string[]>([]);

  function anadir(id: string) {
    // Si ya está, no lo repite
    setIds((anteriores) => (anteriores.includes(id) ? anteriores : [...anteriores, id]));
  }

  function quitar(id: string) {
    setIds((anteriores) => anteriores.filter((x) => x !== id));
  }

  // Todo lo que esté dentro (children) puede leer ids, anadir y quitar
  return <MisCursosContext value={{ ids, anadir, quitar }}>{children}</MisCursosContext>;
}
