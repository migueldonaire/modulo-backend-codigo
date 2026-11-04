import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import misCursosReducer from "../features/misCursos/misCursosSlice";
import authReducer from "../features/auth/authSlice";
import { api } from "../app/api";

export function renderConProveedores(ui: ReactElement) {
  const store = configureStore({
    reducer: {
      misCursos: misCursosReducer,
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  });

  const resultado = render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );

  return { store, ...resultado };
}
