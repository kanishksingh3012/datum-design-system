import { type ReactNode } from "react";
import { Composer, Message } from "@datum-design/react";
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

export default function ComposerDoc() {
  return (
    <>
    <Part a11y={[["Enter", "Sends; Shift + Enter adds a new line."], ["Thinking", "Send shows loading (or Stop, given onStop) and the field stays editable."]]} id="composer" title="Composer" dek={<>The chat input in Datum's field box; it grows with its content. While <b>thinking</b>, Send shows loading — or Stop, given <b>onStop</b> — and the field stays editable.</>} rows={[
      ["label", "string", "—", "Visually hidden; never the placeholder"], ["value / defaultValue / onValueChange", "string", "\"\"", ""], ["onSubmit", "(value) => void", "—", "Trimmed; an uncontrolled draft clears"],
      ["thinking / onStop", "boolean / fn", "false", ""], ["placeholder", "string", "Message…", ""], ["disabled", "boolean", "false", ""],
    ]}><Composer label="Message" defaultValue="Draft a release note" onSubmit={() => {}} /></Part>
    </>
  );
}
