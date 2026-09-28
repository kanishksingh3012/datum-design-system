import { type ReactNode } from "react";
import { ContextMenu, ContextMenuItem, DropdownMenu } from "@datum-design/react";
import { Copy, Pencil, Trash2 } from "lucide-react";
import { CommandPaletteDoc } from "../../PickersSection";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const contextItems: ContextMenuItem[] = [
  { label: "Copy", icon: <Copy />, shortcut: "⌘C" },
  { label: "Rename", icon: <Pencil /> },
  { type: "separator" },
  { label: "Delete", intent: "danger", icon: <Trash2 />, shortcut: "⌫" },
];
const sections = ["Overview", "Activity", "Settings"];
const openStateRows: PropRow[] = [
  ["open", "boolean", "—", "Controlled open state. Pair with onOpenChange."],
  ["defaultOpen", "boolean", "false", "Uncontrolled starting state."],
  ["onOpenChange", "(open) => void", "—", "Called on every open and close, from any cause."],
];
const contextMenuProps: PropRow[] = [
  ["children", "ReactNode", "—", "The region that opens the menu when right-clicked."],
  ["items", "ContextMenuItem[]", "—", "The same item kinds as DropdownMenu: actions, links, checkboxes, radios, separators, sections."],
  ["size", "sm | md", "md", "32 / 40px items; both grow to 44px on touch screens."],
  ["menuLabel", "string", "Context menu", "Names the menu for assistive tech."],
  ["disabled", "boolean", "false", "Leaves the browser's own context menu in place."],
  ...openStateRows,
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];

export default function ContextMenuDoc() {
  return (
    <>
    <section className="component-doc" id="context-menu">
      <h1>Context Menu</h1>
      <p className="dek">DropdownMenu's menu, opened by right-click at the pointer or by Shift+F10 from anything focused inside the region. macOS has no keyboard equivalent, so every action must also be reachable another way.</p>

      <Demo box="example" style={{ display: "block" }}>
        <ContextMenu items={contextItems}>
          <div className="demo-cell" style={{ height: 160, display: "grid", placeItems: "center", border: "1px dashed var(--color-border-strong)", borderRadius: "var(--radius-card)" }}>
            Right-click anywhere here
          </div>
        </ContextMenu>
      </Demo>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={contextMenuProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Mirror actions that also live in a visible menu or toolbar.", "Keep the order and wording of the matching DropdownMenu."]}
          donts={["Hide an action only here — people rarely look for it.", "Replace the browser's menu on text people will want to copy."]}
        />
      </div>
      <A11y items={[
          ["Shift + F10 / Menu key", "Opens it from the keyboard; right-click opens it at the pointer."],
          ["Arrow keys", "Move between items; Enter selects, Escape closes."],
          ["Discoverability", "Never the only way to reach an action; offer it in a visible menu too."],
        ]} />
    </section>

    <CommandPaletteDoc />

    </>
  );
}
