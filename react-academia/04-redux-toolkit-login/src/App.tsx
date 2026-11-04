import { createBrowserRouter, RouterProvider } from "react-router";
import { Layout } from "./components/Layout";
import { RutaProtegida } from "./components/RutaProtegida";
import { CatalogoPage } from "./pages/CatalogoPage";
import { CursoPage } from "./pages/CursoPage";
import { MisCursosPage } from "./pages/MisCursosPage";
import { InscripcionPage } from "./pages/InscripcionPage";
import { LoginPage } from "./pages/LoginPage";
import { AdminPage } from "./pages/AdminPage";
import { NoEncontradaPage } from "./pages/NoEncontradaPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <CatalogoPage /> },
      { path: "cursos/:id", element: <CursoPage /> },
      { path: "mis-cursos", element: <MisCursosPage /> },
      { path: "login", element: <LoginPage /> },
      {
        element: <RutaProtegida />, // hace falta sesión
        children: [{ path: "inscripcion", element: <InscripcionPage /> }],
      },
      {
        element: <RutaProtegida rol="admin" />, // hace falta ser admin
        children: [{ path: "admin", element: <AdminPage /> }],
      },
      { path: "*", element: <NoEncontradaPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
