import { NavLink, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { sesionCerrada } from "../features/auth/authSlice";

export function Cabecera() {
  const cantidad = useAppSelector((state) => state.misCursos.ids.length);
  const usuario = useAppSelector((state) => state.auth.usuario); // null si no ha entrado
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function cerrarSesion() {
    dispatch(sesionCerrada());
    navigate("/");
  }

  return (
    <header className="cabecera">
      <strong>Academia</strong>
      <nav>
        <NavLink to="/" end>
          Cursos
        </NavLink>
        <NavLink to="/mis-cursos">Mis cursos ({cantidad})</NavLink>
        {/* Admin solo para el rol admin */}
        {usuario?.rol === "admin" && <NavLink to="/admin">Admin</NavLink>}
        {usuario ? (
          <>
            <span>Hola, {usuario.nombre}</span>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        ) : (
          <NavLink to="/login">Entrar</NavLink>
        )}
      </nav>
    </header>
  );
}
