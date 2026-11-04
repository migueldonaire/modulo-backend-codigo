import { createBrowserRouter } from "react-router";
import { Layout } from "../components/layout/Layout";
import { RutaProtegida } from "../features/auth/RutaProtegida";
import { CatalogoPage } from "../features/cursos/CatalogoPage";
import { CursoPage } from "../features/cursos/CursoPage";
import { MisCursosPage } from "../features/misCursos/MisCursosPage";
import { InscripcionPage } from "../features/inscripcion/InscripcionPage";
import { LoginPage } from "../features/auth/LoginPage";
import { AdminPage } from "../features/admin/AdminPage";
import { NoEncontradaPage } from "../components/layout/NoEncontradaPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <CatalogoPage /> },
      { path: "cursos/:id", element: <CursoPage /> },
      { path: "mis-cursos", element: <MisCursosPage /> },
      { path: "login", element: <LoginPage /> },
      {
        element: <RutaProtegida />,
        children: [{ path: "inscripcion", element: <InscripcionPage /> }],
      },
      {
        element: <RutaProtegida rol="admin" />,
        children: [{ path: "admin", element: <AdminPage /> }],
      },
      { path: "*", element: <NoEncontradaPage /> },
    ],
  },
]);
