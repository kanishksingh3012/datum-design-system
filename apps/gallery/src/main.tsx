import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "@datum-design/styles/themes.css";
import "@datum-design/react/styles.css";
import "./gallery.css";
import "./site/site.css";
import { App } from "./App";
import { Layout } from "./site/Layout";
import { Landing } from "./site/Landing";
import { ComponentPage, Placeholder } from "./site/pages";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="docs" element={<Placeholder title="Getting started" />} />
          <Route path="docs/theming" element={<Placeholder title="Theming" />} />
          <Route path="docs/components/:slug" element={<ComponentPage />} />
          <Route path="blocks" element={<Placeholder title="Blocks">Page-level compositions built from Datum components. Coming soon.</Placeholder>} />
          <Route path="*" element={<Placeholder title="Not found">That page doesn't exist.</Placeholder>} />
        </Route>
        {/* Legacy single-page gallery, retired once every section is migrated (M5). */}
        <Route path="gallery" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
