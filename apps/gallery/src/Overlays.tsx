import { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  DropdownMenu,
  Sheet,
  Tooltip,
  type DialogSize,
  type DropdownMenuItem,
  type SheetSide,
} from "@datum-design/react";
import { Copy, Download, MoreHorizontal, Pencil, Search, Settings, Share2, Trash2 } from "lucide-react";

type PropRow = [string, string, string, string];

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className="props-table">
      <thead>
        <tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr>
      </thead>
      <tbody>
        {rows.map(([prop, values, def, note]) => (
          <tr key={prop}>
            <th scope="row"><code>{prop}</code></th>
            <td><code>{values}</code></td>
            <td><code>{def}</code></td>
            <td>{note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Usage({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="usage-grid">
      <div>
        <h3>Do</h3>
        <ul>{dos.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
      <div>
        <h3>Don't</h3>
        <ul>{donts.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
    </div>
  );
}

const openState: PropRow[] = [
  ["open / onOpenChange", "boolean / (open) => void", "—", "Controlled open state."],
  ["defaultOpen", "boolean", "false", "Uncontrolled initial state."],
  ["trigger", "ReactElement", "—", "Element that opens it, usually a Button. Optional when you drive open yourself."],
];

const dialogProps: PropRow[] = [
  ["size", "sm | md | lg | full", "md", "400 / 560 / 720px, or the whole viewport."],
  ["role", "dialog | alertdialog", "dialog", "alertdialog for destructive confirmations."],
  ["dismissible", "boolean", "true", "Escape and a click on the scrim close it; DialogHeader shows a close button."],
  ...openState,
  ["children", "ReactNode | (close) => ReactNode", "—", "DialogHeader · DialogBody · DialogFooter."],
  ["DialogHeader", "children, description", "—", "The title names the dialog; description is linked with aria-describedby."],
  ["DialogBody", "div props", "—", "Scrolls on its own when the dialog is taller than the viewport."],
  ["DialogFooter", "div props", "—", "Actions, right-aligned; primary last."],
];

const sheetProps: PropRow[] = [
  ["side", "top | right | bottom | left", "right", "The edge it slides in from."],
  ["size", "sm | md | lg", "md", "320 / 420 / 560px — width for left/right, height for top/bottom."],
  ...openState,
  ["children", "ReactNode | (close) => ReactNode", "—", "The Dialog slots: DialogHeader · DialogBody · DialogFooter."],
];

const menuProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "Usually a Button; gets aria-haspopup and aria-expanded."],
  ["items", "action | checkbox | radio | separator | section", "—", "Plain objects; see the item shapes below."],
  ["placement", "bottom-start | bottom-end | top-start | top-end", "bottom-start", "Flips when there is no room."],
  ["size", "sm | md", "md", "32 / 40px items; 44px on touch screens."],
  ["open / onOpenChange / defaultOpen", "boolean / (open) => void / boolean", "—", "Optional controlled state."],
];

const menuItemProps: PropRow[] = [
  ["action", "{ label, onSelect, icon?, shortcut?, intent?, disabled? }", "—", "type may be omitted. intent: neutral | danger."],
  ["checkbox", "{ type, label, checked, onCheckedChange }", "—", "menuitemcheckbox; the menu stays open."],
  ["radio", "{ type, label, checked, onSelect }", "—", "menuitemradio; consecutive radios (or one section) form a group."],
  ["separator", "{ type }", "—", "A divider line."],
  ["section", "{ type, label?, items }", "—", "A labelled group. One kind of selectable item per section."],
];

const tooltipProps: PropRow[] = [
  ["content", "string", "—", "Plain text only — never interactive."],
  ["children", "ReactElement", "—", "The trigger. Must be focusable, so keyboard users get the hint too."],
  ["placement", "top | right | bottom | left", "top", "Flips when there is no room."],
  ["delay", "ms", "500", "Hover delay. Keyboard focus shows it at once."],
  ["open / onOpenChange / defaultOpen", "boolean / (open) => void / boolean", "—", "Optional controlled state."],
];

export const overlayNav = [
  ["#dialog", "Dialog"],
  ["#sheet", "Sheet"],
  ["#dropdown-menu", "Dropdown Menu"],
  ["#tooltip", "Tooltip"],
] as const;

export function Overlays() {
  const [grid, setGrid] = useState(true);
  const [rulers, setRulers] = useState(false);
  const [sort, setSort] = useState("name");
  const [last, setLast] = useState("—");

  const menuItems: DropdownMenuItem[] = [
    { label: "Edit", icon: <Pencil />, shortcut: "⌘E", onSelect: () => setLast("Edit") },
    { label: "Duplicate", icon: <Copy />, shortcut: "⌘D", onSelect: () => setLast("Duplicate") },
    { label: "Share", icon: <Share2 />, disabled: true },
    { type: "separator" },
    { type: "checkbox", label: "Show grid", checked: grid, onCheckedChange: setGrid },
    { type: "checkbox", label: "Show rulers", checked: rulers, onCheckedChange: setRulers },
    {
      type: "section",
      label: "Sort by",
      items: ["name", "date", "size"].map((key) => ({
        type: "radio" as const,
        id: key,
        label: key[0].toUpperCase() + key.slice(1),
        checked: sort === key,
        onSelect: () => setSort(key),
      })),
    },
    { type: "separator" },
    { label: "Delete", intent: "danger", icon: <Trash2 />, shortcut: "⌫", onSelect: () => setLast("Delete") },
  ];
  const simpleItems: DropdownMenuItem[] = [
    { label: "Download", icon: <Download /> },
    { label: "Settings", icon: <Settings /> },
    { type: "separator" },
    { label: "Delete", intent: "danger", icon: <Trash2 /> },
  ];

  return (
    <>
      {/* ============ DIALOG ============ */}
      <section className="component-doc" id="dialog">
        <h1>Dialog</h1>
        <p className="dek">
          A focused task that blocks the page. Focus moves inside and stays there, the page behind can't scroll and is hidden
          from screen readers, and focus returns to the trigger on close. Compose it from <span className="prop-values">DialogHeader</span>,{" "}
          <span className="prop-values">DialogBody</span> and <span className="prop-values">DialogFooter</span>.
        </p>

        <div className="example-box">
          <Dialog trigger={<Button>Edit profile</Button>}>
            {(close) => (
              <>
                <DialogHeader description="This is how others see you on the site.">Edit profile</DialogHeader>
                <DialogBody>Your name and photo appear on every comment you post. Changes show up within a minute.</DialogBody>
                <DialogFooter>
                  <Button intent="neutral" appearance="outline" onClick={close}>Cancel</Button>
                  <Button onClick={close}>Save changes</Button>
                </DialogFooter>
              </>
            )}
          </Dialog>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">400, 560 and 720px wide, never wider than the viewport minus a 16px margin. <b>full</b> covers the viewport — for editors and long forms on small screens.</p>
          <div className="sample-box">
            {(["sm", "md", "lg", "full"] as DialogSize[]).map((size) => (
              <Dialog key={size} size={size} trigger={<Button intent="neutral" appearance="outline">{size}</Button>}>
                {(close) => (
                  <>
                    <DialogHeader>{`Size ${size}`}</DialogHeader>
                    <DialogBody>The body scrolls on its own if the content is taller than the screen.</DialogBody>
                    <DialogFooter><Button onClick={close}>Done</Button></DialogFooter>
                  </>
                )}
              </Dialog>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Alert dialog</h2>
          <p className="lead">
            <b>role="alertdialog"</b> for destructive confirmations. Screen readers announce it as an alert. Set{" "}
            <b>dismissible={"{false}"}</b> when the user has to choose — Escape, the scrim and the close button then do nothing.
          </p>
          <div className="sample-box">
            <Dialog role="alertdialog" size="sm" dismissible={false} trigger={<Button intent="danger" appearance="soft" prefix={<Trash2 />}>Delete project</Button>}>
              {(close) => (
                <>
                  <DialogHeader description="All 24 files and their history are removed. This can't be undone.">Delete “Website redesign”?</DialogHeader>
                  <DialogFooter>
                    <Button intent="neutral" appearance="outline" onClick={close}>Cancel</Button>
                    <Button intent="danger" onClick={close}>Delete project</Button>
                  </DialogFooter>
                </>
              )}
            </Dialog>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={dialogProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={[
              "Write a title that says what happens (“Delete project?”), not “Are you sure?”.",
              "Name the primary action with a verb that matches the title.",
              "Use alertdialog and dismissible={false} for choices the user must make.",
            ]}
            donts={[
              "Open a dialog from a dialog.",
              "Use a dialog for information that could sit on the page.",
              "Put a long form in sm — use lg or a Sheet.",
            ]}
          />
        </div>
      </section>

      {/* ============ SHEET ============ */}
      <section className="component-doc" id="sheet">
        <h1>Sheet</h1>
        <p className="dek">
          A panel that slides in from an edge — filters, settings, mobile navigation. It is a modal dialog, so it behaves like
          Dialog (focus trap, Escape, scrim click) and uses the same slots. Always leaves a strip of scrim to tap.
        </p>

        <div className="example-box">
          <Sheet trigger={<Button intent="neutral" appearance="outline" prefix={<Settings />}>Filters</Button>}>
            {(close) => (
              <>
                <DialogHeader description="Narrow the list of projects.">Filters</DialogHeader>
                <DialogBody>Status, owner and date range would go here.</DialogBody>
                <DialogFooter>
                  <Button intent="neutral" appearance="ghost" onClick={close}>Reset</Button>
                  <Button onClick={close}>Show 24 results</Button>
                </DialogFooter>
              </>
            )}
          </Sheet>
        </div>

        <div className="doc-section">
          <h2>Side</h2>
          <p className="lead">It slides in from its edge over <b>motion.normal</b> (appears in place under reduced motion) and rounds only the corners facing the page.</p>
          <div className="sample-box">
            {(["left", "right", "top", "bottom"] as SheetSide[]).map((side) => (
              <Sheet key={side} side={side} size="sm" trigger={<Button intent="neutral" appearance="outline">{side}</Button>}>
                <DialogHeader>{`From the ${side}`}</DialogHeader>
                <DialogBody>Press Escape or click the scrim to close.</DialogBody>
              </Sheet>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">320, 420 and 560px — the width from the left or right, the height from the top or bottom.</p>
          <div className="sample-box">
            {(["sm", "md", "lg"] as const).map((size) => (
              <Sheet key={size} size={size} trigger={<Button intent="neutral" appearance="outline">{size}</Button>}>
                <DialogHeader>{`Size ${size}`}</DialogHeader>
                <DialogBody>Content scrolls inside the sheet.</DialogBody>
              </Sheet>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={sheetProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={[
              "Use right for filters and details, left for navigation, bottom for short mobile choices.",
              "Keep the primary action in DialogFooter so it stays in reach.",
            ]}
            donts={[
              "Use a sheet for a short confirmation — use Dialog.",
              "Stack sheets on top of each other.",
            ]}
          />
        </div>
      </section>

      {/* ============ DROPDOWN MENU ============ */}
      <section className="component-doc" id="dropdown-menu">
        <h1>Dropdown Menu</h1>
        <p className="dek">
          Actions behind a trigger. Arrow keys move, Home and End jump, typing a letter finds an item, Escape closes and puts
          focus back on the trigger. Items are plain objects: <span className="prop-values">action</span>,{" "}
          <span className="prop-values">checkbox</span>, <span className="prop-values">radio</span>,{" "}
          <span className="prop-values">separator</span> and <span className="prop-values">section</span>.
        </p>

        <div className="example-box">
          <DropdownMenu trigger={<Button intent="neutral" appearance="outline" suffix={<MoreHorizontal />}>Options</Button>} items={menuItems} />
          <span style={{ color: "var(--color-text-secondary)", marginLeft: 12 }}>Last action: {last} · grid {grid ? "on" : "off"} · sort by {sort}</span>
        </div>

        <div className="doc-section">
          <h2>Items</h2>
          <p className="lead">
            Icons and shortcuts on actions; <b>intent: "danger"</b> for destructive ones. Checkbox items keep the menu open.
            Radios in one section (or in a row) form a group with exactly one checked. Disabled items are skipped by the arrow keys.
          </p>
          <PropsTable rows={menuItemProps} />
        </div>

        <div className="doc-section">
          <h2>Placement</h2>
          <p className="lead">Aligned to the trigger's start or end edge, below or above it. It flips when there's no room.</p>
          <div className="sample-box">
            {(["bottom-start", "bottom-end", "top-start", "top-end"] as const).map((placement) => (
              <DropdownMenu key={placement} placement={placement} items={simpleItems} trigger={<Button intent="neutral" appearance="soft">{placement}</Button>} />
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">Items are 32px (sm) or 40px (md) tall with a mouse; both become 44px on touch screens, since stacked items can't borrow an invisible hit area from their neighbors.</p>
          <div className="sample-box">
            <DropdownMenu size="sm" items={simpleItems} trigger={<Button size="sm" intent="neutral" appearance="outline">Small</Button>} />
            <DropdownMenu items={simpleItems} trigger={<Button intent="neutral" appearance="outline">Medium</Button>} />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={menuProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={[
              "Put the most common action first and destructive ones last, after a separator.",
              "Give an icon-only trigger a label (“More actions”).",
              "Group related choices in a labelled section.",
            ]}
            donts={[
              "Put page navigation in a menu — use Link.",
              "Mix checkboxes and radios in one section.",
              "Hide the only way to do something important behind a menu.",
            ]}
          />
        </div>
      </section>

      {/* ============ TOOLTIP ============ */}
      <section className="component-doc" id="tooltip">
        <h1>Tooltip</h1>
        <p className="dek">
          A short hint on hover (after 500ms) or keyboard focus (at once). Plain text only, linked with aria-describedby, so it adds
          to the trigger's name rather than replacing it. Escape hides it. Ink fill, like the neutral solid button.
        </p>

        <div className="example-box">
          <Tooltip content="Search the docs">
            <Button iconOnly label="Search" intent="neutral" appearance="outline"><Search /></Button>
          </Tooltip>
        </div>

        <div className="doc-section">
          <h2>Placement</h2>
          <p className="lead">Top by default; it flips to the opposite side when there's no room. Long text wraps at 240px.</p>
          <div className="sample-box">
            {(["top", "right", "bottom", "left"] as const).map((placement) => (
              <Tooltip key={placement} content={`Shown on the ${placement}`} placement={placement}>
                <Button intent="neutral" appearance="soft">{placement}</Button>
              </Tooltip>
            ))}
            <Tooltip content="A longer hint wraps onto a second line and the pill becomes a rounded box.">
              <Button intent="neutral" appearance="soft">Long text</Button>
            </Tooltip>
          </div>
        </div>

        <div className="doc-section">
          <h2>Delay</h2>
          <p className="lead">500ms by default, so moving the pointer across a toolbar doesn't flash hints. Once one is open, neighbors show without waiting.</p>
          <div className="sample-box">
            <Tooltip content="No delay" delay={0}><Button intent="neutral" appearance="outline">0ms</Button></Tooltip>
            <Tooltip content="Default delay"><Button intent="neutral" appearance="outline">500ms</Button></Tooltip>
            <Tooltip content="Slow" delay={1500}><Button intent="neutral" appearance="outline">1500ms</Button></Tooltip>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={tooltipProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={[
              "Use it to name icon-only buttons for sighted users (the button still needs label).",
              "Keep it to a few words.",
            ]}
            donts={[
              "Put links, buttons or anything interactive in a tooltip — use a Popover.",
              "Hide information someone needs to finish a task in a tooltip; touch users never see it.",
              "Put a tooltip on a disabled control — it can't be focused.",
            ]}
          />
        </div>
      </section>
    </>
  );
}
