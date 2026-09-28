import { type ReactNode } from "react";
import { AgentActivity } from "@datum-design/react";
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

export default function AgentActivityDoc() {
  return (
    <>
    <Part a11y={[["Order", "Steps are an ordered list; reasoning and tool steps keep their own keyboard behavior."]]} id="agent-activity" title="AgentActivity" dek="An agent's steps in order. Reasoning and tool steps are those components; a step with no detail is one status line." rows={[["items", "{ kind, status, label, children? }[]", "—", "kind: reasoning · search · tool · trace"], ["label", "string", "Agent activity", ""]]}>
      <AgentActivity items={[
        { kind: "reasoning", status: "success", label: "Planned the change", children: "Read the scroller first." },
        { kind: "search", status: "success", label: "Searched the docs" },
        { kind: "tool", status: "running", label: "run_tests", children: "Running 214 tests…" },
      ]} />
    </Part>
    </>
  );
}
