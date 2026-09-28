import { useState } from "react";
import { Badge, Button, Link, Stack, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const badgeIntents = ["accent", "neutral", "danger", "success", "warning", "info"] as const;
const badgeProps: PropRow[] = [
  ["intent", "accent | neutral | danger | success | warning | info", "neutral", "What the color means. neutral + solid is ink."],
  ["appearance", "solid | soft | outline", "soft", "How much fill."],
  ["size", "sm | md", "md", "20 / 24px tall."],
  ["dot", "boolean", "false", "Leading status dot in the text color; decorative."],
];
const intents = ["accent", "neutral", "danger"] as const;

export default function BadgeDoc() {
  const [align, setAlign] = useState("Left");
  return (
    <>
    <section className="component-doc" id="badge">
      <h1>Badge</h1>
      <p className="dek">A short, non-interactive label for a status or a category. Same intent and appearance vocabulary as Button, always a pill.</p>

      <Demo box="example">
        <Badge intent="success" dot>Live</Badge>
        <Badge intent="warning">Beta</Badge>
        <Badge intent="accent" appearance="solid">New</Badge>
        <Badge appearance="outline">v2.4.0</Badge>
      </Demo>

      <div className="doc-section">
        <h2>Intent × appearance</h2>
        <p className="lead"><b>soft</b> is the default: a tint of the intent with its text color. <b>solid</b> is for the one badge that must stand out; neutral solid is ink. <b>outline</b> is the quietest. Every combination passes 4.5:1 in all four theme and mode combinations.</p>
        <Demo className="stack">
          {(["soft", "solid", "outline"] as const).map((appearance) => (
            <Stack key={appearance} direction="horizontal" gap="sm" align="center" wrap>
              <Text variant="code" tone="secondary" className="demo-label">{appearance}</Text>
              {badgeIntents.map((intent) => (
                <Badge key={intent} intent={intent} appearance={appearance}>{intent}</Badge>
              ))}
            </Stack>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Size and dot</h2>
        <p className="lead"><b>md</b> is 24px tall, <b>sm</b> 20px. <b>dot</b> adds a leading dot in the text color; it is decorative, so the words still say the status.</p>
        <Demo>
          <Badge intent="success" dot>Operational</Badge>
          <Badge intent="danger" dot>Outage</Badge>
          <Badge intent="success" dot size="sm">Operational</Badge>
          <Badge intent="danger" dot size="sm">Outage</Badge>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={badgeProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Keep it to one or two words.", "Use the state intents for states and accent for brand highlights like \"New\"."]}
          donts={["Make a badge clickable — use a Button or a Link.", "Rely on color alone: \"Failed\" says what red means."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "Static text, not focusable. Don't rely on color alone: the label carries the meaning."],
          ["dot", "A dot-only badge needs nearby text or an aria-label on its container."],
        ]} />
    </section>

    </>
  );
}
