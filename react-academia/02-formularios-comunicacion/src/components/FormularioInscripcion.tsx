import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

// Los campos del formulario
type DatosInscripcion = {
  nombre: string;
  email: string;
  curso: string;
  modalidad: string;
  acepto: boolean;
};

// Cómo empieza el formulario: vacío
const datosIniciales: DatosInscripcion = {
  nombre: "",
  email: "",
  curso: "",
  modalidad: "presencial",
  acepto: false,
};

// Un mensaje por campo. El ? = si el campo está bien, no hay mensaje
type Errores = {
  nombre?: string;
  email?: string;
  curso?: string;
  acepto?: string;
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
  if (!datos.acepto) {
    errores.acepto = "Tienes que aceptar las condiciones.";
  }

  return errores;
}

export function FormularioInscripcion() {
  const [datos, setDatos] = useState<DatosInscripcion>(datosIniciales);
  const [errores, setErrores] = useState<Errores>({}); // empieza sin errores
  const [enviado, setEnviado] = useState(false);
  const nombreRef = useRef<HTMLInputElement>(null); // guardará el input del nombre

  // Una sola función para todos los campos de texto, select y radio
  function cambiar(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target; // qué campo y qué valor
    setDatos({ ...datos, [name]: value }); // copia todo y cambia solo ese campo
  }

  // El checkbox se lee con checked (true/false), no con value
  function cambiarCheckbox(e: ChangeEvent<HTMLInputElement>) {
    setDatos({ ...datos, acepto: e.target.checked });
  }

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // no recargues la página
    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);

    // Si hay algún error, paramos aquí
    if (Object.keys(nuevosErrores).length > 0) {
      if (nuevosErrores.nombre) {
        nombreRef.current?.focus(); // pon el cursor en el nombre
      }
      return;
    }

    console.log("Inscripción enviada:", datos);
    setEnviado(true);
    setDatos(datosIniciales); // vacía el formulario
  }

  return (
    <form onSubmit={enviar} noValidate>
      <h2>Inscripción</h2>
      {enviado && <p role="status">¡Inscripción enviada!</p>}

      <label htmlFor="nombre">Nombre *</label>
      <input id="nombre" name="nombre" ref={nombreRef} value={datos.nombre} onChange={cambiar} />
      {errores.nombre && <p className="error">{errores.nombre}</p>}

      <label htmlFor="email">Email *</label>
      <input id="email" name="email" type="email" value={datos.email} onChange={cambiar} />
      {errores.email && <p className="error">{errores.email}</p>}

      <label htmlFor="curso">Curso *</label>
      <select id="curso" name="curso" value={datos.curso} onChange={cambiar}>
        <option value="">Elige un curso</option>
        <option value="1">Introducción a la programación con JavaScript</option>
        <option value="2">HTML y CSS desde cero</option>
        <option value="6">Bases de datos con SQL</option>
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

      <label>
        <input type="checkbox" checked={datos.acepto} onChange={cambiarCheckbox} />
        Acepto las condiciones *
      </label>
      {errores.acepto && <p className="error">{errores.acepto}</p>}

      <button type="submit">Enviar inscripción</button>
    </form>
  );
}
