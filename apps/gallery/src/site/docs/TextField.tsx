import { useState, type ReactNode } from "react";
import { Button, Field, TextField, Textarea } from "@datum-design/react";
import { Mail, Search } from "lucide-react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const textFieldProps: PropRow[] = [
  ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."],
  ["type", "text | email | password | search | url | tel | number", "text", "The native input type."],
  ["prefix / suffix", "ReactNode", "—", "Icon or text inside the box, in text.secondary."],
  ["clearable", "boolean", "false", "A Clear button while there is a value; focus returns to the input."],
  ["revealable", "boolean", "false", "Show / hide for type=password (aria-pressed)."],
  ["value / defaultValue / onValueChange", "string / string / (value) => void", "— / \"\" / —", "Controlled or uncontrolled; Clear calls onValueChange(\"\")."],
  ["…Field props", "—", "—", "label, helpText, errorText, required, disabled, readOnly."],
];

export default function TextFieldDoc() {
  const [pressed, setPressed] = useState(false);
  return (
    <>
    <section className="component-doc" id="text-field">
      <h1>Text Field</h1>
      <p className="dek">A single-line input. A pill like every other single-line control, on <span className="prop-values">bg.surfaceRaised</span> with a <span className="prop-values">border.strong</span> edge that reaches 3:1 on the page and on surfaces.</p>

      <Demo box="example" style={{ display: "block" }}>
        <TextField label="Work email" type="email" prefix={<Mail />} placeholder="you@company.com" helpText="We'll send the invite here." className="demo-center" />
      </Demo>

      <div className="doc-section">
        <h2>Sizes</h2>
        <p className="lead">32, 40 and 48px, like Button, so a field and its submit button line up. Each grows by 4px on touch screens, and sm keeps a 44px hit area.</p>
        <Demo className="demo-on-page" style={{ alignItems: "flex-end" }}>
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <TextField size={size} label={`Size ${size}`} placeholder="Email address" className="demo-w200" />
              <Button size={size}>Join</Button>
            </div>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Prefix, suffix, clear and reveal</h2>
        <p className="lead"><b>prefix</b> and <b>suffix</b> hold an icon or text inside the box; pressing them puts the caret in the input. <b>clearable</b> shows a Clear button once there is a value. <b>revealable</b> adds Show password (a toggle, <b>aria-pressed</b>). Both are real buttons in the tab order, with a 44px hit area on touch.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            <TextField label="Search" type="search" prefix={<Search />} placeholder="Search products" clearable defaultValue="Wool hats" />
            <TextField label="Price" type="number" prefix="$" suffix="USD" defaultValue="49" />
            <TextField label="Password" type="password" revealable defaultValue="correct horse" />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>States</h2>
        <p className="lead">Hover steps the edge 40% toward the text color. Keyboard focus puts the 2px <b>border.focus</b> ring round the whole box, prefix and all. Invalid uses <b>border.danger</b>.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            <TextField label="Default" placeholder="Placeholder" />
            <TextField label="Filled" defaultValue="Ada Lovelace" />
            <TextField label="Invalid" defaultValue="ada@" errorText="Enter a valid email." />
            <TextField label="Read-only" readOnly defaultValue="Ada Lovelace" />
            <TextField label="Disabled" disabled defaultValue="Ada Lovelace" />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={textFieldProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Pick the type that matches the data, so phones show the right keyboard.", "Size the field to the length of the answer you expect.", "Make search fields clearable."]}
          donts={["Put the label inside as a prefix.", "Use a TextField for more than one line — that's a Textarea."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "A native input with its label, help and error text linked through Field."],
          ["Errors", "errorText sets aria-invalid and is read after the label."],
        ]} />
    </section>

    </>
  );
}
