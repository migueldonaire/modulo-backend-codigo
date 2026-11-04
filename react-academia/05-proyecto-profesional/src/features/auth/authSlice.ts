import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Usuario } from "./authService";

type AuthState = {
  token: string | null;
  usuario: Usuario | null; // null = nadie ha entrado
};

const initialState: AuthState = {
  token: null,
  usuario: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sesionIniciada(state, action: PayloadAction<{ token: string; usuario: Usuario }>) {
      state.token = action.payload.token;
      state.usuario = action.payload.usuario;
    },
    sesionCerrada(state) {
      state.token = null;
      state.usuario = null;
    },
  },
});

export const { sesionIniciada, sesionCerrada } = authSlice.actions;
export default authSlice.reducer;
