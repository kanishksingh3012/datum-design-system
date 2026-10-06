import { type ReactNode } from "react";
import { ToolCall } from "@datum-design/react";
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

export default function ToolCallDoc() {
  return (
    <>
    <Part a11y={[["Enter / Space", "Expands the call to show input, output or error."], ["Status", "Shown as a word as well as an icon."]]} id="tool-call" title="ToolCall" dek={<>One tool call: its name and status, with input, output or error behind it. The card is a container (<b>bg.surface</b> with a border); input, output and error sit in wells one step down (<b>bg.surfaceSunken</b>), and a call nested in another expandable card steps up to <b>bg.surfaceRaised</b>.</>} rows={[
      ["name", "string", "—", ""], ["status", "pending · running · success · error", "pending", "Shown as a word"], ["input / output / error", "ReactNode", "—", "error shows only with status error"], ["open / defaultOpen / onOpenChange", "boolean", "false", ""],
    ]}>
      <div style={{ display: "grid", gap: "var(--space-compact)" }}>
        <ToolCall name="search_web" status="running" input='{ "q": "datum" }' />
        <ToolCall name="read_file" status="success" input="src/index.ts" output="120 lines" />
        <ToolCall name="run_tests" status="error" error="2 failing" defaultOpen />
      </div>
    </Part>
    </>
  );
}
