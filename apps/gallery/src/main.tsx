import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@datum-design/styles/themes.css";
import "@datum-design/react/styles.css";
import "./gallery.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
