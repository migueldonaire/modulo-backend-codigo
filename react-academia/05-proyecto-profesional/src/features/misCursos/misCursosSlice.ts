import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Cómo es esta parte del estado
type MisCursosState = {
  ids: string[];
};

// Cómo empieza
const initialState: MisCursosState = {
  ids: [],
};

export const misCursosSlice = createSlice({
  name: "misCursos", // prefijo de las acciones: "misCursos/anadir"
  initialState,
  reducers: {
    // Cada función es un reducer Y crea su acción
    anadir(state, action: PayloadAction<string>) {
      // action.payload = el id del curso
      if (!state.ids.includes(action.payload)) {
        state.ids.push(action.payload);
      }
    },
    quitar(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
    vaciar(state) {
      state.ids = [];
    },
  },
});

// Las acciones, para usarlas en los componentes
export const { anadir, quitar, vaciar } = misCursosSlice.actions;
// El reducer, para el store
export default misCursosSlice.reducer;
