import { InputOTP } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const otpProps: PropRow[] = [
  ["label / helpText / errorText", "string", "—", "As every field; the cells form a group named by the label."],
  ["length", "number", "6", "Number of digits."],
  ["value / defaultValue / onValueChange", "string", "\"\"", "The code so far."],
  ["onComplete", "(code) => void", "—", "Once every digit is filled."],
  ["size", "sm | md | lg", "md", "36 / 44 / 52px round cells; never under 44px on touch."],
  ["name", "string", "—", "Submits the code as one value."],
  ["required / disabled / readOnly", "boolean", "false", ""],
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];

export default function InputOTPDoc() {
  return (
    <>
    <section className="component-doc" id="input-otp">
      <h1>Input OTP</h1>
      <p className="dek">A one-time code as a row of round cells. Typing moves forward, Backspace back, arrow keys move freely and a paste fills every cell. The first cell offers <span className="prop-values">autocomplete="one-time-code"</span>, so phones can fill it from a text message. One cell is in the tab order at a time.</p>

      <Demo box="example" style={{ display: "block" }}>
        <InputOTP label="Verification code" helpText="Sent to +1 ••• 4417." style={{ width: "fit-content", margin: "0 auto" }} />
      </Demo>

      <div className="doc-section">
        <h2>Sizes</h2>
        <p className="lead">36 / 44 / 52px cells. A cell is a single-line control, so it takes <b>radius.control</b> — as wide as it is tall, the pill is a circle. Cells are never under 44px on touch screens.</p>
        <Demo className="demo-on-page" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          {(["sm", "md", "lg"] as const).map((size) => <InputOTP key={size} size={size} length={4} label={`Size ${size}`} defaultValue="12" />)}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>States</h2>
        <Demo className="demo-on-page" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <InputOTP label="Invalid" defaultValue="483" errorText="That code has expired." />
          <InputOTP label="Read-only" length={4} defaultValue="7702" readOnly />
          <InputOTP label="Disabled" length={4} disabled />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={otpProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Say where the code was sent in the help text.", "Submit on onComplete, and keep a way to resend."]}
          donts={["Use for passwords or anything longer than a short code.", "Clear the cells on an error — let people fix one digit."]}
        />
      </div>
      <A11y items={[
          ["Tab", "One cell is in the tab order at a time."],
          ["Typing / paste", "Typing advances to the next cell; pasting a full code fills every cell."],
          ["Backspace", "Clears and moves back."],
        ]} />
    </section>


    </>
  );
}
