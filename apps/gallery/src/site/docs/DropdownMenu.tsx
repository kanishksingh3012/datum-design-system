import { useState } from "react";
import { Button, DropdownMenu, DropdownMenuItem, Select } from "@datum-design/react";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const sections = ["Overview", "Activity", "Settings"];
const openStateRows: PropRow[] = [
  ["open", "boolean", "—", "Controlled open state. Pair with onOpenChange."],
  ["defaultOpen", "boolean", "false", "Uncontrolled starting state."],
  ["onOpenChange", "(open) => void", "—", "Called on every open and close, from any cause."],
];
const menuProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "Required. The element that opens the menu, usually a Button."],
  ["items", "DropdownMenuItem[]", "—", "Actions, checkbox and radio items, separators and labelled sections."],
  ["placement", "bottom-start | bottom-end | top-start | top-end", "bottom-start", "Flips when there is no room."],
  ["size", "sm | md", "md", "32 / 40px items; both grow to 44px on touch screens."],
  ...openStateRows,
];
const moreIcon = <MoreHorizontal />;
function MenuDemo({ size = "md" as const }: { size?: "sm" | "md" }) {
  const [grid, setGrid] = useState(true);
  const [rulers, setRulers] = useState(false);
  const [sort, setSort] = useState("name");
  const items: DropdownMenuItem[] = [
    { label: "Edit", shortcut: "⌘E" },
    { label: "Duplicate", shortcut: "⌘D" },
    { label: "Archive", disabled: true },
    { type: "separator" },
    { type: "checkbox", label: "Show grid", checked: grid, onCheckedChange: setGrid },
    { type: "checkbox", label: "Show rulers", checked: rulers, onCheckedChange: setRulers },
    {
      type: "section",
      label: "Sort by",
      items: ["name", "date", "size"].map((k) => ({ type: "radio" as const, id: k, label: k[0].toUpperCase() + k.slice(1), checked: sort === k, onSelect: () => setSort(k) })),
    },
    { type: "separator" },
    { label: "Delete", intent: "danger", icon: <Trash2 />, shortcut: "⌫" },
  ];
  return <DropdownMenu size={size} trigger={<Button intent="neutral" appearance="outline" suffix={moreIcon}>{size === "sm" ? "Small" : "Options"}</Button>} items={items} />;
}

export default function DropdownMenuDoc() {
  const [section, setSection] = useState("Overview");
  return (
    <>
    <section className="component-doc" id="dropdown-menu">
      <h1>Dropdown Menu</h1>
      <p className="dek">
        Actions behind a trigger, on React Aria's menu hooks: arrow keys, Home/End, type-ahead, Escape, and focus back to the
        trigger. Checkbox and radio items are <span className="prop-values">menuitemcheckbox</span> and{" "}
        <span className="prop-values">menuitemradio</span>; a checkbox toggles in place, everything else closes the menu.
      </p>

      <Demo box="example">
        <MenuDemo />
      </Demo>

      <div className="doc-section">
        <h2>Sizes</h2>
        <p className="lead">32 and 40px items — pills, like every single-line control — on a <b>radius.card</b> surface. Both grow to 44px on touch screens.</p>
        <Demo>
          <MenuDemo size="sm" />
          <MenuDemo size="md" />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={menuProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Group related items with separators or labelled sections.", "Put destructive actions last, with intent=\"danger\".", "Show shortcuts you have actually bound."]}
          donts={["Use a menu to pick a form value — use a Select.", "Hide the only way to do a common action in a menu."]}
        />
      </div>
      <A11y items={[
          ["Enter / Space / \u2193", "Opens the menu and focuses the first item."],
          ["Arrow keys", "Move between items; Enter selects, Escape closes and returns focus."],
          ["Type-ahead", "Typing jumps to matching items. Checkbox and radio items announce their state."],
        ]} />
    </section>

    </>
  );
}
