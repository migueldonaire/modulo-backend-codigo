import { NavLink, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { sesionCerrada } from "../../features/auth/authSlice";
import { SelectorIdioma } from "../ui/SelectorIdioma";

export function Cabecera() {
  const { t } = useTranslation();
  const cantidad = useAppSelector((state) => state.misCursos.ids.length);
  const usuario = useAppSelector((state) => state.auth.usuario);
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
          {t("menu.cursos")}
        </NavLink>
        <NavLink to="/mis-cursos">{t("menu.misCursos", { cantidad })}</NavLink>
        {usuario?.rol === "admin" && <NavLink to="/admin">{t("menu.admin")}</NavLink>}
        {usuario ? (
          <>
            <span>{t("menu.hola", { nombre: usuario.nombre })}</span>
            <button onClick={cerrarSesion}>{t("menu.salir")}</button>
          </>
        ) : (
          <NavLink to="/login">{t("menu.entrar")}</NavLink>
        )}
        <SelectorIdioma />
      </nav>
    </header>
  );
}
