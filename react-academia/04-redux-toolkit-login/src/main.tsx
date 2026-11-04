import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* todo lo de dentro puede usar el store */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
