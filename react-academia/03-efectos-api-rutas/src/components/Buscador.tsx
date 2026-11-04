type BuscadorProps = {
  texto: string; // el valor que viene del padre
  onCambiarTexto: (texto: string) => void; // una función: recibe un texto y no devuelve nada
};

export function Buscador({ texto, onCambiarTexto }: BuscadorProps) {
  return (
    <div>
      <label htmlFor="buscar">Buscar curso</label>
      <input
        id="buscar"
        type="search"
        value={texto}
        onChange={(e) => onCambiarTexto(e.target.value)}
      />
    </div>
  );
}
