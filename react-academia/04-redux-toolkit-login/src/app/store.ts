import { configureStore } from "@reduxjs/toolkit";
import misCursosReducer from "../features/misCursos/misCursosSlice";
import authReducer from "../features/auth/authSlice";
import { api } from "../services/api";

// Lee una clave de localStorage. Si no hay nada o está mal, undefined
function leerGuardado(clave: string) {
  try {
    const texto = localStorage.getItem(clave);
    return texto ? JSON.parse(texto) : undefined;
  } catch {
    return undefined;
  }
}

export const store = configureStore({
  reducer: {
    misCursos: misCursosReducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer, // la caché de RTK Query
  },
  // Necesario para que RTK Query funcione. Se copia tal cual
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  // Con qué estado arranca el store (si es undefined, usa el initialState)
  preloadedState: {
    misCursos: leerGuardado("misCursos"),
    auth: leerGuardado("auth"),
  },
});

// Después de cada acción, guarda Mis cursos y la sesión
store.subscribe(() => {
  const { misCursos, auth } = store.getState();
  localStorage.setItem("misCursos", JSON.stringify(misCursos));
  localStorage.setItem("auth", JSON.stringify(auth));
});

// Los tipos del estado y del dispatch, sacados del propio store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
