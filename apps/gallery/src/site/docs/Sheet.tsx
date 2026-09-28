import { type ReactNode } from "react";
import { Button, Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, Sheet, SheetSide, Stack } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const sheetSides: SheetSide[] = ["right", "left", "top", "bottom"];
const openStateRows: PropRow[] = [
  ["open", "boolean", "—", "Controlled open state. Pair with onOpenChange."],
  ["defaultOpen", "boolean", "false", "Uncontrolled starting state."],
  ["onOpenChange", "(open) => void", "—", "Called on every open and close, from any cause."],
];
const sheetProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "As Dialog."],
  ...openStateRows,
  ["side", "top | right | bottom | left", "right", "The edge it slides in from. The edge facing the page is rounded; the viewport edges are square."],
  ["size", "sm | md | lg", "md", "320 / 420 / 560px — width from the sides, height from the top or bottom. Always leaves a strip of scrim."],
  ["children", "slots | (close) => ReactNode", "—", "The same slots as Dialog. Always dismissible."],
];

export default function SheetDoc() {
  return (
    <>
    <section className="component-doc" id="sheet">
      <h1>Sheet</h1>
      <p className="dek">
        A panel that slides in from an edge — filters, settings, mobile navigation. It is a modal dialog with the same slots as
        Dialog: focus is trapped and returns on close, and Escape, the scrim and the close button all dismiss it.
      </p>

      <Demo box="example">
        <Sheet trigger={<Button intent="neutral" appearance="outline">Filters</Button>}>
          {(close) => (
            <>
              <DialogHeader description="Narrow the list.">Filters</DialogHeader>
              <DialogBody>
                <Stack gap="sm">
                  <Checkbox label="Open issues" defaultChecked />
                  <Checkbox label="Assigned to me" />
                </Stack>
              </DialogBody>
              <DialogFooter><Button onClick={close}>Apply</Button></DialogFooter>
            </>
          )}
        </Sheet>
      </Demo>

      <div className="doc-section">
        <h2>Sides</h2>
        <p className="lead">Flush with its edge; only the edge facing the page is rounded. It moves in by transform, and appears in place under reduced motion.</p>
        <Demo>
          {sheetSides.map((side) => (
            <Sheet key={side} side={side} trigger={<Button intent="neutral" appearance="outline">{side}</Button>}>
              <DialogHeader>From the {side}</DialogHeader>
              <DialogBody>320, 420 or 560px deep, always leaving a strip of scrim to tap.</DialogBody>
            </Sheet>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={sheetProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use for secondary tasks that relate to the page behind — filters, details, settings.", "Use side=\"bottom\" for mobile actions within thumb reach."]}
          donts={["Use for a confirmation — use a Dialog.", "Put primary navigation in a sheet on desktop, where it can stay on the page."]}
        />
      </div>
      <A11y items={[
          ["Focus", "Trapped inside while open; returns to the trigger on close."],
          ["Escape", "Closes it."],
          ["Semantics", "A modal dialog anchored to an edge, named by its title."],
        ]} />
    </section>

    </>
  );
}
