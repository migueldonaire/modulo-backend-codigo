import { useEffect, useState } from "react";

export function Reloj() {
  const [hora, setHora] = useState(() => new Date()); // la hora al aparecer

  useEffect(() => {
    // Cada segundo, guarda la hora nueva
    const intervalo = setInterval(() => {
      setHora(new Date());
    }, 1000);

    // La limpieza: para el intervalo
    return () => {
      clearInterval(intervalo);
    };
  }, []); // solo al aparecer

  return <span>{hora.toLocaleTimeString("es-ES")}</span>;
}
