import type { ReactNode } from "react";
import { Demo, PropRow, PropsTable } from "./kit";

const shared: PropRow[] = [
  ["data", "ChartDatum[]", "—", "Rows to plot."],
  ["series", "{ key, label, color? }[]", "—", "One entry per series, in legend order. color: 1–6 (chart tokens, default by position), up, down or neutral. Never more than six: fold the rest into Other."],
  ["label", "string", "—", "Accessible name and the hidden data table's caption."],
  ["summary", "string", "generated", "Replaces the spoken summary (range, each series' low and high)."],
  ["valueFormatter / xFormatter", "(v) => string", "toLocaleString / String", "Axis ticks, tooltip, table and summary."],
  ["size", "sm | md | lg", "md", "160 / 240 / 320px plot height."],
  ["legend", "boolean", "2+ series", "Swatch + label list under the plot."],
];

/** One chart doc page: intro, demos, props, the shared a11y notes. */
export function ChartDoc({ id, name, dek, demos, props }: { id: string; name: string; dek: string; demos: [string, ReactNode][]; props: PropRow[] }) {
  return (
    <section className="component-doc" id={id}>
      <h1>{name}</h1>
      <p className="dek">{dek} Import from <code>@datum-design/react/charts</code>, so apps without charts never load Recharts.</p>
      {demos.map(([title, node], i) => (
        <div className="doc-section" key={title}>
          {i > 0 && <h2>{title}</h2>}
          <Demo box="example">{node}</Demo>
        </div>
      ))}
      <div className="doc-section">
        <h2>Props</h2>
        <PropsTable rows={[...props, ...shared]} />
      </div>
      <div className="doc-section">
        <h2>Accessibility</h2>
        <ul>
          <li>The figure is named with a summary of the data; a visually hidden table holds every value.</li>
          <li>Tab to the chart, then use the arrow keys to move the tooltip point by point.</li>
          <li>Every series color reaches 3:1 against the page and surface in all four theme combos; text uses text tokens, never a series color.</li>
          <li>No animation under prefers-reduced-motion. Inside a card, set <code>--chart-surface: var(--color-bg-surface)</code>.</li>
        </ul>
      </div>
    </section>
  );
}
