import { useState } from "react";
import { Alert, Button, Card, CardBody, CardHeader, Heading, Link, Stack, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const alertIntents = ["info", "success", "warning", "danger", "neutral"] as const;
const alertProps: PropRow[] = [
  ["intent", "info | success | warning | danger | neutral", "info", "Picks the icon. danger is role=alert (interrupts); the rest are role=status."],
  ["appearance", "soft | outline | solid", "soft", "Tint / border only / one row in the intent's fill (neutral is ink)."],
  ["fullBleed", "boolean", "false", "Square ends, no side borders — only when it touches both edges of the viewport."],
  ["title / description", "ReactNode", "—", "Title in the label weight, description a step down (body-sm). Both text.primary."],
  ["action", "ReactNode", "—", "A Button or Link. Under the text; at the end of the row in a banner."],
  ["dismissible", "boolean", "false", "Adds a Dismiss button."],
  ["open / defaultOpen / onOpenChange", "boolean / boolean / (open) => void", "— / true / —", "Visibility. Dismiss calls onOpenChange(false); uncontrolled alerts hide themselves."],
];

export default function AlertDoc() {
  const [bannerOpen, setBannerOpen] = useState(true);
  return (
    <>
    <section className="component-doc" id="alert">
      <h1>Alert</h1>
      <p className="dek">An inline message that stays on the page until the problem is solved or someone dismisses it. The icon follows <span className="prop-values">intent</span>; <span className="prop-values">appearance</span> decides how loud it is.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Alert
          intent="warning"
          title="Your trial ends in 3 days"
          description="Add a payment method to keep your projects and history."
          action={<Button size="sm" intent="neutral" appearance="outline">Add payment method</Button>}
          dismissible
          style={{ maxWidth: 560, margin: "0 auto" }}
        />
      </Demo>

      <div className="doc-section">
        <h2>Intent × appearance</h2>
        <p className="lead"><b>soft</b> is the default: a tint of the intent, the icon in its text color, the words in <b>text.primary</b>. <b>outline</b> keeps whatever is behind it and draws the intent's border. Hierarchy comes from the type role, not a lighter gray: the title uses the label weight, the description steps down to <b>body-sm</b>.</p>
        <Demo className="demo-on-page stack">
          {(["soft", "outline"] as const).map((appearance) => (
            <Stack key={appearance} gap="sm" style={{ width: "100%" }}>
              <Text variant="code" tone="secondary">{appearance}</Text>
              {alertIntents.map((intent) => (
                <Alert key={intent} intent={intent} appearance={appearance} title={`${intent[0].toUpperCase()}${intent.slice(1)} message`} description="A sentence of detail under the title." />
              ))}
            </Stack>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Solid banner</h2>
        <p className="lead"><b>solid</b> is the intent's fill with its <b>text.on*</b> color, in one row. Neutral solid is ink. Across the top of a page it is a banner: <b>fullBleed</b> squares its ends, because it touches both edges of the viewport and its corners are the viewport's. Inside it, every focus ring uses the fill's on-color instead of <b>border.focus</b>; use <b>Link tone="inherit"</b> for the action.</p>
        <Demo className="stack">
          {alertIntents.map((intent) => (
            <div key={intent} style={{ borderRadius: "var(--radius-card)", overflow: "hidden", border: "1px solid var(--color-border-subtle)" }}>
              <Alert intent={intent} appearance="solid" fullBleed title={`Scheduled maintenance on Sunday, 02:00–04:00 UTC (${intent})`} action={<Link href="#alert" tone="inherit">Details</Link>} dismissible />
              <div style={{ height: 48, background: "var(--color-bg-page)" }} />
            </div>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Solid, not full bleed</h2>
        <p className="lead">Anywhere that isn't edge to edge — in a card, a column, a dialog — a solid alert keeps <b>radius.card</b>, like everything else in Datum. Only <b>fullBleed</b> takes the corners off.</p>
        <Demo className="demo-on-page">
          <Card style={{ width: "100%", maxWidth: 480 }}>
            <CardHeader><Heading level={3} size="sm">Billing</Heading></CardHeader>
            <CardBody>
              <Stack gap="md">
                <Alert intent="danger" appearance="solid" title="Your last payment failed" action={<Link href="#alert" tone="inherit">Update card</Link>} />
                <Text variant="body-sm" tone="secondary">Pro plan · renews on 1 October</Text>
              </Stack>
            </CardBody>
          </Card>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Dismissing</h2>
        <p className="lead"><b>dismissible</b> adds a Dismiss button. Uncontrolled, the alert hides itself; controlled with <b>open</b>, it calls <b>onOpenChange(false)</b> and waits for you.</p>
        <Demo className="demo-on-page stack">
          {bannerOpen ? (
            <Alert intent="success" title="Profile updated" description="Changes are visible to your team." dismissible open={bannerOpen} onOpenChange={setBannerOpen} />
          ) : (
            <div><Button size="sm" intent="neutral" appearance="outline" onClick={() => setBannerOpen(true)}>Show the alert again</Button></div>
          )}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={alertProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Say what happened and what to do next.", "Keep danger for problems that block the task — it interrupts screen readers.", "Use one solid banner per page, at the top."]}
          donts={["Use an alert for confirmation of an action the person just took — that's a Toast.", "Stack several alerts; merge them into one."]}
        />
      </div>
      <A11y items={[
          ["Role", "danger alerts use role=\"alert\" (announced at once); every other intent uses role=\"status\" (announced politely)."],
          ["Dismiss", "The close button is a real button named \"Dismiss\"; Tab reaches it, Enter / Space closes."],
          ["Color", "The intent icon and title carry the meaning, not color alone."],
        ]} />
    </section>

    </>
  );
}
