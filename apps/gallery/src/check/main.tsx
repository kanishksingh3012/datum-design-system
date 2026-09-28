import { createRoot } from "react-dom/client";
import "@datum-design/styles/themes.css";
import "@datum-design/react/styles.css";
import { fixtures } from "./fixtures";

// ?component=Button&theme=orange|navy&mode=light|dark&variant=0
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
const variant = Number(params.get("variant") ?? 0);
document.body.dataset.fixture = Fixture ? "ready" : "missing";
// a fixture with states lists them; the checker loads each one as ?variant=n
if (Fixture?.variants) document.body.dataset.variants = JSON.stringify(Fixture.variants);
createRoot(document.getElementById("root")!).render(<div id="fixture">{Fixture ? <Fixture variant={variant} /> : null}</div>);
