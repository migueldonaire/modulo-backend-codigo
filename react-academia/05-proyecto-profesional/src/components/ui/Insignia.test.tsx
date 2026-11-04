import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Insignia } from "./Insignia";

describe("Insignia", () => {
  it("muestra el texto que recibe", () => {
    render(<Insignia>Programación</Insignia>);

    expect(screen.getByText("Programación")).toBeInTheDocument();
  });
});
