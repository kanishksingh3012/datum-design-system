import { useState, type ReactNode } from "react";
import { Combobox, ComboboxOption, Field, RadioGroup, Select, TextField } from "@datum-design/react";
import { A11y, Demo, Usage } from "./kit";

const cities: ComboboxOption[] = [
  { value: "nyc", label: "New York", group: "Americas" },
  { value: "tor", label: "Toronto", group: "Americas", description: "Eastern time" },
  { value: "mex", label: "Mexico City", group: "Americas" },
  { value: "par", label: "Paris", group: "Europe" },
  { value: "ber", label: "Berlin", group: "Europe" },
  { value: "lis", label: "Lisbon", group: "Europe", disabled: true },
  { value: "tyo", label: "Tokyo", group: "Asia" },
];
type Row = [string, string, string, string];
const sizeRow: Row = ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."];
const openRow: Row = ["open / defaultOpen / onOpenChange", "boolean", "— / false / —", "Whether the list or calendar is open."];
const fieldRow: Row = ["…Field props", "—", "—", "label, helpText, errorText, required, disabled, readOnly."];
const comboboxProps: Row[] = [
  sizeRow,
  ["options", "{ value, label, description?, disabled?, group? }[]", "—", "Select's option shape; groups get headings and dividers."],
  ["value / defaultValue / onValueChange", "string | null", "— / null / —", "The chosen option's value."],
  ["inputValue / defaultInputValue / onInputChange", "string", "— / label or \"\" / —", "The typed text, which filters the list."],
  openRow,
  ["emptyState", "ReactNode", "\"No results\"", "Shown in the list when nothing matches."],
  ["placeholder / name", "string", "—", "The input's text is submitted under name."],
  fieldRow,
];
const Section = ({ title, lead, children }: { title: string; lead: ReactNode; children: ReactNode }) => (
  <div className="doc-section">
    <h2>{title}</h2>
    <p className="lead">{lead}</p>
    {children}
  </div>
);
function Props({ rows }: { rows: Row[] }) {
  return (
    <table className="props-table">
      <thead><tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr></thead>
      <tbody>{rows.map(([p, t, d, n]) => <tr key={p}><th scope="row"><code>{p}</code></th><td><code>{t}</code></td><td><code>{d}</code></td><td>{n}</td></tr>)}</tbody>
    </table>
  );
}

export default function ComboboxDoc() {
  const [city, setCity] = useState<string | null>("par");
  return (
    <>
    <section className="component-doc" id="combobox">
      <h1>Combobox</h1>
      <p className="dek">Select's sibling for long lists: the field box takes typing, and the list filters as you go. Built on React Aria's <span className="prop-values">useComboBox</span> + <span className="prop-values">useComboBoxState</span>. Focus stays in the input while arrows move through the list; Enter picks, Escape closes.</p>
      <Demo box="example" style={{ display: "block" }}>
        <Combobox label="City" options={cities} value={city} onValueChange={setCity} helpText={`Value: ${city ?? "none"}`} style={{ maxWidth: 320, margin: "0 auto" }} />
      </Demo>
      <Section title="Groups, filtering and no results" lead={<>The list is Select's: <b>group</b> headings, dividers, a second line for <b>description</b>, an accent check on the chosen option. When nothing matches, <b>emptyState</b> says so in <b>text.secondary</b>.</>}>
        <Demo>
          <Combobox label="Grouped" options={cities} placeholder="Search cities" style={{ width: 260 }} />
          <Combobox label="Type “zz”" options={cities} defaultInputValue="zz" style={{ width: 260 }} />
        </Demo>
      </Section>
      <Section title="Sizes and states" lead="The same 32 / 40 / 48px as TextField and Select. Read-only keeps the text but never opens.">
        <Demo className="demo-on-page">
          <div className="form-grid">
            {(["sm", "md", "lg"] as const).map((size) => <Combobox key={size} size={size} label={`Size ${size}`} options={cities} />)}
            <Combobox label="Invalid" options={cities} errorText="Choose a city." />
            <Combobox label="Read-only" options={cities} defaultValue="tor" readOnly />
            <Combobox label="Disabled" options={cities} defaultValue="nyc" disabled />
          </div>
        </Demo>
      </Section>
      <div className="doc-section"><h2>Properties</h2><Props rows={comboboxProps} /></div>
      <div className="doc-section"><h2>Usage guidelines</h2>
        <Usage dos={["Use for lists long enough that people would rather type than scroll.", "Match on words people know — labels, not codes."]} donts={["Use for fewer than about seven options — use a Select or RadioGroup.", "Accept free text here — use a TextField."]} />
      </div>
      <A11y items={[
          ["Typing", "Filters the list."],
          ["\u2193 / \u2191", "Open the list and move through options; Enter picks, Escape closes."],
          ["Announcements", "The number of matching options is announced."],
        ]} />
    </section>

    </>
  );
}
