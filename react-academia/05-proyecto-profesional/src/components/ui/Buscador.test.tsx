import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Buscador } from "./Buscador";

describe("Buscador", () => {
  it("avisa al padre de cada letra que se escribe", async () => {
    const usuario = userEvent.setup();
    const onCambiarTexto = vi.fn();
    render(<Buscador texto="" onCambiarTexto={onCambiarTexto} />);

    await usuario.type(screen.getByLabelText("Buscar curso"), "sql");

    // Tres letras, tres avisos
    expect(onCambiarTexto).toHaveBeenCalledTimes(3);
  });
});
