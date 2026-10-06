import { createRoot } from "react-dom/client";
import "@datum-design/styles/themes.css";
import "@datum-design/react/styles.css";
import plan from "../../../../docs/component-plan.json";
import { fixtures } from "../check/fixtures";
import "./review.css";

// Every phase-1 fixture in all four combos, grouped as the plan groups them.
// Themes are scoped to :root, so each combo renders in its own check.html frame.
const combos = [
  ["orange", "light"], ["orange", "dark"], ["navy", "light"], ["navy", "dark"],
] as const;
const names = (n: string) => n.split(" + ").reverse().filter((c) => fixtures[c]);

// modal overlays are fixed to the frame's viewport, so they add nothing to its scroll height:
// give their frames room to hug the full panel instead of hitting the viewport cap
const OVERLAY_ROOM = 600;
const needsRoom = (name: string, label: string) => ["Dialog", "Sheet"].includes(name) || label === "mobile menu open";

function Frame({ name, theme, mode, variant, room }: { name: string; theme: string; mode: string; variant: number; room: boolean }) {
  const fit = (el: HTMLIFrameElement) => {
    const doc = el.contentDocument;
    if (!doc) return;
    const size = () => (el.style.height = `${Math.max(doc.documentElement.scrollHeight, room ? OVERLAY_ROOM : 0)}px`);
    new ResizeObserver(size).observe(doc.body);
    size();
  };
  return (
    <figure className="combo">
      <figcaption>{theme} · {mode}</figcaption>
      <iframe
        title={`${name} ${theme} ${mode}`}
        loading="lazy"
        src={`check.html?component=${name}&theme=${theme}&mode=${mode}&variant=${variant}`}
        onLoad={(e) => fit(e.currentTarget)}
      />
    </figure>
  );
}

// review.html?only=LineChart,BarChart shows just those fixtures (the approval-gate screenshots).
const only = new URLSearchParams(location.search).get("only")?.split(",");

function Review() {
  return (
    <main className="review">
      <header>
        <h1>Datum phase 1 — review</h1>
        <nav>{plan.groups.map((g) => <a key={g.name} href={`#${g.name}`}>{g.name}</a>)}</nav>
      </header>
      {plan.groups.map((g) => (
        <section key={g.name} id={g.name}>
          <h2>{g.name}</h2>
          {g.items.flatMap((item) => names(item.n)).filter((name) => !only || only.includes(name)).map((name) =>
            (fixtures[name].variants ?? [""]).map((label, variant) => (
              <article key={`${name}-${variant}`} id={`${name}-${variant}`}>
                <h3>{name}{label && <span> — {label}</span>}</h3>
                <div className="grid">
                  {combos.map(([theme, mode]) => (
                    <Frame key={theme + mode} name={name} theme={theme} mode={mode} variant={variant} room={needsRoom(name, label)} />
                  ))}
                </div>
              </article>
            )),
          )}
        </section>
      ))}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<Review />);
