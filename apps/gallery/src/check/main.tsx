import { createRoot } from "react-dom/client";
import "@datum-design/styles/themes.css";
import "@datum-design/react/styles.css";
import { fixtures } from "./fixtures";

// ?component=Button&theme=orange|navy&mode=light|dark
const params = new URLSearchParams(location.search);
const name = params.get("component") ?? "Button";
const root = document.documentElement;
root.dataset.theme = params.get("theme") ?? "orange";
root.style.colorScheme = params.get("mode") ?? "light";

const style = document.createElement("style");
style.textContent = `
  body { margin: 0; background: var(--color-bg-page); color: var(--color-text-primary); font-family: var(--font-body); }
  #fixture { display: grid; gap: var(--space-default); padding: var(--space-section); }
  .row { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-tight); }
`;
document.head.appendChild(style);

const Fixture = fixtures[name];
document.body.dataset.fixture = Fixture ? "ready" : "missing";
createRoot(document.getElementById("root")!).render(<div id="fixture">{Fixture ? <Fixture /> : null}</div>);
