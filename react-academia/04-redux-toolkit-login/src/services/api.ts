import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";

export type Curso = {
  id: string;
  titulo: string;
  categoria: string;
  horas: number;
  precio: number;
  plazas: number;
  descripcion: string;
};

export type NuevoCurso = Omit<Curso, "id">; // un Curso sin id: el id lo pone la API

export type NuevaInscripcion = {
  cursoId: string;
  nombre: string;
  email: string;
  modalidad: string;
};

export const api = createApi({
  reducerPath: "api", // dónde se guarda la caché en el store
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
    // Se ejecuta antes de cada petición
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token; // el token del store
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Curso"], // los nombres de las etiquetas
  endpoints: (builder) => ({
    // query = leer. <lo que devuelve, lo que recibe>
    getCursos: builder.query<Curso[], void>({
      query: () => "/cursos", // GET /cursos
      providesTags: ["Curso"], // "estos datos son de tipo Curso"
    }),
    getCurso: builder.query<Curso, string>({
      query: (id) => `/cursos/${id}`, // GET /cursos/3
      providesTags: ["Curso"],
    }),
    // mutation = cambiar
    crearCurso: builder.mutation<Curso, NuevoCurso>({
      query: (curso) => ({ url: "/cursos", method: "POST", body: curso }),
      invalidatesTags: ["Curso"], // "después de esto, los datos de tipo Curso están viejos"
    }),
    borrarCurso: builder.mutation<void, string>({
      query: (id) => ({ url: `/cursos/${id}`, method: "DELETE" }),
      invalidatesTags: ["Curso"],
    }),
    crearInscripcion: builder.mutation<NuevaInscripcion, NuevaInscripcion>({
      query: (inscripcion) => ({ url: "/inscripciones", method: "POST", body: inscripcion }),
    }),
  }),
});

// Los hooks que crea RTK Query: use + nombre del endpoint + Query o Mutation
export const {
  useGetCursosQuery,
  useGetCursoQuery,
  useCrearCursoMutation,
  useBorrarCursoMutation,
  useCrearInscripcionMutation,
} = api;
