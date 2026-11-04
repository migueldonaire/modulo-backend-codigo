import { useTranslation } from "react-i18next";

export function SelectorIdioma() {
  const { i18n } = useTranslation();

  return (
    <div role="group" aria-label="Idioma">
      {["es", "en"].map((idioma) => (
        <button
          key={idioma}
          onClick={() => i18n.changeLanguage(idioma)}
          aria-pressed={i18n.language === idioma}
        >
          {idioma.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
