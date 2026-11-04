import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useCrearInscripcionMutation, useGetCursosQuery } from "../services/api";
import { useAppDispatch } from "../app/hooks";
import { anadir } from "../features/misCursos/misCursosSlice";

// Los campos del formulario
type DatosInscripcion = {
  nombre: string;
  email: string;
  curso: string;
  modalidad: string;
};

// Un mensaje por campo. El ? = si el campo está bien, no hay mensaje
type Errores = {
  nombre?: string;
  email?: string;
  curso?: string;
};

// Recibe los datos y devuelve los errores
function validar(datos: DatosInscripcion): Errores {
  const errores: Errores = {};

  if (datos.nombre.trim() === "") {
    errores.nombre = "Escribe tu nombre.";
  }
  // algo, una @, algo, un punto y algo
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
    errores.email = "El email no tiene un formato válido.";
  }
  if (datos.curso === "") {
    errores.curso = "Elige un curso.";
  }

  return errores;
}

export function InscripcionPage() {
  const { data: cursos = [] } = useGetCursosQuery(); // para el select
  const [crearInscripcion, { isLoading: enviando }] = useCrearInscripcionMutation();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams(); // lo que va después de ? en la URL
  const navigate = useNavigate(); // para cambiar de página desde el código

  const [datos, setDatos] = useState<DatosInscripcion>({
    nombre: "",
    email: "",
    curso: searchParams.get("curso") ?? "", // /inscripcion?curso=6 → "6"
    modalidad: "presencial",
  });
  const [errores, setErrores] = useState<Errores>({});
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  // Una sola función para todos los campos
  function cambiar(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setDatos({ ...datos, [name]: value });
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    try {
      await crearInscripcion({
        cursoId: datos.curso,
        nombre: datos.nombre,
        email: datos.email,
        modalidad: datos.modalidad,
      }).unwrap(); // si la API falla, salta al catch
      dispatch(anadir(datos.curso)); // a Mis cursos
      navigate("/mis-cursos");
    } catch {
      setErrorEnvio("No se ha podido enviar la inscripción. Inténtalo de nuevo.");
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <h1>Inscripción</h1>
      {errorEnvio && <p className="error">{errorEnvio}</p>}

      <label htmlFor="nombre">Nombre *</label>
      <input id="nombre" name="nombre" value={datos.nombre} onChange={cambiar} />
      {errores.nombre && <p className="error">{errores.nombre}</p>}

      <label htmlFor="email">Email *</label>
      <input id="email" name="email" type="email" value={datos.email} onChange={cambiar} />
      {errores.email && <p className="error">{errores.email}</p>}

      <label htmlFor="curso">Curso *</label>
      <select id="curso" name="curso" value={datos.curso} onChange={cambiar}>
        <option value="">Elige un curso</option>
        {/* las opciones salen de la API */}
        {cursos.map((curso) => (
          <option key={curso.id} value={curso.id}>
            {curso.titulo}
          </option>
        ))}
      </select>
      {errores.curso && <p className="error">{errores.curso}</p>}

      <fieldset>
        <legend>Modalidad</legend>
        <label>
          <input type="radio" name="modalidad" value="presencial" checked={datos.modalidad === "presencial"} onChange={cambiar} />
          Presencial
        </label>
        <label>
          <input type="radio" name="modalidad" value="online" checked={datos.modalidad === "online"} onChange={cambiar} />
          Online
        </label>
      </fieldset>

      <button type="submit" disabled={enviando}>
        {enviando ? "Enviando..." : "Enviar inscripción"}
      </button>
    </form>
  );
}
