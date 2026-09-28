import { Field, TextField, Textarea } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const textareaProps: PropRow[] = [
  ["size", "sm | md | lg", "md", "Type size and padding, matching TextField."],
  ["rows", "number", "3", "Visible lines (the starting height with autoResize)."],
  ["autoResize", "boolean", "false", "Grows with its content; no resize handle."],
  ["maxLength", "number", "—", "Caps the length and shows n/max under the field, read with the description."],
  ["value / defaultValue / onValueChange", "string / string / (value) => void", "— / \"\" / —", "Controlled or uncontrolled."],
  ["…Field props", "—", "—", "label, helpText, errorText, required, disabled, readOnly."],
];

export default function TextareaDoc() {
  return (
    <>
    <section className="component-doc" id="textarea">
      <h1>Textarea</h1>
      <p className="dek">Multi-line input. The same box as TextField, but with <span className="prop-values">radius.card</span> — a tall box is never a pill.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Textarea label="Message" placeholder="How can we help?" helpText="Plain text; links are fine." maxLength={280} className="demo-center" />
      </Demo>

      <div className="doc-section">
        <h2>Length and growth</h2>
        <p className="lead"><b>maxLength</b> caps the input and shows a count under the field, in tabular figures so it doesn't jitter; the count is part of the description. <b>autoResize</b> grows the box with its content instead of scrolling — its height isn't animated, so the page below doesn't slide.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            <Textarea label="Bio" maxLength={160} defaultValue="Designer and occasional typesetter." helpText="Shown on your profile." />
            <Textarea label="Notes" autoResize rows={2} placeholder="Keep typing — I grow." />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Sizes and states</h2>
        <p className="lead">sm, md and lg match TextField's type size and padding. Invalid, read-only and disabled look the same as every other field.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            {(["sm", "md", "lg"] as const).map((size) => <Textarea key={size} size={size} label={`Size ${size}`} rows={2} placeholder="Placeholder" />)}
            <Textarea label="Invalid" rows={2} errorText="Tell us a little more." />
            <Textarea label="Read-only" rows={2} readOnly defaultValue="Signed off by legal." />
            <Textarea label="Disabled" rows={2} disabled defaultValue="Locked" />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={textareaProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Set rows to the length of answer you expect.", "Show the count when there's a hard limit."]}
          donts={["Use autoResize in a layout with a fixed height.", "Cut text off silently — use maxLength so the limit is visible."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "A native textarea, labelled and described through Field."],
          ["Enter", "Adds a new line; it never submits the form."],
        ]} />
    </section>

    </>
  );
}
