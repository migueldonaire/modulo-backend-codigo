import { Outlet } from "react-router";
import { Cabecera } from "./Cabecera";

export function Layout() {
  return (
    <>
      <Cabecera /> {/* en todas las páginas */}
      <main>
        <Outlet /> {/* aquí se pinta la página que toca según la URL */}
      </main>
    </>
  );
}
