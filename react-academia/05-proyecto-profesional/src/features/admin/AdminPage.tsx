import { useState } from "react";
import type { FormEvent } from "react";
import { useBorrarCursoMutation, useCrearCursoMutation, useGetCursosQuery } from "../../app/api";

export function AdminPage() {
  const { data: cursos = [], isLoading } = useGetCursosQuery();
  // Una mutation devuelve [la función que la lanza, su estado]
  const [crearCurso, { isLoading: creando }] = useCrearCursoMutation();
  const [borrarCurso] = useBorrarCursoMutation();

  // El formulario "Nuevo curso"
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Programación");
  const [precio, setPrecio] = useState("100");

  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (titulo.trim() === "") return;
    await crearCurso({
      titulo: titulo.trim(),
      categoria,
      precio: Number(precio), // el input da un texto
      horas: 20,
      plazas: 20,
      descripcion: "",
    }).unwrap(); // si la API falla, lanza un error
    setTitulo("");
  }

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <h1>Panel de administración</h1>
      <table>
        <thead>
          <tr>
            <th>Curso</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.id}>
              <td>{curso.titulo}</td>
              <td>{curso.categoria}</td>
              <td>{curso.precio} €</td>
              <td>
                <button onClick={() => borrarCurso(curso.id)}>Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={guardar}>
        <h2>Nuevo curso</h2>
        <label htmlFor="titulo">Título</label>
        <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option>Programación</option>
          <option>Diseño</option>
          <option>Idiomas</option>
          <option>Ofimática</option>
        </select>
        <label htmlFor="precio">Precio (€)</label>
        <input
          id="precio"
          type="number"
          min="0"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <button type="submit" disabled={creando}>
          {creando ? "Guardando..." : "Guardar curso"}
        </button>
      </form>
    </>
  );
}
