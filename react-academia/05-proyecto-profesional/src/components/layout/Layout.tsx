import { Outlet } from "react-router";
import { Cabecera } from "./Cabecera";

export function Layout() {
  return (
    <>
      <Cabecera />
      <main>
        <Outlet />
      </main>
    </>
  );
}
