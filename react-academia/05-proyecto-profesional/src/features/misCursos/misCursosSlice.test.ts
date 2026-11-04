import { describe, expect, it } from "vitest";
import misCursosReducer, { anadir, quitar } from "./misCursosSlice";

describe("misCursosSlice", () => {
  it("añade un curso", () => {
    const estado = misCursosReducer({ ids: [] }, anadir("3"));

    expect(estado.ids).toEqual(["3"]);
  });

  it("no repite un curso que ya está", () => {
    const estado = misCursosReducer({ ids: ["3"] }, anadir("3"));

    expect(estado.ids).toEqual(["3"]);
  });

  it("quita un curso", () => {
    const estado = misCursosReducer({ ids: ["1", "3"] }, quitar("1"));

    expect(estado.ids).toEqual(["3"]);
  });
});
