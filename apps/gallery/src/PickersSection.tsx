import { useState, type ReactNode } from "react";
import { getLocalTimeZone, today, isWeekend, type DateValue } from "@internationalized/date";
import { Button, Combobox, CommandPalette, DatePicker, DateRangePicker, TagInput, type ComboboxOption, type CommandPaletteItem, type DateRange } from "@datum-design/react";
import { FolderOpen, Inbox, Plus, Search, Settings, Trash2 } from "lucide-react";

type Row = [string, string, string, string];

function Props({ rows }: { rows: Row[] }) {
  return (
    <table className="props-table">
      <thead><tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr></thead>
      <tbody>{rows.map(([p, t, d, n]) => <tr key={p}><th scope="row"><code>{p}</code></th><td><code>{t}</code></td><td><code>{d}</code></td><td>{n}</td></tr>)}</tbody>
    </table>
  );
}

function Usage({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="usage-grid">
      <div><h3>Do</h3><ul>{dos.map((d) => <li key={d}>{d}</li>)}</ul></div>
      <div><h3>Don't</h3><ul>{donts.map((d) => <li key={d}>{d}</li>)}</ul></div>
    </div>
  );
}

const Demo = ({ children }: { children: ReactNode }) => (
  <div className="sample-box demo-on-page" style={{ alignItems: "flex-start" }}>{children}</div>
);
const Section = ({ title, lead, children }: { title: string; lead: ReactNode; children: ReactNode }) => (
  <div className="doc-section">
    <h2>{title}</h2>
    <p className="lead">{lead}</p>
    {children}
  </div>
);
const fieldRow: Row = ["…Field props", "—", "—", "label, helpText, errorText, required, disabled, readOnly."];
const sizeRow: Row = ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."];
const openRow: Row = ["open / defaultOpen / onOpenChange", "boolean", "— / false / —", "Whether the list or calendar is open."];

const cities: ComboboxOption[] = [
  { value: "nyc", label: "New York", group: "Americas" },
  { value: "tor", label: "Toronto", group: "Americas", description: "Eastern time" },
  { value: "mex", label: "Mexico City", group: "Americas" },
  { value: "par", label: "Paris", group: "Europe" },
  { value: "ber", label: "Berlin", group: "Europe" },
  { value: "lis", label: "Lisbon", group: "Europe", disabled: true },
  { value: "tyo", label: "Tokyo", group: "Asia" },
];
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
const tagProps: Row[] = [
  sizeRow,
  ["value / defaultValue / onValueChange", "string[]", "— / [] / —", "Trimmed; duplicates (any case) are ignored."],
  ["maxTags", "number", "—", "At the limit the input stops taking tags; a counter shows."],
  ["placeholder / name", "string", "—", "Each tag is submitted as a hidden input under name."],
  fieldRow,
];
const paletteProps: Row[] = [
  ["items", "{ id, label, description?, icon?, shortcut?, group?, keywords?, disabled?, onSelect? }[]", "—", "keywords match the search too; shortcut is display only."],
  ["onAction", "(id) => void", "—", "Called with the chosen item's id; the palette then closes."],
  openRow,
  ["search / defaultSearch / onSearchChange", "string", "— / \"\" / —", "The search text; it clears when the palette closes."],
  ["hotkey", "boolean", "true", "⌘K / Ctrl+K anywhere toggles it."],
  ["trigger", "ReactElement", "—", "Optional element that opens it."],
  ["label / placeholder / emptyState", "string / string / ReactNode", "\"Command palette\" / \"Search commands\" / \"No results\"", ""],
];
const dateProps: Row[] = [
  sizeRow,
  ["value / defaultValue / onValueChange", "DateValue | null", "— / null / —", "An @internationalized/date value, e.g. parseDate(\"2026-09-28\")."],
  openRow,
  ["minValue / maxValue", "DateValue", "—", "Days outside are dimmed and can't be chosen."],
  ["isDateUnavailable", "(date) => boolean", "—", "Struck through; focusable but not selectable."],
  ["name", "string", "—", "Submitted as an ISO date."],
  fieldRow,
];
const rangeProps: Row[] = [
  ...dateProps.slice(0, 1),
  ["value / defaultValue / onValueChange", "{ start, end } | null", "— / null / —", "Two @internationalized/date values."],
  ...dateProps.slice(2, 5),
  ["startName / endName", "string", "—", "Form field names for the two dates."],
  fieldRow,
];

const commands: CommandPaletteItem[] = [
  { id: "new", label: "New project", group: "Projects", icon: <Plus />, shortcut: "⌘N" },
  { id: "open", label: "Open recent", group: "Projects", icon: <FolderOpen />, description: "Datum gallery · edited today" },
  { id: "delete", label: "Delete project", group: "Projects", icon: <Trash2 />, disabled: true },
  { id: "inbox", label: "Go to inbox", group: "Navigate", icon: <Inbox />, shortcut: "G I", keywords: ["mail", "messages"] },
  { id: "settings", label: "Settings", group: "Navigate", icon: <Settings />, shortcut: "⌘,", keywords: ["preferences"] },
];

/** Combobox, TagInput, DatePicker and DateRangePicker — rendered in the Forms group. */
export function PickerFormDocs() {
  const [city, setCity] = useState<string | null>("par");
  const [topics, setTopics] = useState(["design", "tokens"]);
  const now = today(getLocalTimeZone());
  const [trip, setTrip] = useState<DateRange | null>({ start: now.add({ days: 7 }), end: now.add({ days: 11 }) });
  const weekends = (d: DateValue) => isWeekend(d, "en-US");
  return (
    <>
      {/* ============ COMBOBOX ============ */}
      <section className="component-doc" id="combobox">
        <h1>Combobox</h1>
        <p className="dek">Select's sibling for long lists: the field box takes typing, and the list filters as you go. Built on React Aria's <span className="prop-values">useComboBox</span> + <span className="prop-values">useComboBoxState</span>. Focus stays in the input while arrows move through the list; Enter picks, Escape closes.</p>
        <div className="example-box" style={{ display: "block" }}>
          <Combobox label="City" options={cities} value={city} onValueChange={setCity} helpText={`Value: ${city ?? "none"}`} style={{ maxWidth: 320, margin: "0 auto" }} />
        </div>
        <Section title="Groups, filtering and no results" lead={<>The list is Select's: <b>group</b> headings, dividers, a second line for <b>description</b>, an accent check on the chosen option. When nothing matches, <b>emptyState</b> says so in <b>text.secondary</b>.</>}>
          <Demo>
            <Combobox label="Grouped" options={cities} placeholder="Search cities" style={{ width: 260 }} />
            <Combobox label="Type “zz”" options={cities} defaultInputValue="zz" style={{ width: 260 }} />
          </Demo>
        </Section>
        <Section title="Sizes and states" lead="The same 32 / 40 / 48px as TextField and Select. Read-only keeps the text but never opens.">
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              {(["sm", "md", "lg"] as const).map((size) => <Combobox key={size} size={size} label={`Size ${size}`} options={cities} />)}
              <Combobox label="Invalid" options={cities} errorText="Choose a city." />
              <Combobox label="Read-only" options={cities} defaultValue="tor" readOnly />
              <Combobox label="Disabled" options={cities} defaultValue="nyc" disabled />
            </div>
          </div>
        </Section>
        <div className="doc-section"><h2>Properties</h2><Props rows={comboboxProps} /></div>
        <div className="doc-section"><h2>Usage guidelines</h2>
          <Usage dos={["Use for lists long enough that people would rather type than scroll.", "Match on words people know — labels, not codes."]} donts={["Use for fewer than about seven options — use a Select or RadioGroup.", "Accept free text here — use a TextField."]} />
        </div>
      </section>

      {/* ============ TAG INPUT ============ */}
      <section className="component-doc" id="tag-input">
        <h1>Tag Input</h1>
        <p className="dek">Several short values in one field. Enter or a comma adds the typed text as a tag; Backspace in an empty input removes the last one. The tags are a React Aria tag group (<span className="prop-values">useTagGroup</span>): arrows move between them and Delete removes the focused one.</p>
        <div className="example-box" style={{ display: "block" }}>
          <TagInput label="Topics" value={topics} onValueChange={setTopics} placeholder="Add a topic" helpText="Press Enter or comma to add." style={{ maxWidth: 360, margin: "0 auto" }} />
        </div>
        <Section title="Tags, limits and wrapping" lead={<>Tags are soft neutral Badges with a 44px touch area on their ×. <b>maxTags</b> stops new tags and shows a counter. When tags wrap to a second line the box is no longer a pill, so it takes <b>radius.card</b>.</>}>
          <Demo>
            <TagInput label="Reviewers" defaultValue={["Ada", "Grace", "Alan"]} maxTags={3} style={{ width: 300 }} />
            <TagInput label="Keywords" defaultValue={["accessibility", "design tokens", "typography", "motion"]} style={{ width: 300 }} />
          </Demo>
        </Section>
        <Section title="Sizes and states" lead="Read-only and disabled tags have no remove button.">
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              {(["sm", "md", "lg"] as const).map((size) => <TagInput key={size} size={size} label={`Size ${size}`} defaultValue={["react"]} />)}
              <TagInput label="Invalid" errorText="Add at least one topic." />
              <TagInput label="Read-only" defaultValue={["react", "aria"]} readOnly />
              <TagInput label="Disabled" defaultValue={["react", "aria"]} disabled />
            </div>
          </div>
        </Section>
        <div className="doc-section"><h2>Properties</h2><Props rows={tagProps} /></div>
        <div className="doc-section"><h2>Usage guidelines</h2>
          <Usage dos={["Use for short free-form values: topics, emails, labels.", "Say how to add a tag in helpText."]} donts={["Use for a fixed set of choices — use a CheckboxGroup.", "Put sentences in tags."]} />
        </div>
      </section>

      {/* ============ DATE PICKER ============ */}
      <section className="component-doc" id="date-picker">
        <h1>Date Picker</h1>
        <p className="dek">A date typed segment by segment or picked from a calendar, on React Aria's <span className="prop-values">useDatePicker</span>, <span className="prop-values">useDateField</span> and <span className="prop-values">useCalendar</span>. Values are <span className="prop-values">@internationalized/date</span> objects, passed through as they are. In the calendar, arrows move by day and week, Page Up / Down by month, Enter picks, Escape closes.</p>
        <div className="example-box" style={{ display: "block" }}>
          <DatePicker label="Start date" defaultValue={now} helpText="Weekends are unavailable." isDateUnavailable={weekends} style={{ maxWidth: 320, margin: "0 auto" }} />
        </div>
        <Section title="The calendar" lead={<>Day cells are circles (<b>radius.control</b>). Today has accent text and a dot; the chosen day is the accent fill. Unavailable days are struck through, days outside <b>minValue</b> / <b>maxValue</b> are dimmed, and the neighbouring months' days are in <b>text.secondary</b>. Days are 40px, 44px on touch screens; the panel fits a 390px screen.</>}>
          <Demo>
            <DatePicker label="Due" defaultValue={now.add({ days: 2 })} minValue={now} isDateUnavailable={weekends} style={{ width: 260 }} />
          </Demo>
        </Section>
        <Section title="Sizes and states" lead="Read-only keeps the date and disables the calendar button.">
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              {(["sm", "md", "lg"] as const).map((size) => <DatePicker key={size} size={size} label={`Size ${size}`} />)}
              <DatePicker label="Invalid" defaultValue={now} errorText="Choose a weekday." />
              <DatePicker label="Read-only" defaultValue={now} readOnly />
              <DatePicker label="Disabled" defaultValue={now} disabled />
            </div>
          </div>
        </Section>
        <div className="doc-section"><h2>Properties</h2><Props rows={dateProps} /></div>
        <div className="doc-section"><h2>Usage guidelines</h2>
          <Usage dos={["Use for dates near today, where the calendar helps.", "Set minValue / maxValue rather than rejecting a date after the fact."]} donts={["Use for a birth date — three segments are quicker to type than paging back decades.", "Convert values to strings inside the component — keep @internationalized/date values until you store them."]} />
        </div>
      </section>

      {/* ============ DATE RANGE PICKER ============ */}
      <section className="component-doc" id="date-range-picker">
        <h1>Date Range Picker</h1>
        <p className="dek">A start and end date, on <span className="prop-values">useDateRangePicker</span> and <span className="prop-values">useRangeCalendar</span>. The first press in the calendar sets the start and the second the end; between them the range is a continuous <b>bg.accentSubtle</b> band with accent circles at its ends. From the keyboard, Enter sets the start and moves focus on a day, as React Aria does.</p>
        <div className="example-box" style={{ display: "block" }}>
          <DateRangePicker label="Trip" value={trip} onValueChange={setTrip} helpText="Check-in to check-out." style={{ maxWidth: 360, margin: "0 auto" }} />
        </div>
        <Section title="Sizes and states" lead="The same sizes and states as DatePicker.">
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              {(["sm", "md", "lg"] as const).map((size) => <DateRangePicker key={size} size={size} label={`Size ${size}`} />)}
              <DateRangePicker label="Invalid" errorText="Stays are at most 14 nights." />
              <DateRangePicker label="Read-only" defaultValue={trip} readOnly />
              <DateRangePicker label="Disabled" defaultValue={trip} disabled />
            </div>
          </div>
        </Section>
        <div className="doc-section"><h2>Properties</h2><Props rows={rangeProps} /></div>
        <div className="doc-section"><h2>Usage guidelines</h2>
          <Usage dos={["Use when the two dates depend on each other, like a stay or a report period.", "Mark unavailable days so a range can't cross them."]} donts={["Use two DatePickers for a range — the band shows the span.", "Hide the typed fields; some people are faster typing."]} />
        </div>
      </section>
    </>
  );
}

/** CommandPalette — rendered in the Overlays group. */
export function CommandPaletteDoc() {
  const [last, setLast] = useState<string>();
  return (
    <section className="component-doc" id="command-palette">
      <h1>Command Palette</h1>
      <p className="dek">A search dialog for jumping to commands, opened with ⌘K / Ctrl+K from anywhere on the page. It is a Dialog around a combobox-style listbox (<span className="prop-values">useListBox</span> with virtual focus): the search keeps focus while arrows move through the list, Enter runs the highlighted command, Escape closes. It sits near the top of the screen, and goes nearly full width on a phone.</p>
      <div className="example-box">
        <CommandPalette items={commands} onAction={setLast} hotkey={false} trigger={<Button intent="neutral" appearance="outline"><Search /> Search commands</Button>} />
        {last && <span className="prop-values">Ran: {last}</span>}
      </div>
      <div className="doc-section"><h2>Properties</h2><Props rows={paletteProps} /></div>
      <div className="doc-section"><h2>Usage guidelines</h2>
        <Usage dos={["Mirror commands that also live somewhere visible.", "Add keywords for the words people will actually type."]} donts={["Make the palette the only way to reach a feature.", "Mount more than one palette with the hotkey on a page."]} />
      </div>
    </section>
  );
}
