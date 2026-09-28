import { Grid, Stack } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const Cell = ({ children }: { children: string }) => <div className="demo-cell">{children}</div>;
const gridProps: PropRow[] = [
  ["columns", "1–12 | { base, md, lg }", "1", "A number applies at every width; an object switches at 768 / 1024px, each step inheriting the one below."],
  ["minItemWidth", "number | string", "—", "Auto-fit: as many columns as fit, each at least this wide. Wins over columns."],
  ["gap", "none | xs | sm | md | lg | xl", "md", "Same scale as Stack."],
];

export default function GridDoc() {
  return (
    <>
    <section className="component-doc" id="grid">
      <h1>Grid</h1>
      <p className="dek">Equal columns that collapse on small screens. Give it a column count per breakpoint, or a minimum item width and let it fit as many as it can.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Grid columns={{ base: 1, md: 3 }}>
          <Cell>One</Cell><Cell>Two</Cell><Cell>Three</Cell>
        </Grid>
      </Demo>

      <div className="doc-section">
        <h2>Responsive columns</h2>
        <p className="lead">An object switches at the <b>md</b> (768px) and <b>lg</b> (1024px) breakpoints; each step inherits the one below it. A plain number applies at every width. Resize the window to see this one go 1 → 2 → 4.</p>
        <Demo style={{ display: "block" }}>
          <Grid columns={{ base: 1, md: 2, lg: 4 }} gap="sm">
            {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => <Cell key={n}>{n}</Cell>)}
          </Grid>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Auto-fit</h2>
        <p className="lead"><b>minItemWidth</b> makes as many columns as fit, each at least that wide — no breakpoints needed. A single item never overflows a narrower container.</p>
        <Demo style={{ display: "block" }}>
          <Grid minItemWidth={180} gap="sm">
            {["Starter", "Team", "Business", "Enterprise"].map((n) => <Cell key={n}>{n}</Cell>)}
          </Grid>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={gridProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Start at one column and add columns at md and lg.", "Use minItemWidth for card grids of unknown length."]}
          donts={["Use a fixed column count above 2 without a responsive object — it stays that wide on phones.", "Use Grid for a single row of buttons — use Stack."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "A plain div. Items flow in source order at every breakpoint, so tab order never jumps."],
        ]} />
    </section>

    </>
  );
}
