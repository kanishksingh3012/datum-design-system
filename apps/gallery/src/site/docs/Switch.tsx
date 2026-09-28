import { type ReactNode } from "react";
import { Card, CardBody, Checkbox, Label, Separator, Stack, Switch } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const switchProps: PropRow[] = [
  ["size", "sm | md", "md", "32 × 20 / 40 × 24px track."],
  ["labelPosition", "start | end", "end", "start puts the label first and the switch at the end of the row."],
  ["description", "ReactNode", "—", "A second line under the label."],
  ["checked / defaultChecked / onCheckedChange", "boolean", "— / false / —", "Applies at once — no Save step."],
  ["disabled", "boolean", "false", ""],
];

export default function SwitchDoc() {
  return (
    <>
    <section className="component-doc" id="switch">
      <h1>Switch</h1>
      <p className="dek">An on/off setting that applies at once. A native checkbox with <span className="prop-values">role="switch"</span>; the thumb slides in <span className="prop-values">motion.normal</span> and simply jumps under reduced motion.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Card style={{ maxWidth: 420, margin: "0 auto" }}>
          <CardBody>
            <Stack gap="sm">
              <Switch label="Email notifications" description="A summary of activity each morning." labelPosition="start" defaultChecked style={{ display: "flex" }} />
              <Separator />
              <Switch label="Show my status" labelPosition="start" style={{ display: "flex" }} />
            </Stack>
          </CardBody>
        </Card>
      </Demo>

      <div className="doc-section">
        <h2>States and sizes</h2>
        <p className="lead">A filled track with a white thumb that slides across: ink (<b>bg.inverse</b>) when off, the accent fill when on. Hover steps each to its own hover token. sm is a 32 × 20 track.</p>
        <Demo className="demo-on-page column">
          {(["md", "sm"] as const).map((size) => (
            <div key={size} style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              <Switch size={size} label={`Off (${size})`} />
              <Switch size={size} label="On" defaultChecked />
              <Switch size={size} label="Disabled" disabled />
              <Switch size={size} label="Disabled on" disabled defaultChecked />
            </div>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Label position</h2>
        <p className="lead"><b>end</b> (the default) reads like a checkbox. <b>start</b> puts the label first and pushes the switch to the end of the row — the settings-list layout.</p>
        <Demo className="demo-on-page column">
          <Switch label="Label at the end" defaultChecked />
          <Switch label="Label at the start" labelPosition="start" defaultChecked style={{ display: "flex", width: 320 }} />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={switchProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use for settings that take effect immediately.", "Label the setting, not the state: “Notifications”, not “On”."]}
          donts={["Put a switch in a form that needs a Submit — use a Checkbox.", "Change other parts of the form when it flips, without saying so."]}
        />
      </div>
      <A11y items={[
          ["Space", "Toggles it; announced as a switch, on or off."],
          ["Label", "Always visible; say what turns on, not \"Enable\"."],
        ]} />
    </section>

    </>
  );
}
