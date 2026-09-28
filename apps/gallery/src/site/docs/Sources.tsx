import { type ReactNode } from "react";
import { Citation, Source, Sources, Text } from "@datum-design/react";
import { A11y, Demo } from "./kit";

type Row = [string, string, string, string];
function Props({ rows }: { rows: Row[] }) {
  return (
    <table className="props-table">
      <thead><tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr></thead>
      <tbody>{rows.map(([p, t, d, n]) => <tr key={p}><th scope="row"><code>{p}</code></th><td><code>{t}</code></td><td><code>{d}</code></td><td>{n}</td></tr>)}</tbody>
    </table>
  );
}
function Part({ id, title, dek, rows, a11y, children }: { id: string; title: string; dek: ReactNode; rows: Row[]; a11y: [string, ReactNode][]; children: ReactNode }) {
  return (
    <section className="component-doc" id={id}>
      <h1>{title}</h1>
      <p className="dek">{dek}</p>
      <Demo box="example" style={{ display: "block" }}>{children}</Demo>
      <div className="doc-section">
        <h2>Properties</h2>
        <Props rows={rows} />
      </div>
      <A11y items={a11y} />
    </section>
  );
}

export default function SourcesDoc() {
  return (
    <>
    <Part a11y={[["Semantics", "A headed, numbered list of links."], ["Citation", "Inline citations are links named \"Source n\" with a 44px hit area on touch."]]} id="sources" title="Sources + Citation" dek="Where an answer came from: numbered link rows, with inline citations that point at them (44px hit area on touch)." rows={[["title / headingLevel", "string / 2–6", "Sources / 3", ""], ["Source", "number, title, description?, href", "—", ""], ["Citation", "number, href", "—", "Named “Source n”"]]}>
      <Text>Datum ships two themes<Citation number={1} href="#source-1" />.</Text>
      <Sources><Source number={1} title="Datum design guide" description="datum.dev" href="#" /></Sources>
    </Part>
    </>
  );
}
