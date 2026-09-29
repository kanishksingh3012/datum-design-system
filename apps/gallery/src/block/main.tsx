import type { ComponentType } from "react";
import { createRoot } from "react-dom/client";
import "@datum-design/styles/themes.css";
import "@datum-design/react/styles.css";

// ?name=Hero — one block on its own page, so the Blocks page can frame it at a real width.
const blocks = import.meta.glob<{ default: ComponentType }>("../site/blocks/*.tsx", { eager: true });
const name = new URLSearchParams(location.search).get("name");
const Block = blocks[`../site/blocks/${name}.tsx`]?.default;

const root = document.documentElement;
const style = document.createElement("style");
style.textContent = "body { margin: 0; background: var(--color-bg-page); color: var(--color-text-primary); font-family: var(--font-body); }";
document.head.appendChild(style);

// follow the docs site's theme and mode when framed by it
function sync() {
  try {
    const host = window.parent.document.documentElement;
    if (host === root) return;
    root.dataset.theme = host.dataset.theme ?? "orange";
    root.style.colorScheme = host.style.colorScheme;
  } catch {
    // not same-origin: keep the defaults
  }
}
sync();
try {
  new MutationObserver(sync).observe(window.parent.document.documentElement, { attributes: true, attributeFilter: ["data-theme", "style"] });
} catch {
  // not framed by the site
}

createRoot(document.getElementById("root")!).render(Block ? <Block /> : <p>No block named “{name}”.</p>);
