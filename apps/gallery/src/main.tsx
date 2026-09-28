import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@datum-design/styles/themes.css";
import "@datum-design/react/styles.css";
import "./gallery.css";
import "./site/site.css";
import { Layout } from "./site/Layout";
import { Landing } from "./site/Landing";
import { ComponentPage, Placeholder } from "./site/pages";
import { GettingStarted } from "./site/GettingStarted";
import { Theming } from "./site/Theming";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="docs" element={<GettingStarted />} />
          <Route path="docs/theming" element={<Theming />} />
          <Route path="docs/components/:slug" element={<ComponentPage />} />
          <Route path="blocks" element={<Placeholder title="Blocks">Page-level compositions built from Datum components. Coming soon.</Placeholder>} />
          <Route path="*" element={<Placeholder title="Not found">That page doesn't exist.</Placeholder>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
