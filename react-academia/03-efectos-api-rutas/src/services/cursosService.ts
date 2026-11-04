const API_URL = "http://localhost:3001"; // en la sesión 5 irá a una variable de entorno

export type Curso = {
  id: string;
  titulo: string;
  categoria: string;
  horas: number;
  precio: number;
  plazas: number;
  descripcion: string;
};

// Lo que enviamos para crear una inscripción
export type NuevaInscripcion = {
  cursoId: string;
  nombre: string;
  email: string;
  modalidad: string;
};

export async function getCursos(): Promise<Curso[]> {
  const respuesta = await fetch(`${API_URL}/cursos`); // pide los cursos
  if (!respuesta.ok) {
    // ok es true si el código está entre 200 y 299
    throw new Error(`Error ${respuesta.status} al cargar los cursos`);
  }
  return respuesta.json(); // convierte el body en objetos
}

export async function getCurso(id: string): Promise<Curso> {
  const respuesta = await fetch(`${API_URL}/cursos/${id}`);
  if (!respuesta.ok) {
    throw new Error(respuesta.status === 404 ? "Ese curso no existe" : `Error ${respuesta.status}`);
  }
  return respuesta.json();
}

export async function crearInscripcion(inscripcion: NuevaInscripcion) {
  const respuesta = await fetch(`${API_URL}/inscripciones`, {
    method: "POST", // crear
    headers: { "Content-Type": "application/json" }, // le decimos que enviamos JSON
    body: JSON.stringify(inscripcion), // el objeto, convertido a texto
  });
  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al enviar la inscripción`);
  }
  return respuesta.json();
}
