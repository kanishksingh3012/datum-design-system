import { Field, Radio, RadioGroup, Select, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const radioProps: PropRow[] = [
  ["size", "sm | md", "md", "On RadioGroup (or one Radio)."],
  ["orientation", "vertical | horizontal", "vertical", "On RadioGroup. Arrow keys move the selection either way."],
  ["appearance", "default | card", "default", "card = large selectable tiles (e.g. pricing plans); children add content under the description."],
  ["value / defaultValue / onValueChange", "string", "—", "On RadioGroup."],
  ["…Field props", "—", "—", "On RadioGroup: label, helpText, errorText, required, disabled, readOnly."],
  ["Radio", "value, label, description, disabled", "—", "Must be inside a RadioGroup."],
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];

export default function RadioDoc() {
  return (
    <>
    <section className="component-doc" id="radio">
      <h1>Radio</h1>
      <p className="dek">One choice from a small set. <span className="prop-values">RadioGroup</span> holds the value and the Field props; each <span className="prop-values">Radio</span> is a native radio, so Tab enters and leaves the group and the arrow keys move the selection.</p>

      <Demo box="example" style={{ display: "block" }}>
        <RadioGroup label="Delivery" defaultValue="standard" style={{ maxWidth: 320, margin: "0 auto" }}>
          <Radio value="standard" label="Standard" description="3–5 working days · Free" />
          <Radio value="express" label="Express" description="Next working day · $9" />
          <Radio value="pickup" label="Pick up in store" disabled />
        </RadioGroup>
      </Demo>

      <div className="doc-section">
        <h2>Card</h2>
        <p className="lead"><b>appearance="card"</b> turns each option into a tile for choices that need room, like pricing plans. The tile's edge is <b>border.strong</b> (it's a control, so it reaches 3:1); selected takes the <b>border.accent</b> edge on the <b>bg.accentSubtle</b> tint, and the focus ring goes round the whole tile. Children add content under the description.</p>
        <Demo className="demo-on-page">
          <RadioGroup label="Plan" appearance="card" orientation="horizontal" defaultValue="pro" style={{ width: "100%" }}>
            <Radio value="free" label="Free" description="For personal projects"><Text variant="numeric-md" style={{ marginTop: 8 }}>$0</Text></Radio>
            <Radio value="pro" label="Pro" description="For growing teams"><Text variant="numeric-md" style={{ marginTop: 8 }}>$12</Text></Radio>
            <Radio value="enterprise" label="Enterprise" description="SSO and audit logs"><Text variant="numeric-md" style={{ marginTop: 8 }}>Custom</Text></Radio>
          </RadioGroup>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Orientation, size and states</h2>
        <p className="lead">Horizontal groups wrap. sm steps the circle to 16px and the label to <b>body-sm</b>. <b>errorText</b> marks every circle with <b>border.danger</b>.</p>
        <Demo className="demo-on-page column">
          <RadioGroup label="Size" orientation="horizontal" size="sm" defaultValue="m">
            {["XS", "S", "M", "L", "XL"].map((s) => <Radio key={s} value={s.toLowerCase()} label={s} />)}
          </RadioGroup>
          <RadioGroup label="Contact method" orientation="horizontal" required errorText="Choose how we should reach you.">
            <Radio value="email" label="Email" />
            <Radio value="phone" label="Phone" />
          </RadioGroup>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={radioProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use for 2–6 options that people should see side by side.", "Preselect the safest or most common option when there is one."]}
          donts={["Use a radio group for more than about six options — use a Select.", "Use a single radio on its own; it can't be unchecked."]}
        />
      </div>
      <A11y items={[
          ["Tab", "Enters the group on the selected radio, then leaves it."],
          ["Arrow keys", "Move and select within the group."],
        ]} />
    </section>

    </>
  );
}
