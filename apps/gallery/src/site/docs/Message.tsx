import { useState, type ReactNode } from "react";
import { Message, MessageList } from "@datum-design/react";
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

export default function MessageDoc() {
  const [streaming, setStreaming] = useState(false);
  return (
    <>
    <Part a11y={[["Streaming", "aria-busy while streaming, so the finished message is announced once, not word by word."], ["Actions", "Hidden until streaming ends; each is a labelled Button."]]} id="message" title="Message + MessageList" dek={<>A user's turn sits in a tinted bubble at the end; an assistant's reads as plain text; <b>system</b> notes are centered captions. <b>streaming</b> adds a caret (still under reduced motion) and hides <b>actions</b> until done.</>} rows={[
      ["author", "user · assistant · system", "—", ""], ["name / avatar / metadata", "string / node / node", "—", "The header; hidden when grouped"], ["grouped", "boolean", "false", ""],
      ["streaming", "boolean", "false", "aria-busy until it settles"], ["actions", "ReactNode", "—", "Row under the message"], ["animateOnMount", "boolean", "false", "One-time enter"],
    ]}>
      <MessageList>
        <Message author="user" name="You" metadata="2:41 PM">Can you pin the chat to the bottom?</Message>
        <Message author="assistant" name="Datum" streaming>Yes — wrap the transcript in a MessageScroller and it follows</Message>
      </MessageList>
    </Part>
    </>
  );
}
