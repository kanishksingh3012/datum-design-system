import { type ReactNode } from "react";
import { Alert, Button, Dialog, DialogBody, DialogFooter, DialogHeader, Sheet, Stack, TextField } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const openStateRows: PropRow[] = [
  ["open", "boolean", "—", "Controlled open state. Pair with onOpenChange."],
  ["defaultOpen", "boolean", "false", "Uncontrolled starting state."],
  ["onOpenChange", "(open) => void", "—", "Called on every open and close, from any cause."],
];
const dialogProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "Element that opens it, usually a Button. Optional: without one, drive open yourself. Focus returns to it on close."],
  ...openStateRows,
  ["size", "sm | md | lg | full", "md", "400 / 560 / 720px wide, or the whole viewport (square corners, like any full-bleed band)."],
  ["role", "dialog | alertdialog", "dialog", "alertdialog for destructive confirmations."],
  ["dismissible", "boolean", "true", "Escape, a click on the scrim, and DialogHeader's close button."],
  ["children", "slots | (close) => ReactNode", "—", "DialogHeader (title + description), DialogBody, DialogFooter."],
];

export default function DialogDoc() {
  return (
    <>
    <section className="component-doc" id="dialog">
      <h1>Dialog</h1>
      <p className="dek">
        A focused task that blocks the page. Built on React Aria's hooks: focus moves in and is trapped, the page behind is
        hidden from assistive tech and can't scroll, Escape closes it, and focus returns to whatever opened it. The title in{" "}
        <span className="prop-values">DialogHeader</span> is the accessible name; its description is linked too.
      </p>

      <Demo box="example">
        <Dialog trigger={<Button>Edit project</Button>}>
          {(close) => (
            <>
              <DialogHeader description="Changes apply to everyone on the team.">Edit project</DialogHeader>
              <DialogBody>
                <TextField label="Project name" defaultValue="Datum" />
              </DialogBody>
              <DialogFooter>
                <Button intent="neutral" appearance="outline" onClick={close}>Cancel</Button>
                <Button onClick={close}>Save</Button>
              </DialogFooter>
            </>
          )}
        </Dialog>
      </Demo>

      <div className="doc-section">
        <h2>Sizes</h2>
        <p className="lead">400, 560 and 720px wide, or the full viewport. Every size keeps <b>radius.card</b> except full, whose corners are the viewport's.</p>
        <Demo>
          {(["sm", "md", "lg", "full"] as const).map((size) => (
            <Dialog key={size} size={size} trigger={<Button intent="neutral" appearance="outline">{size}</Button>}>
              {(close) => (
                <>
                  <DialogHeader>Size {size}</DialogHeader>
                  <DialogBody>The body scrolls on its own when the dialog reaches the viewport height.</DialogBody>
                  <DialogFooter><Button onClick={close}>Done</Button></DialogFooter>
                </>
              )}
            </Dialog>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Destructive confirmation</h2>
        <p className="lead"><b>role="alertdialog"</b> with <b>dismissible=false</b>: no close button, Escape and the scrim do nothing, so the choice is explicit.</p>
        <Demo>
          <Dialog role="alertdialog" dismissible={false} size="sm" trigger={<Button intent="danger" appearance="outline">Delete project</Button>}>
            {(close) => (
              <>
                <DialogHeader description="This removes every file. It can't be undone.">Delete project?</DialogHeader>
                <DialogFooter>
                  <Button intent="neutral" appearance="outline" onClick={close}>Cancel</Button>
                  <Button intent="danger" onClick={close}>Delete</Button>
                </DialogFooter>
              </>
            )}
          </Dialog>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={dialogProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use for a short task that must finish or be cancelled before going on.", "Put the primary action last in the footer.", "Use alertdialog for destructive confirmations."]}
          donts={["Stack dialogs on dialogs.", "Use a dialog for information that could sit on the page — use an Alert.", "Use one for long forms or browsing — use a Sheet or a page."]}
        />
      </div>
      <A11y items={[
          ["Focus", "Moves into the dialog on open, is trapped inside, and returns to the trigger on close."],
          ["Escape", "Closes it."],
          ["Semantics", "role=\"dialog\" with aria-modal, named by its header title; the page behind is inert."],
        ]} />
    </section>

    </>
  );
}
