import { useTranslation } from "react-i18next";

type BuscadorProps = {
  texto: string;
  onCambiarTexto: (texto: string) => void;
};

export function Buscador({ texto, onCambiarTexto }: BuscadorProps) {
  const { t } = useTranslation();
  return (
    <div>
      <label htmlFor="buscar">{t("buscador.etiqueta")}</label>
      <input
        id="buscar"
        type="search"
        value={texto}
        onChange={(e) => onCambiarTexto(e.target.value)}
      />
    </div>
  );
}
