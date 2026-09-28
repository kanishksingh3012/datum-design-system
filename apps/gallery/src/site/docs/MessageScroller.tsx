import { useEffect, useRef, useState, type ReactNode } from "react";
import { Avatar, Button, Composer, Message, MessageList, MessageScroller, ScrollArea, Suggestion, SuggestionItem, Text, ThinkingIndicator } from "@datum-design/react";
import { Copy, RotateCcw } from "lucide-react";
import { A11y, Demo } from "./kit";

type Turn = { id: number; author: "user" | "assistant"; text: string; streaming?: boolean };
const reply = "A MessageScroller stays pinned to the latest message while it streams in. Scroll up to read back and it holds still, with a button to jump to the latest.";
function ChatDemo() {
  const [turns, setTurns] = useState<Turn[]>([{ id: 0, author: "assistant", text: "Ask me anything about Datum." }]);
  const timer = useRef<ReturnType<typeof setInterval>>();
  const thinking = turns.some((t) => t.streaming);
  useEffect(() => () => clearInterval(timer.current), []);

  const send = (text: string) => {
    const id = Date.now();
    setTurns((t) => [...t, { id, author: "user", text }, { id: id + 1, author: "assistant", text: "", streaming: true }]);
    const words = reply.split(" ");
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      setTurns((t) => t.map((m) => (m.id === id + 1 ? { ...m, text: words.slice(0, i).join(" "), streaming: i < words.length } : m)));
      if (i >= words.length) clearInterval(timer.current);
    }, 90);
  };
  const stop = () => {
    clearInterval(timer.current);
    setTurns((t) => t.map((m) => ({ ...m, streaming: false })));
  };

  return (
    <div style={{ display: "grid", gap: "var(--space-default)", maxWidth: 640, margin: "0 auto" }}>
      <MessageScroller maxHeight={320} style={{ border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-card)" }}>
        <MessageList>
          {turns.map((m) => (
            <Message
              key={m.id}
              author={m.author}
              name={m.author === "user" ? "You" : "Datum"}
              avatar={m.author === "assistant" ? <Avatar name="Datum" size="sm" /> : undefined}
              streaming={m.streaming}
              animateOnMount
              actions={m.author === "assistant" ? <><Button intent="neutral" appearance="ghost" size="sm" iconOnly label="Copy"><Copy /></Button><Button intent="neutral" appearance="ghost" size="sm" iconOnly label="Retry"><RotateCcw /></Button></> : undefined}
            >
              {m.text || <ThinkingIndicator />}
            </Message>
          ))}
        </MessageList>
      </MessageScroller>
      <Suggestion label="Suggested prompts">
        {["How does pinning work?", "Show me the Composer", "What is a tool call?"].map((s) => (
          <SuggestionItem key={s} onClick={() => !thinking && send(s)}>{s}</SuggestionItem>
        ))}
      </Suggestion>
      <Composer label="Message Datum" thinking={thinking} onStop={stop} onSubmit={send} />
    </div>
  );
}
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

export default function MessageScrollerDoc() {
  const [streaming, setStreaming] = useState(false);
  return (
    <>
    <Part a11y={[["Semantics", "A role=\"log\" inside a labelled ScrollArea; new messages are announced politely."], ["Jump to latest", "Appears when the reader scrolls up; a real button, reachable with Tab."]]} id="message-scroller" title="MessageScroller" dek={<>A ScrollArea around a <b>role="log"</b>. Pinned to the bottom while content grows, until the reader scrolls up; then <b>Jump to latest</b> appears. Try it in the chat above.</>} rows={[
      ["label", "string", "Conversation", ""], ["maxHeight", "number | string", "—", ""], ["defaultPinned / onPinnedChange", "boolean / fn", "true", "Read from the DOM, so not controlled"], ["jumpLabel", "string", "Jump to latest", ""],
    ]}><ChatDemo /></Part>
    </>
  );
}
