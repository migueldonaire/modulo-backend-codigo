import { createContext, useContext } from "react";

// Lo que se comparte
type MisCursosContextValue = {
  ids: string[];
  anadir: (id: string) => void;
  quitar: (id: string) => void;
};

// El contexto. Empieza en null: "nadie lo ha provisto"
export const MisCursosContext = createContext<MisCursosContextValue | null>(null);

// Un hook propio para leerlo cómodamente
export function useMisCursos() {
  const contexto = useContext(MisCursosContext); // lee el contexto
  if (contexto === null) {
    throw new Error("useMisCursos tiene que usarse dentro de <MisCursosProvider>");
  }
  return contexto;
}
