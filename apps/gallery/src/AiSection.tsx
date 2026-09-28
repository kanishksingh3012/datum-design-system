import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  AgentActivity, Avatar, Button, Citation, CodeBlock, Composer, FileDiff, Message, MessageList, MessageScroller, Reasoning,
  Source, Sources, Suggestion, SuggestionItem, Text, ThinkingIndicator, TodoItem, TodoList, ToolCall, type CodeLine, type DiffRow,
} from "@datum-design/react";
import { Copy, RotateCcw } from "lucide-react";

type Row = [string, string, string, string];
type Turn = { id: number; author: "user" | "assistant"; text: string; streaming?: boolean };

const reply = "A MessageScroller stays pinned to the latest message while it streams in. Scroll up to read back and it holds still, with a button to jump to the latest.";

function Props({ rows }: { rows: Row[] }) {
  return (
    <table className="props-table">
      <thead><tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr></thead>
      <tbody>{rows.map(([p, t, d, n]) => <tr key={p}><th scope="row"><code>{p}</code></th><td><code>{t}</code></td><td><code>{d}</code></td><td>{n}</td></tr>)}</tbody>
    </table>
  );
}

function Part({ id, title, dek, rows, children }: { id: string; title: string; dek: ReactNode; rows: Row[]; children: ReactNode }) {
  return (
    <div className="doc-section" id={id}>
      <h2>{title}</h2>
      <p className="lead">{dek}</p>
      <div className="sample-box demo-on-page" style={{ display: "block" }}>{children}</div>
      <Props rows={rows} />
    </div>
  );
}

/** A small chat that streams a canned reply word by word. */
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

const codeLines: CodeLine[] = [
  { tokens: [{ text: "// Enter sends, Shift+Enter adds a line", kind: "comment" }] },
  { tokens: [{ text: "import", kind: "keyword" }, { text: " { Composer } " }, { text: "from", kind: "keyword" }, { text: " " }, { text: '"@datum-design/react"', kind: "string" }, { text: ";", kind: "punctuation" }] },
  { tokens: [{ text: "<" , kind: "punctuation" }, { text: "Composer", kind: "function" }, { text: " label=" }, { text: '"Message"', kind: "string" }, { text: " onSubmit={send} />", kind: "punctuation" }] },
];
const diff: DiffRow[] = [
  { kind: "hunk", content: "@@ -8,3 +8,4 @@" },
  { kind: "context", oldLine: 8, newLine: 8, content: "const id = useId();" },
  { kind: "remove", oldLine: 9, content: "const [value, setValue] = useState(\"\");" },
  { kind: "add", newLine: 9, content: "const [draft, setDraft] = useControllableState(value, defaultValue, onValueChange);" },
  { kind: "add", newLine: 10, content: "const canSend = draft.trim() !== \"\";" },
];

export function AiSection() {
  const [streaming, setStreaming] = useState(false);
  return (
    <section className="component-doc" id="ai">
      <h1>AI</h1>
      <p className="dek">Twelve parts for chat and agent interfaces. Streaming content is <b>aria-busy</b> until it settles, so it is announced once, politely — never per token. Status is always a word, not only a color. Expandable parts share Accordion's trigger in a <b>radius.card</b> box, and hold open while they stream.</p>

      <div className="example-box" style={{ display: "block" }}><ChatDemo /></div>

      <Part id="message" title="Message + MessageList" dek={<>A user's turn sits in a tinted bubble at the end; an assistant's reads as plain text; <b>system</b> notes are centered captions. <b>streaming</b> adds a caret (still under reduced motion) and hides <b>actions</b> until done.</>} rows={[
        ["author", "user · assistant · system", "—", ""], ["name / avatar / metadata", "string / node / node", "—", "The header; hidden when grouped"], ["grouped", "boolean", "false", ""],
        ["streaming", "boolean", "false", "aria-busy until it settles"], ["actions", "ReactNode", "—", "Row under the message"], ["animateOnMount", "boolean", "false", "One-time enter"],
      ]}>
        <MessageList>
          <Message author="user" name="You" metadata="2:41 PM">Can you pin the chat to the bottom?</Message>
          <Message author="assistant" name="Datum" streaming>Yes — wrap the transcript in a MessageScroller and it follows</Message>
        </MessageList>
      </Part>

      <Part id="message-scroller" title="MessageScroller" dek={<>A ScrollArea around a <b>role="log"</b>. Pinned to the bottom while content grows, until the reader scrolls up; then <b>Jump to latest</b> appears. Try it in the chat above.</>} rows={[
        ["label", "string", "Conversation", ""], ["maxHeight", "number | string", "—", ""], ["defaultPinned / onPinnedChange", "boolean / fn", "true", "Read from the DOM, so not controlled"], ["jumpLabel", "string", "Jump to latest", ""],
      ]}><Text>See the chat demo above.</Text></Part>

      <Part id="composer" title="Composer" dek={<>The chat input in Datum's field box; it grows with its content. While <b>thinking</b>, Send shows loading — or Stop, given <b>onStop</b> — and the field stays editable.</>} rows={[
        ["label", "string", "—", "Visually hidden; never the placeholder"], ["value / defaultValue / onValueChange", "string", "\"\"", ""], ["onSubmit", "(value) => void", "—", "Trimmed; an uncontrolled draft clears"],
        ["thinking / onStop", "boolean / fn", "false", ""], ["placeholder", "string", "Message…", ""], ["disabled", "boolean", "false", ""],
      ]}><Composer label="Message" defaultValue="Draft a release note" onSubmit={() => {}} /></Part>

      <Part id="suggestion" title="Suggestion" dek="Prompt chips: a labelled list of neutral outline Buttons. Any Button prop works." rows={[["label", "string", "—", "Names the list"], ["SuggestionItem", "ButtonProps", "neutral · outline · sm", ""]]}>
        <Suggestion label="Suggested prompts"><SuggestionItem>Summarise</SuggestionItem><SuggestionItem>Translate</SuggestionItem></Suggestion>
      </Part>

      <Part id="reasoning" title="Reasoning" dek="The model's trace behind one line. Opens while it streams and settles closed after — unless the reader toggled it." rows={[
        ["title / streamingTitle", "ReactNode", "Reasoning / Thinking…", ""], ["streaming", "boolean", "false", ""], ["collapseOnComplete", "boolean", "true", ""], ["open / defaultOpen / onOpenChange", "boolean", "false", ""],
      ]}>
        <div style={{ display: "grid", gap: "var(--space-compact)" }}>
          <Button intent="neutral" appearance="outline" size="sm" pressed={streaming} onPressedChange={setStreaming}>Streaming</Button>
          <Reasoning title="Thought for 8 seconds" streaming={streaming}>The reader wants the chat pinned. A scroll box can tell whether they are at the end.</Reasoning>
        </div>
      </Part>

      <Part id="thinking-indicator" title="ThinkingIndicator" dek={<><b>role="status"</b> with a visible label; the dots hold still under reduced motion.</>} rows={[["label", "string", "Thinking…", ""]]}><ThinkingIndicator /></Part>

      <Part id="tool-call" title="ToolCall" dek="One tool call: its name and status, with input, output or error behind it." rows={[
        ["name", "string", "—", ""], ["status", "pending · running · success · error", "pending", "Shown as a word"], ["input / output / error", "ReactNode", "—", "error shows only with status error"], ["open / defaultOpen / onOpenChange", "boolean", "false", ""],
      ]}>
        <div style={{ display: "grid", gap: "var(--space-compact)" }}>
          <ToolCall name="search_web" status="running" input='{ "q": "datum" }' />
          <ToolCall name="read_file" status="success" input="src/index.ts" output="120 lines" />
          <ToolCall name="run_tests" status="error" error="2 failing" defaultOpen />
        </div>
      </Part>

      <Part id="agent-activity" title="AgentActivity" dek="An agent's steps in order. Reasoning and tool steps are those components; a step with no detail is one status line." rows={[["items", "{ kind, status, label, children? }[]", "—", "kind: reasoning · search · tool · trace"], ["label", "string", "Agent activity", ""]]}>
        <AgentActivity items={[
          { kind: "reasoning", status: "success", label: "Planned the change", children: "Read the scroller first." },
          { kind: "search", status: "success", label: "Searched the docs" },
          { kind: "tool", status: "running", label: "run_tests", children: "Running 214 tests…" },
        ]} />
      </Part>

      <Part id="todo-list" title="TodoList" dek="The agent's plan, counting what's done. Each item's state is a mark and a word." rows={[["title", "ReactNode", "Plan", ""], ["open / defaultOpen / onOpenChange", "boolean", "true", ""], ["TodoItem status", "pending · active · done · error", "pending", ""], ["TodoItem metadata", "ReactNode", "—", "Second line"]]}>
        <TodoList><TodoItem status="done">Read the plan</TodoItem><TodoItem status="active">Build the parts</TodoItem><TodoItem>Ship</TodoItem></TodoList>
      </Part>

      <Part id="sources" title="Sources + Citation" dek="Where an answer came from: numbered link rows, with inline citations that point at them (44px hit area on touch)." rows={[["title / headingLevel", "string / 2–6", "Sources / 3", ""], ["Source", "number, title, description?, href", "—", ""], ["Citation", "number, href", "—", "Named “Source n”"]]}>
        <Text>Datum ships two themes<Citation number={1} href="#source-1" />.</Text>
        <Sources><Source number={1} title="Datum design guide" description="datum.dev" href="#" /></Sources>
      </Part>

      <Part id="code-block" title="CodeBlock" dek="Code in a card with a copy button; wide lines scroll inside it. Syntax is monochrome: tokens are styled by kind with weight, italics and the two text colors, so it holds in every theme." rows={[["lines / code", "CodeLine[] / string", "—", "Tokens carry a kind, not a color"], ["title / language", "ReactNode / string", "—", ""], ["lineNumbers", "boolean", "true", "Not copied"], ["copyable", "boolean", "true", ""]]}>
        <CodeBlock title="App.tsx" language="tsx" lines={codeLines} />
      </Part>

      <Part id="file-diff" title="FileDiff" dek="A file's changes as a table: added and removed lines on the success and danger subtle fills, with +/− as real text." rows={[["path / rows", "string / DiffRow[]", "—", "kind: add · remove · context · hunk"], ["streaming / collapseOnComplete", "boolean", "false / true", ""], ["open / defaultOpen / onOpenChange", "boolean", "false", ""]]}>
        <FileDiff path="src/Composer.tsx" rows={diff} defaultOpen />
      </Part>
    </section>
  );
}
