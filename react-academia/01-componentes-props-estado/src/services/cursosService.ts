// Así es un curso
export type Curso = {
  id: string; // texto ("1"): así lo devolverá la API más adelante
  titulo: string;
  categoria: string;
  horas: number;
  precio: number;
  plazas: number;
};

// De momento, los cursos escritos a mano
const cursos: Curso[] = [
  { id: "1", titulo: "Introducción a la programación con JavaScript", categoria: "Programación", horas: 60, precio: 180, plazas: 3 },
  { id: "2", titulo: "HTML y CSS desde cero", categoria: "Programación", horas: 40, precio: 120, plazas: 12 },
  { id: "3", titulo: "Diseño de interfaces con Figma", categoria: "Diseño", horas: 30, precio: 150, plazas: 8 },
  { id: "4", titulo: "Inglés técnico para informática", categoria: "Idiomas", horas: 50, precio: 140, plazas: 15 },
  { id: "5", titulo: "Excel avanzado", categoria: "Ofimática", horas: 25, precio: 90, plazas: 2 },
  { id: "6", titulo: "Bases de datos con SQL", categoria: "Programación", horas: 45, precio: 160, plazas: 10 },
];

export function getCursos(): Curso[] {
  return cursos;
}
