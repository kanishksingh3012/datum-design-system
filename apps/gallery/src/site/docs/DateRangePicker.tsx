import { useState, type ReactNode } from "react";
import { DateRange, DateRangePicker, Field } from "@datum-design/react";
import { DateValue, getLocalTimeZone, today } from "@internationalized/date";
import { A11y, Demo, Usage } from "./kit";

type Row = [string, string, string, string];
const sizeRow: Row = ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."];
const openRow: Row = ["open / defaultOpen / onOpenChange", "boolean", "— / false / —", "Whether the list or calendar is open."];
const fieldRow: Row = ["…Field props", "—", "—", "label, helpText, errorText, required, disabled, readOnly."];
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

export default function DateRangePickerDoc() {
  const now = today(getLocalTimeZone());
  const [trip, setTrip] = useState<DateRange | null>({ start: now.add({ days: 7 }), end: now.add({ days: 11 }) });
  return (
    <>
    <section className="component-doc" id="date-range-picker">
      <h1>Date Range Picker</h1>
      <p className="dek">A start and end date, on <span className="prop-values">useDateRangePicker</span> and <span className="prop-values">useRangeCalendar</span>. The first press in the calendar sets the start and the second the end; between them the range is a continuous <b>bg.accentSubtle</b> band with accent circles at its ends. From the keyboard, Enter sets the start and moves focus on a day, as React Aria does.</p>
      <Demo box="example" style={{ display: "block" }}>
        <DateRangePicker label="Trip" value={trip} onValueChange={setTrip} helpText="Check-in to check-out." style={{ maxWidth: 360, margin: "0 auto" }} />
      </Demo>
      <Section title="Months and years" lead={<>The caption is a button. Press it for a month grid, press again for a year grid (twelve to a page); picking a year returns to the months, picking a month returns to the days. Previous and next step a month, a year or a page of years to match. Months and years outside <b>minValue</b> / <b>maxValue</b> are disabled.</>}>
        <Demo>
          <DateRangePicker label="Report period" minValue={now.subtract({ years: 2 })} maxValue={now} helpText="The last two years." style={{ width: 320 }} />
        </Demo>
      </Section>
      <Section title="Sizes and states" lead="The same sizes and states as DatePicker.">
        <Demo className="demo-on-page">
          <div className="form-grid">
            {(["sm", "md", "lg"] as const).map((size) => <DateRangePicker key={size} size={size} label={`Size ${size}`} />)}
            <DateRangePicker label="Invalid" errorText="Stays are at most 14 nights." />
            <DateRangePicker label="Read-only" defaultValue={trip} readOnly />
            <DateRangePicker label="Disabled" defaultValue={trip} disabled />
          </div>
        </Demo>
      </Section>
      <div className="doc-section"><h2>Properties</h2><Props rows={rangeProps} /></div>
      <div className="doc-section"><h2>Usage guidelines</h2>
        <Usage dos={["Use when the two dates depend on each other, like a stay or a report period.", "Mark unavailable days so a range can't cross them."]} donts={["Use two DatePickers for a range — the band shows the span.", "Hide the typed fields; some people are faster typing."]} />
      </div>
      <A11y items={[
          ["Date fields", "Start and end are separate segmented fields; \u2191 / \u2193 change a segment."],
          ["Calendar", "Enter picks the start, a second Enter the end; arrow keys move between days."],
          ["Months and years", "The caption says what it opens. In the grids, arrow keys, Home and End move; Enter picks; Escape returns to the days and keeps the calendar open."],
        ]} />
    </section>
    </>
  );
}
