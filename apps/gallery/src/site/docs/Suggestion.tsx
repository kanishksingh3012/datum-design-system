import { type ReactNode } from "react";
import { ButtonProps, Suggestion, SuggestionItem } from "@datum-design/react";
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

export default function SuggestionDoc() {
  return (
    <>
    <Part a11y={[["Semantics", "A labelled list of Buttons; Tab moves between them, Enter / Space picks one."]]} id="suggestion" title="Suggestion" dek="Prompt chips: a labelled list of neutral outline Buttons. Any Button prop works." rows={[["label", "string", "—", "Names the list"], ["SuggestionItem", "ButtonProps", "neutral · outline · sm", ""]]}>
      <Suggestion label="Suggested prompts"><SuggestionItem>Summarise</SuggestionItem><SuggestionItem>Translate</SuggestionItem></Suggestion>
    </Part>
    </>
  );
}
