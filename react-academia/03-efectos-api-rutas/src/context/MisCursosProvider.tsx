import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { MisCursosContext } from "./MisCursosContext";

type MisCursosProviderProps = {
  children: ReactNode;
};

// Lee lo guardado. Si no hay nada, un array vacío
function leerGuardados(): string[] {
  return JSON.parse(localStorage.getItem("misCursos") ?? "[]");
}

export function MisCursosProvider({ children }: MisCursosProviderProps) {
  // Le pasamos la función SIN paréntesis: React solo la llama la primera vez
  const [ids, setIds] = useState<string[]>(leerGuardados);

  // Cada vez que cambian los ids, se guardan
  useEffect(() => {
    localStorage.setItem("misCursos", JSON.stringify(ids));
  }, [ids]);

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
