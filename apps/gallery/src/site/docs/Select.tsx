import { Combobox, Field, RadioGroup, Select, SelectOption } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const countries: SelectOption[] = [
  { value: "us", label: "United States", group: "Americas" },
  { value: "ca", label: "Canada", group: "Americas" },
  { value: "br", label: "Brazil", group: "Americas" },
  { value: "fr", label: "France", group: "Europe" },
  { value: "de", label: "Germany", group: "Europe" },
  { value: "ru", label: "Russia", group: "Europe", disabled: true },
];
const roles: SelectOption[] = [
  { value: "viewer", label: "Viewer", description: "Can read and comment" },
  { value: "editor", label: "Editor", description: "Can change content" },
  { value: "admin", label: "Admin", description: "Can manage members and billing" },
];
const selectProps: PropRow[] = [
  ["size", "sm | md | lg", "md", "32 / 40 / 48px trigger; +4px on touch screens."],
  ["options", "{ value, label, description?, disabled?, group? }[]", "—", "Options sharing a group are listed under its heading, with a divider between groups."],
  ["placeholder", "string", "\"Select…\"", "Shown in text.secondary while nothing is selected."],
  ["value / defaultValue / onValueChange", "string | null", "— / null / —", "The selected option's value."],
  ["open / defaultOpen / onOpenChange", "boolean", "— / false / —", "Whether the list is open."],
  ["name", "string", "—", "Submitted through a hidden native select."],
  ["…Field props", "—", "—", "label, helpText, errorText, required, disabled, readOnly (never opens)."],
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];

export default function SelectDoc() {
  return (
    <>
    <section className="component-doc" id="select">
      <h1>Select</h1>
      <p className="dek">Choose one option from a list. The trigger is the field box as a button; the list is a React Aria listbox on an overlay surface, with arrow keys, Home/End, type-ahead and Escape. A hidden native select submits the value with a form.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Select label="Country" options={countries} helpText="Where your business is registered." style={{ maxWidth: 320, margin: "0 auto" }} />
      </Demo>

      <div className="doc-section">
        <h2>Groups and descriptions</h2>
        <p className="lead">Options that share a <b>group</b> are listed under its heading (<b>ui.overline</b>), with a divider between groups. A <b>description</b> is a second line in <b>text.secondary</b>; two-line options take the card radius instead of a pill. The selected option has an accent check; keyboard focus adds an inset ring.</p>
        <Demo className="demo-on-page" style={{ alignItems: "flex-start" }}>
          <Select label="Country" options={countries} defaultValue="fr" style={{ width: 260 }} />
          <Select label="Role" options={roles} defaultValue="editor" style={{ width: 260 }} />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Sizes and states</h2>
        <p className="lead">The same 32 / 40 / 48px as TextField and Button. <b>readOnly</b> keeps the trigger focusable but never opens it.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            {(["sm", "md", "lg"] as const).map((size) => <Select key={size} size={size} label={`Size ${size}`} options={roles} />)}
            <Select label="Invalid" options={roles} required errorText="Choose a role." />
            <Select label="Read-only" options={roles} readOnly defaultValue="admin" />
            <Select label="Disabled" options={roles} disabled defaultValue="viewer" />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={selectProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use for 7 or more options, or when space is tight.", "Order options in a way people expect — alphabetical, or most used first."]}
          donts={["Use a Select for 2–5 options people should compare — use a RadioGroup.", "Make people scroll a long list to find one item — a searchable list is a Combobox."]}
        />
      </div>
      <A11y items={[
          ["Enter / Space / \u2193", "Opens the listbox."],
          ["Arrow keys", "Move through options; Enter selects, Escape closes."],
          ["Type-ahead", "Typing jumps to matching options."],
        ]} />
    </section>

    </>
  );
}
