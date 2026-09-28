import { useState, type ReactNode } from "react";
import { Button, ButtonGroup, Field, Label, TextField } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const fieldProps: PropRow[] = [
  ["label", "string", "— (required)", "Always visible — never replaced by a placeholder."],
  ["helpText", "string", "—", "Under the control, ui.caption in text.secondary. Replaced by errorText."],
  ["errorText", "string", "—", "Sets aria-invalid and data-invalid, draws border.danger, and describes the control."],
  ["required", "boolean", "false", "A * after the label (hidden from screen readers) and required on the control."],
  ["disabled", "boolean", "false", "Dims the whole field to 0.5 and disables the control."],
  ["readOnly", "boolean", "false", "Focusable and full contrast, but a dashed edge and no fill — never dimmed."],
  ["children", "element | (control) => ReactNode", "—", "Field only: the control. A function receives id and aria props to spread."],
];
const labelProps: PropRow[] = [
  ["required", "boolean", "false", "Adds the * marker."],
  ["as", "label | span", "label", "span names a group or widget through aria-labelledby."],
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];

export default function FieldLabelDoc() {
  const [pressed, setPressed] = useState(false);
  const [period, setPeriod] = useState("Monthly");
  return (
    <>
    <section className="component-doc" id="field">
      <h1>Field + Label</h1>
      <p className="dek">One wrapper that wires a <span className="prop-values">label</span>, help text and error text to any control, so every form field reads and behaves the same. TextField, Textarea and Select are built on it and take the same props; wrap your own control in <span className="prop-values">Field</span> to get them too.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Field label="Billing period" helpText="You can change it at any time." required style={{ maxWidth: 360, margin: "0 auto" }}>
          {(control) => (
            <ButtonGroup attached aria-labelledby={control["aria-labelledby"]} aria-describedby={control["aria-describedby"]} style={{ alignSelf: "flex-start" }}>
              {["Monthly", "Yearly"].map((p) => (
                <Button key={p} pressed={period === p} onPressedChange={() => setPeriod(p)}>{p}</Button>
              ))}
            </ButtonGroup>
          )}
        </Field>
      </Demo>

      <div className="doc-section">
        <h2>Anatomy</h2>
        <p className="lead">The label is <b>ui.label</b> in <b>text.primary</b>, 8px above the control. Help text steps down to <b>ui.caption</b> in <b>text.secondary</b> — hierarchy from the type role, not a third gray. <b>errorText</b> takes the help text's place in <b>text.danger</b> with an icon, so the state never rests on color alone, and the control is marked <b>aria-invalid</b> and described by it. The * of <b>required</b> is hidden from screen readers; the control's own <b>required</b> is what they announce.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            <TextField label="Help text" helpText="Shown under the control." />
            <TextField label="Error text" helpText="Replaced by the error." errorText="Enter a valid email." defaultValue="ada@" />
            <TextField label="Required" required helpText="The * is not read aloud." />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Disabled and read-only</h2>
        <p className="lead"><b>disabled</b> dims the whole field and takes the control out of the tab order. <b>readOnly</b> is for values people need to read or copy but not change: it stays at full contrast and focusable, and swaps the fill and lift for a dashed edge so it never looks disabled.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            <TextField label="Editable" defaultValue="acct_4417" />
            <TextField label="Read-only" readOnly defaultValue="acct_4417" helpText="Select and copy it." />
            <TextField label="Disabled" disabled defaultValue="acct_4417" />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Label on its own</h2>
        <p className="lead">When you lay a form out yourself, <b>Label</b> is the same label: <b>required</b> adds the marker, <b>as="span"</b> names a group through <b>aria-labelledby</b>.</p>
        <Demo className="demo-on-page">
          <Label>Plain label</Label>
          <Label required>Required label</Label>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={fieldProps} />
        <h3>Label</h3>
        <PropsTable rows={labelProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Keep every label visible and short — a noun, not a sentence.", "Say how to fix an error, not just that something is wrong.", "Use readOnly for values people may copy; disabled for ones that don't apply right now."]}
          donts={["Use a placeholder as the label — it disappears as soon as someone types.", "Show help and error text at the same time; the error replaces the help."]}
        />
      </div>
      <A11y items={[
          ["Wiring", "useField links the label, help text and error text to the control with htmlFor, aria-describedby and aria-invalid."],
          ["required", "Sets aria-required and shows a visible marker."],
        ]} />
    </section>

    </>
  );
}
