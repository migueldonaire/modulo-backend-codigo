import { useEffect, useState } from "react";
import { getCursos } from "../services/cursosService";
import type { Curso } from "../services/cursosService";

export function useCursos() {
  const [cursos, setCursos] = useState<Curso[]>([]); // los datos
  const [cargando, setCargando] = useState(true); // empieza cargando
  const [error, setError] = useState<string | null>(null); // empieza sin error

  useEffect(() => {
    let cancelado = false; // ¿el componente ya no está?

    getCursos()
      .then((datos) => {
        if (!cancelado) setCursos(datos); // han llegado los cursos
      })
      .catch((e: Error) => {
        if (!cancelado) setError(e.message); // algo ha fallado
      })
      .finally(() => {
        if (!cancelado) setCargando(false); // ya no carga, vaya bien o mal
      });

    // Limpieza: si el componente desaparece, no tocamos su estado
    return () => {
      cancelado = true;
    };
  }, []); // solo al abrir

  return { cursos, cargando, error };
}
