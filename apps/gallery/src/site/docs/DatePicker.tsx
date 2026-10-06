import { type ReactNode } from "react";
import { DatePicker, Field } from "@datum-design/react";
import { DateValue, getLocalTimeZone, isWeekend, today } from "@internationalized/date";
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

export default function DatePickerDoc() {
  const now = today(getLocalTimeZone());
  const weekends = (d: DateValue) => isWeekend(d, "en-US");
  return (
    <>
    <section className="component-doc" id="date-picker">
      <h1>Date Picker</h1>
      <p className="dek">A date typed segment by segment or picked from a calendar, on React Aria's <span className="prop-values">useDatePicker</span>, <span className="prop-values">useDateField</span> and <span className="prop-values">useCalendar</span>. Values are <span className="prop-values">@internationalized/date</span> objects, passed through as they are. In the calendar, arrows move by day and week, Page Up / Down by month, Enter picks, Escape closes.</p>
      <Demo box="example" style={{ display: "block" }}>
        <DatePicker label="Start date" defaultValue={now} helpText="Weekends are unavailable." isDateUnavailable={weekends} style={{ maxWidth: 320, margin: "0 auto" }} />
      </Demo>
      <Section title="The calendar" lead={<>Day cells are circles (<b>radius.control</b>). Today has accent text and a dot; the chosen day is the accent fill. Unavailable days are struck through, days outside <b>minValue</b> / <b>maxValue</b> are dimmed, and the neighbouring months' days are in <b>text.secondary</b>. Days are 40px, 44px on touch screens; the panel fits a 390px screen.</>}>
        <Demo>
          <DatePicker label="Due" defaultValue={now.add({ days: 2 })} minValue={now} isDateUnavailable={weekends} style={{ width: 260 }} />
        </Demo>
      </Section>
      <Section title="Months and years" lead={<>The caption is a button. Press it for a month grid, press again for a year grid (twelve to a page); picking a year returns to the months, picking a month returns to the days. Previous and next step a month, a year or a page of years to match. Months and years outside <b>minValue</b> / <b>maxValue</b> are disabled.</>}>
        <Demo>
          <DatePicker label="Birthday" defaultValue={now.subtract({ years: 30 })} maxValue={now} helpText="Press the caption to jump years." style={{ width: 260 }} />
        </Demo>
      </Section>
      <Section title="Sizes and states" lead="Read-only keeps the date and disables the calendar button.">
        <Demo className="demo-on-page">
          <div className="form-grid">
            {(["sm", "md", "lg"] as const).map((size) => <DatePicker key={size} size={size} label={`Size ${size}`} />)}
            <DatePicker label="Invalid" defaultValue={now} errorText="Choose a weekday." />
            <DatePicker label="Read-only" defaultValue={now} readOnly />
            <DatePicker label="Disabled" defaultValue={now} disabled />
          </div>
        </Demo>
      </Section>
      <div className="doc-section"><h2>Properties</h2><Props rows={dateProps} /></div>
      <div className="doc-section"><h2>Usage guidelines</h2>
        <Usage dos={["Use for dates near today, where the calendar helps.", "Set minValue / maxValue rather than rejecting a date after the fact."]} donts={["Make people page month by month to a far date — the caption jumps to any month or year.", "Convert values to strings inside the component — keep @internationalized/date values until you store them."]} />
      </div>
      <A11y items={[
          ["Date field", "Each segment (day, month, year) is focusable; \u2191 / \u2193 change it, typing enters it."],
          ["Calendar", "Arrow keys move by day, Page Up / Page Down by month; Enter selects, Escape closes."],
          ["Months and years", "The caption says what it opens. In the grids, arrow keys, Home and End move; Enter picks; Escape returns to the days and keeps the calendar open."],
        ]} />
    </section>

    </>
  );
}
