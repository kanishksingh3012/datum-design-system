import { Button, Tooltip } from "@datum-design/react";
import { Plus, Search } from "lucide-react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const openStateRows: PropRow[] = [
  ["open", "boolean", "—", "Controlled open state. Pair with onOpenChange."],
  ["defaultOpen", "boolean", "false", "Uncontrolled starting state."],
  ["onOpenChange", "(open) => void", "—", "Called on every open and close, from any cause."],
];
const tooltipProps: PropRow[] = [
  ["content", "string", "—", "Plain text only. A tooltip is never interactive."],
  ["children", "ReactElement", "—", "The focusable element it describes."],
  ["placement", "top | right | bottom | left", "top", "Flips when there is no room."],
  ["delay", "number (ms)", "500", "Hover delay. Keyboard focus shows it at once."],
  ...openStateRows,
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];

export default function TooltipDoc() {
  return (
    <>
    <section className="component-doc" id="tooltip">
      <h1>Tooltip</h1>
      <p className="dek">
        A short hint on hover (after 500ms) or keyboard focus (at once), linked with <span className="prop-values">aria-describedby</span>.
        Escape hides it. Ink on <b>radius.card</b>. It adds to the trigger's accessible name — an icon-only Button still needs its{" "}
        <span className="prop-values">label</span>.
      </p>

      <Demo box="example">
        <Tooltip content="Search the docs">
          <Button iconOnly label="Search" intent="neutral" appearance="ghost"><Search /></Button>
        </Tooltip>
        <Tooltip content="Add a member">
          <Button iconOnly label="Add" intent="neutral" appearance="outline"><Plus /></Button>
        </Tooltip>
      </Demo>

      <div className="doc-section">
        <h2>Placement</h2>
        <p className="lead">The preferred side; it flips when there is no room.</p>
        <Demo>
          {(["top", "right", "bottom", "left"] as const).map((placement) => (
            <Tooltip key={placement} content={`On the ${placement}`} placement={placement}>
              <Button intent="neutral" appearance="outline">{placement}</Button>
            </Tooltip>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={tooltipProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Name icon-only controls.", "Keep it to a few words, as plain text."]}
          donts={["Put links, buttons or anything interactive in a tooltip.", "Hide information people need — touch screens have no hover.", "Put one on a disabled control, which can't take focus."]}
        />
      </div>
      <A11y items={[
          ["Focus / hover", "Shows after a short delay on hover, and at once on keyboard focus."],
          ["Escape", "Hides it."],
          ["Content", "Supplementary only: never put the only copy of important information, or anything interactive, in a tooltip."],
        ]} />
    </section>

    </>
  );
}
