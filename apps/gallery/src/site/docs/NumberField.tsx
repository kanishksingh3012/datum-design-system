import { InputOTP, NumberField, TextField } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const numberFieldProps: PropRow[] = [
  ["label / helpText / errorText", "string", "—", "As every field: wired by useField."],
  ["value / defaultValue / onValueChange", "number / number / (value) => void", "NaN (empty)", "Committed on blur, Enter, a step or a stepper press. NaN means empty."],
  ["min / max / step", "number", "— / — / 1", "Typed values are clamped and snapped on commit."],
  ["formatOptions", "Intl.NumberFormatOptions", "—", "Currency, percent, units, decimals — shown and parsed."],
  ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."],
  ["hideSteppers", "boolean", "false", "Drops − and +; arrow keys still step."],
  ["required / disabled / readOnly", "boolean", "false", "Read-only hides the steppers and draws a dashed edge."],
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];

export default function NumberFieldDoc() {
  return (
    <>
    <section className="component-doc" id="number-field">
      <h1>Number Field</h1>
      <p className="dek">A number with − and + steppers nested in the pill's ends, on React Aria's <span className="prop-values">useNumberField</span>. Typing is limited to what the format allows; the value is clamped and snapped on commit; arrow keys, Page Up / Down, Home and End step it.</p>

      <Demo box="example" style={{ display: "block" }}>
        <NumberField label="Guests" defaultValue={2} min={1} max={12} helpText="Up to 12." style={{ maxWidth: 220, margin: "0 auto" }} />
      </Demo>

      <div className="doc-section">
        <h2>Formats</h2>
        <p className="lead"><b>formatOptions</b> shows and parses currency, percent and units. The value is tabular, so it doesn't shift as it steps.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            <NumberField label="Price" defaultValue={24} step={0.5} formatOptions={{ style: "currency", currency: "USD" }} />
            <NumberField label="Discount" defaultValue={0.15} step={0.05} min={0} max={1} formatOptions={{ style: "percent" }} />
            <NumberField label="Width" defaultValue={120} hideSteppers formatOptions={{ style: "unit", unit: "centimeter" }} />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Sizes and states</h2>
        <p className="lead">The same 32 / 40 / 48px as TextField. A stepper dims at <b>min</b> or <b>max</b>; <b>readOnly</b> hides them.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            {(["sm", "md", "lg"] as const).map((size) => <NumberField key={size} size={size} label={`Size ${size}`} defaultValue={1} min={1} />)}
            <NumberField label="Invalid" defaultValue={40} errorText="We only have 12 in stock." />
            <NumberField label="Read-only" defaultValue={8} readOnly />
            <NumberField label="Disabled" defaultValue={3} disabled />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={numberFieldProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use for counts and amounts people adjust by small steps.", "Set min and max so the steppers stop where the value must."]}
          donts={["Use for numbers that aren't quantities — phone numbers, card numbers, codes. Use a TextField (or InputOTP).", "Hide the steppers on a quantity people usually nudge by one."]}
        />
      </div>
      <A11y items={[
          ["\u2191 / \u2193", "Step the value; Page Up / Page Down step further, Home / End go to min / max."],
          ["Steppers", "The + / \u2212 buttons are outside the tab order; the input is the tab stop."],
        ]} />
    </section>

    </>
  );
}
