import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CursoCard } from "./CursoCard";
import { renderConProveedores } from "../../test/renderConProveedores";
import type { Curso } from "../../app/api";

const curso: Curso = {
  id: "5",
  titulo: "Excel avanzado",
  categoria: "Ofimática",
  horas: 25,
  precio: 90,
  plazas: 2,
  descripcion: "",
};

describe("CursoCard", () => {
  it("muestra el título, el precio y el aviso de últimas plazas", () => {
    renderConProveedores(<CursoCard curso={curso} />);

    expect(screen.getByRole("link", { name: "Excel avanzado" })).toHaveAttribute(
      "href",
      "/cursos/5",
    );
    expect(screen.getByText(/90,00/)).toBeInTheDocument();
    expect(screen.getByText("Últimas plazas")).toBeInTheDocument();
  });

  it("añade el curso a Mis cursos al pulsar el botón", async () => {
    const usuario = userEvent.setup();
    const { store } = renderConProveedores(<CursoCard curso={curso} />);

    await usuario.click(screen.getByRole("button", { name: "Añadir a Mis cursos" }));

    expect(store.getState().misCursos.ids).toEqual(["5"]);
    expect(screen.getByRole("button", { name: "Quitar de Mis cursos" })).toBeInTheDocument();
  });
});
