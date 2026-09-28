import { type ReactNode } from "react";
import { Button, Dialog, DropdownMenu, Popover, Sheet, Text, TextField } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const openStateRows: PropRow[] = [
  ["open", "boolean", "—", "Controlled open state. Pair with onOpenChange."],
  ["defaultOpen", "boolean", "false", "Uncontrolled starting state."],
  ["onOpenChange", "(open) => void", "—", "Called on every open and close, from any cause."],
];
const popoverProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "Required. The element that opens it, usually a Button."],
  ["title", "ReactNode", "—", "A heading that also names the dialog. Without one, the trigger's text names it (or pass aria-label)."],
  ["placement", "top | top-start | top-end | bottom | bottom-start | bottom-end | left | right", "bottom", "Flips when there is no room."],
  ...openStateRows,
];

export default function PopoverDoc() {
  return (
    <>
    <section className="component-doc" id="popover">
      <h1>Popover</h1>
      <p className="dek">Rich, interactive content anchored to a trigger — a small form, filters, details. A dialog on React Aria's <span className="prop-values">useOverlayTrigger</span>, <span className="prop-values">usePopover</span> and <span className="prop-values">useDialog</span>: focus moves in on open and back to the trigger on close; Escape or a click outside closes it. The menus' surface: <b>radius.card</b>, <b>elevation.overlay</b>.</p>

      <Demo box="example">
        <Popover trigger={<Button intent="neutral" appearance="outline">Filters</Button>} title="Filter results">
          <Text variant="body-sm">Only show results from the last 30 days.</Text>
          <TextField label="Keyword" size="sm" defaultValue="design" />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-compact)" }}>
            <Button size="sm" intent="neutral" appearance="ghost">Reset</Button>
            <Button size="sm">Apply</Button>
          </div>
        </Popover>
      </Demo>

      <div className="doc-section">
        <h2>Placement</h2>
        <p className="lead">The preferred side; it flips when there is no room.</p>
        <Demo>
          {(["top", "right", "bottom", "left"] as const).map((placement) => (
            <Popover key={placement} placement={placement} trigger={<Button intent="neutral" appearance="outline">{placement}</Button>}>
              <Text variant="body-sm">Opens on the {placement}.</Text>
            </Popover>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={popoverProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Keep it to one small task, with its own actions.", "Give it a title when the trigger's text doesn't say what's inside."]}
          donts={["Use for a list of actions — use a DropdownMenu.", "Put a long flow in it — use a Dialog or a Sheet."]}
        />
      </div>
      <A11y items={[
          ["Enter / Space", "Opens it from the trigger; focus moves inside."],
          ["Escape / click outside", "Closes it and returns focus to the trigger."],
          ["Semantics", "A non-modal dialog, labelled from the trigger or its title."],
        ]} />
    </section>

    </>
  );
}
