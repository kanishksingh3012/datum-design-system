import { useState, type ReactNode } from "react";
import { Button, Reasoning } from "@datum-design/react";
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

export default function ReasoningDoc() {
  const [streaming, setStreaming] = useState(false);
  return (
    <>
    <Part a11y={[["Enter / Space", "Toggles the trace; aria-expanded reflects it."], ["Streaming", "Opens while streaming and closes after, unless the reader toggled it."]]} id="reasoning" title="Reasoning" dek="The model's trace behind one line. Opens while it streams and settles closed after — unless the reader toggled it. The card is a container (bg.surface with a border); the trace sits beside a border.strong rule." rows={[
      ["title / streamingTitle", "ReactNode", "Reasoning / Thinking…", ""], ["streaming", "boolean", "false", ""], ["collapseOnComplete", "boolean", "true", ""], ["open / defaultOpen / onOpenChange", "boolean", "false", ""],
    ]}>
      <div style={{ display: "grid", gap: "var(--space-compact)" }}>
        <Button intent="neutral" appearance="outline" size="sm" pressed={streaming} onPressedChange={setStreaming}>Streaming</Button>
        <Reasoning title="Thought for 8 seconds" streaming={streaming}>The reader wants the chat pinned. A scroll box can tell whether they are at the end.</Reasoning>
      </div>
    </Part>
    </>
  );
}
