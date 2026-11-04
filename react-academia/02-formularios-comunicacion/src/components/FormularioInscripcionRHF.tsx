import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Cómo tienen que ser los datos, y el mensaje si no lo son
const esquema = z.object({
  nombre: z.string().trim().min(1, "Escribe tu nombre."),
  email: z.email("El email no tiene un formato válido."),
  curso: z.string().min(1, "Elige un curso."),
  modalidad: z.enum(["presencial", "online"]), // uno de estos dos
  acepto: z.literal(true, { error: "Tienes que aceptar las condiciones." }), // tiene que ser true
});

// TypeScript saca el tipo del esquema: no hay que escribirlo a mano
type DatosInscripcion = z.infer<typeof esquema>;

export function FormularioInscripcionRHF() {
  const {
    register, // conecta cada campo
    handleSubmit, // valida antes de enviar
    reset, // vacía el formulario
    formState: { errors, isSubmitSuccessful }, // los errores y si se envió bien
  } = useForm<DatosInscripcion>({
    resolver: zodResolver(esquema), // valida con el esquema de Zod
    defaultValues: { nombre: "", email: "", curso: "", modalidad: "presencial" },
  });

  // Solo se llama si todo es válido
  function enviar(datos: DatosInscripcion) {
    console.log("Inscripción enviada:", datos);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(enviar)} noValidate>
      <h2>Inscripción (React Hook Form)</h2>
      {isSubmitSuccessful && <p role="status">¡Inscripción enviada!</p>}

      <label htmlFor="rhf-nombre">Nombre *</label>
      <input id="rhf-nombre" {...register("nombre")} />
      {errors.nombre && <p className="error">{errors.nombre.message}</p>}

      <label htmlFor="rhf-email">Email *</label>
      <input id="rhf-email" type="email" {...register("email")} />
      {errors.email && <p className="error">{errors.email.message}</p>}

      <label htmlFor="rhf-curso">Curso *</label>
      <select id="rhf-curso" {...register("curso")}>
        <option value="">Elige un curso</option>
        <option value="1">Introducción a la programación con JavaScript</option>
        <option value="2">HTML y CSS desde cero</option>
        <option value="6">Bases de datos con SQL</option>
      </select>
      {errors.curso && <p className="error">{errors.curso.message}</p>}

      <fieldset>
        <legend>Modalidad</legend>
        <label>
          <input type="radio" value="presencial" {...register("modalidad")} />
          Presencial
        </label>
        <label>
          <input type="radio" value="online" {...register("modalidad")} />
          Online
        </label>
      </fieldset>

      <label>
        <input type="checkbox" {...register("acepto")} />
        Acepto las condiciones *
      </label>
      {errors.acepto && <p className="error">{errors.acepto.message}</p>}

      <button type="submit">Enviar inscripción</button>
    </form>
  );
}
