import { type ReactNode } from "react";
import { TodoItem, TodoList } from "@datum-design/react";
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

export default function TodoListDoc() {
  return (
    <>
    <Part a11y={[["Enter / Space", "Collapses or expands the plan."], ["Status", "Each item's state is a mark and a word, never color alone."]]} id="todo-list" title="TodoList" dek="The agent's plan, counting what's done. Each item's state is a mark and a word." rows={[["title", "ReactNode", "Plan", ""], ["open / defaultOpen / onOpenChange", "boolean", "true", ""], ["TodoItem status", "pending · active · done · error", "pending", ""], ["TodoItem metadata", "ReactNode", "—", "Second line"]]}>
      <TodoList><TodoItem status="done">Read the plan</TodoItem><TodoItem status="active">Build the parts</TodoItem><TodoItem>Ship</TodoItem></TodoList>
    </Part>
    </>
  );
}
