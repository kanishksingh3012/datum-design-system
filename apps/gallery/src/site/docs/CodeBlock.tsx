import { type ReactNode } from "react";
import { CodeBlock, CodeLine, Composer, Message } from "@datum-design/react";
import { A11y, Demo } from "./kit";

const codeLines: CodeLine[] = [
  { tokens: [{ text: "// Enter sends, Shift+Enter adds a line", kind: "comment" }] },
  { tokens: [{ text: "import", kind: "keyword" }, { text: " { Composer } " }, { text: "from", kind: "keyword" }, { text: " " }, { text: '"@datum-design/react"', kind: "string" }, { text: ";", kind: "punctuation" }] },
  { tokens: [{ text: "<" , kind: "punctuation" }, { text: "Composer", kind: "function" }, { text: " label=" }, { text: '"Message"', kind: "string" }, { text: " onSubmit={send} />", kind: "punctuation" }] },
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

export default function CodeBlockDoc() {
  return (
    <>
    <Part a11y={[["Copy", "The copy button is labelled and confirms when copied; line numbers aren't copied."], ["Scrolling", "Wide lines scroll inside the block, which is keyboard-focusable when it overflows."]]} id="code-block" title="CodeBlock" dek="Code in a sunken well (bg.surfaceSunken with an edge) under a container header band with a copy button; it fills its parent's width, and wide lines scroll inside it. Syntax is monochrome: tokens are styled by kind with weight, italics and the two text colors, so it holds in every theme." rows={[["lines / code", "CodeLine[] / string", "—", "Tokens carry a kind, not a color"], ["title / language", "ReactNode / string", "—", ""], ["lineNumbers", "boolean", "true", "Not copied"], ["copyable", "boolean", "true", ""]]}>
      <CodeBlock title="App.tsx" language="tsx" lines={codeLines} />
    </Part>
    </>
  );
}
