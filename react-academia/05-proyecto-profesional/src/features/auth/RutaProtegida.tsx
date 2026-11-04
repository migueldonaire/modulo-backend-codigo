import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../app/hooks";

type RutaProtegidaProps = {
  rol?: "admin" | "alumno"; // opcional: si se pone, hace falta ese rol
};

export function RutaProtegida({ rol }: RutaProtegidaProps) {
  const usuario = useAppSelector((state) => state.auth.usuario);
  const location = useLocation();

  // Sin sesión: al login, apuntando de dónde venimos
  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />;
  }

  // Con sesión pero sin el rol
  if (rol && usuario.rol !== rol) {
    return <p className="error">No tienes permiso para ver esta página.</p>;
  }

  // Todo bien: pinta la página de dentro
  return <Outlet />;
}
