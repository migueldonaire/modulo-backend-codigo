import { MisCursosProvider } from "./context/MisCursosProvider";
import { Cabecera } from "./components/Cabecera";
import { Catalogo } from "./components/Catalogo";
import { MisCursos } from "./components/MisCursos";
import { FormularioInscripcion } from "./components/FormularioInscripcion";
import { FormularioInscripcionRHF } from "./components/FormularioInscripcionRHF";

function App() {
  return (
    <MisCursosProvider>
      <Cabecera />
      <Catalogo />
      <main>
        <MisCursos />
        <FormularioInscripcion />
        <FormularioInscripcionRHF />
      </main>
    </MisCursosProvider>
  );
}

export default App;
