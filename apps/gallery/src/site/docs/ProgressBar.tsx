import { useState } from "react";
import { Button, Label, ProgressBar, Stack, Switch } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const progressProps: PropRow[] = [
  ["value", "0–100", "—", "Omit for indeterminate: a sliding segment, no value announced."],
  ["size", "sm | md", "md", "4 / 8px track."],
  ["intent", "accent | success | warning | danger", "accent", "The fill uses the intent's text color, so it reaches 3:1 in every mode."],
  ["label", "string", "—", "Visible above the track; the accessible name. Without it, pass aria-label."],
  ["showValue", "boolean", "false", "Rounded percentage opposite the label (determinate only)."],
];

export default function ProgressBarDoc() {
  const [progress, setProgress] = useState(40);
  return (
    <>
    <section className="component-doc" id="progress-bar">
      <h1>Progress Bar</h1>
      <p className="dek">How far along a task is. Give it a <span className="prop-values">value</span> for determinate progress, or leave it out while the total is unknown.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Stack gap="md" style={{ maxWidth: 420, margin: "0 auto" }}>
          <ProgressBar value={progress} label="Uploading report.pdf" showValue />
          <Stack direction="horizontal" gap="sm">
            <Button size="sm" intent="neutral" appearance="outline" onClick={() => setProgress((p) => Math.max(0, p - 20))}>−20</Button>
            <Button size="sm" intent="neutral" appearance="outline" onClick={() => setProgress((p) => Math.min(100, p + 20))}>+20</Button>
          </Stack>
        </Stack>
      </Demo>

      <div className="doc-section">
        <h2>Intent and size</h2>
        <p className="lead">The fill uses the intent's <b>text</b> color rather than its fill color, so even warning reaches 3:1 against the <b>bg.tertiary</b> track in every mode. <b>md</b> is an 8px track, <b>sm</b> 4px. The fill slides with <b>transform</b> (<b>motion.normal</b>), never width.</p>
        <Demo className="stack">
          {(["accent", "success", "warning", "danger"] as const).map((intent, i) => (
            <ProgressBar key={intent} intent={intent} value={25 + i * 20} label={intent} showValue size={i % 2 ? "sm" : "md"} />
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Indeterminate</h2>
        <p className="lead">Without <b>value</b>, a segment slides across and no value is announced. Under reduced motion it keeps sliding, much slower — like the spinner, it is the only sign of progress.</p>
        <Demo className="stack">
          <ProgressBar label="Preparing your export" />
          <ProgressBar size="sm" aria-label="Loading" />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={progressProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Label what is progressing.", "Switch from indeterminate to a value as soon as you know the total."]}
          donts={["Use it for a score or a quota — it's for progress over time.", "Let the value move backwards."]}
        />
      </div>
      <A11y items={[
          ["Role", "role=\"progressbar\" with aria-valuenow / min / max; indeterminate bars omit the value."],
          ["Name", "Named by its visible label, or aria-label when there isn't one."],
        ]} />
    </section>

    </>
  );
}
