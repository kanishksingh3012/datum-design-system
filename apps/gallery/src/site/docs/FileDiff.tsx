import { useState, type ReactNode } from "react";
import { DiffRow, FileDiff } from "@datum-design/react";
import { A11y, Demo } from "./kit";

const diff: DiffRow[] = [
  { kind: "hunk", content: "@@ -8,3 +8,4 @@" },
  { kind: "context", oldLine: 8, newLine: 8, content: "const id = useId();" },
  { kind: "remove", oldLine: 9, content: "const [value, setValue] = useState(\"\");" },
  { kind: "add", newLine: 9, content: "const [draft, setDraft] = useControllableState(value, defaultValue, onValueChange);" },
  { kind: "add", newLine: 10, content: "const canSend = draft.trim() !== \"\";" },
];
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

export default function FileDiffDoc() {
  const [streaming, setStreaming] = useState(false);
  return (
    <>
    <Part a11y={[["Semantics", "A table; + / − are real text, so changes don't rely on the green and red fills."], ["Enter / Space", "Expands or collapses the file."]]} id="file-diff" title="FileDiff" dek="A file's changes as a table: added and removed lines on the success and danger subtle fills, with +/− as real text. The card is a container (bg.surface); the rows sit in a sunken well, and hunk lines are container-fill bands across it." rows={[["path / rows", "string / DiffRow[]", "—", "kind: add · remove · context · hunk"], ["streaming / collapseOnComplete", "boolean", "false / true", ""], ["open / defaultOpen / onOpenChange", "boolean", "false", ""]]}>
      <FileDiff path="src/Composer.tsx" rows={diff} defaultOpen />
    </Part>
    </>
  );
}
