import { createBrowserRouter, RouterProvider } from "react-router";
import { MisCursosProvider } from "./context/MisCursosProvider";
import { Layout } from "./components/Layout";
import { CatalogoPage } from "./pages/CatalogoPage";
import { CursoPage } from "./pages/CursoPage";
import { MisCursosPage } from "./pages/MisCursosPage";
import { InscripcionPage } from "./pages/InscripcionPage";
import { NoEncontradaPage } from "./pages/NoEncontradaPage";

// La lista de rutas: qué componente va con cada dirección
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // el layout envuelve a todas las páginas de dentro
    children: [
      { index: true, element: <CatalogoPage /> }, // la página de "/"
      { path: "cursos/:id", element: <CursoPage /> }, // :id = un parámetro
      { path: "mis-cursos", element: <MisCursosPage /> },
      { path: "inscripcion", element: <InscripcionPage /> },
      { path: "*", element: <NoEncontradaPage /> }, // cualquier otra dirección
    ],
  },
]);

function App() {
  return (
    <MisCursosProvider>
      <RouterProvider router={router} />
    </MisCursosProvider>
  );
}

export default App;
