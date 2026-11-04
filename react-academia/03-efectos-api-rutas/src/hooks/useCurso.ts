import { useEffect, useState } from "react";
import { getCurso } from "../services/cursosService";
import type { Curso } from "../services/cursosService";

export function useCurso(id: string) {
  const [curso, setCurso] = useState<Curso | null>(null); // todavía no hay curso
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    getCurso(id)
      .then((datos) => {
        if (!cancelado) setCurso(datos);
      })
      .catch((e: Error) => {
        if (!cancelado) setError(e.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [id]); // si cambia el id, se pide otro curso

  return { curso, cargando, error };
}
