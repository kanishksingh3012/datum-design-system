import { useState, type ReactNode } from "react";
import { Button, CommandPalette, CommandPaletteItem } from "@datum-design/react";
import { FolderOpen, Inbox, Plus, Search, Settings, Trash2 } from "lucide-react";
import { today } from "@internationalized/date";
import { A11y, Demo, Usage } from "./kit";

const commands: CommandPaletteItem[] = [
  { id: "new", label: "New project", group: "Projects", icon: <Plus />, shortcut: "⌘N" },
  { id: "open", label: "Open recent", group: "Projects", icon: <FolderOpen />, description: "Datum gallery · edited today" },
  { id: "delete", label: "Delete project", group: "Projects", icon: <Trash2 />, disabled: true },
  { id: "inbox", label: "Go to inbox", group: "Navigate", icon: <Inbox />, shortcut: "G I", keywords: ["mail", "messages"] },
  { id: "settings", label: "Settings", group: "Navigate", icon: <Settings />, shortcut: "⌘,", keywords: ["preferences"] },
];
type Row = [string, string, string, string];
const openRow: Row = ["open / defaultOpen / onOpenChange", "boolean", "— / false / —", "Whether the list or calendar is open."];
const paletteProps: Row[] = [
  ["items", "{ id, label, description?, icon?, shortcut?, group?, keywords?, disabled?, onSelect? }[]", "—", "keywords match the search too; shortcut is display only."],
  ["onAction", "(id) => void", "—", "Called with the chosen item's id; the palette then closes."],
  openRow,
  ["search / defaultSearch / onSearchChange", "string", "— / \"\" / —", "The search text; it clears when the palette closes."],
  ["hotkey", "boolean", "true", "⌘K / Ctrl+K anywhere toggles it."],
  ["trigger", "ReactElement", "—", "Optional element that opens it."],
  ["label / placeholder / emptyState", "string / string / ReactNode", "\"Command palette\" / \"Search commands\" / \"No results\"", ""],
];
function Props({ rows }: { rows: Row[] }) {
  return (
    <table className="props-table">
      <thead><tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr></thead>
      <tbody>{rows.map(([p, t, d, n]) => <tr key={p}><th scope="row"><code>{p}</code></th><td><code>{t}</code></td><td><code>{d}</code></td><td>{n}</td></tr>)}</tbody>
    </table>
  );
}

export default function CommandPaletteDoc() {
  const [last, setLast] = useState<string>();
  return (
    <>
    <section className="component-doc" id="command-palette">
      <h1>Command Palette</h1>
      <p className="dek">A search dialog for jumping to commands, opened with ⌘K / Ctrl+K from anywhere on the page. It is a Dialog around a combobox-style listbox (<span className="prop-values">useListBox</span> with virtual focus): the search keeps focus while arrows move through the list, Enter runs the highlighted command, Escape closes. It sits near the top of the screen, and goes nearly full width on a phone.</p>
      <Demo box="example">
        <CommandPalette items={commands} onAction={setLast} hotkey={false} trigger={<Button intent="neutral" appearance="outline"><Search /> Search commands</Button>} />
        {last && <span className="prop-values">Ran: {last}</span>}
      </Demo>
      <div className="doc-section"><h2>Properties</h2><Props rows={paletteProps} /></div>
      <div className="doc-section"><h2>Usage guidelines</h2>
        <Usage dos={["Mirror commands that also live somewhere visible.", "Add keywords for the words people will actually type."]} donts={["Make the palette the only way to reach a feature.", "Mount more than one palette with the hotkey on a page."]} />
      </div>
      <A11y items={[
          ["Opening", "Wire a shortcut (e.g. \u2318K) to open it; it's a modal dialog with focus trapped inside."],
          ["Typing", "Filters results; \u2191 / \u2193 move a virtual focus through the list while focus stays in the search field."],
          ["Enter / Escape", "Run the highlighted command / close and return focus."],
        ]} />
    </section>
    </>
  );
}
