import { Accordion, AccordionItem, Stack, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const faq = [
  ["refund", "Can I get a refund?", "Yes, within 30 days of purchase, no questions asked."],
  ["seats", "How do seats work?", "Each person who signs in uses one seat. Remove someone and their seat frees up the same day."],
  ["cancel", "What happens when I cancel?", "Your workspace stays readable for 90 days, so you can export everything."],
] as const;
const accordionProps: PropRow[] = [
  ["type", "single | multiple", "single", "One item open at a time, or any number."],
  ["appearance", "plain | bordered | separated", "bordered", "No lines / one box / a card per item."],
  ["collapsible", "boolean", "true", "With single: allow closing the open item."],
  ["value / defaultValue / onValueChange", "string | string[]", "—", "Open items by their AccordionItem value."],
  ["disabled", "boolean", "false", "On Accordion or on one AccordionItem."],
  ["headingLevel", "2–6", "3", "The heading that wraps each trigger."],
  ["AccordionItem", "title, value, disabled", "—", "title is the trigger label."],
];

export default function AccordionDoc() {
  return (
    <>
    <section className="component-doc" id="accordion">
      <h1>Accordion</h1>
      <p className="dek">Collapsible sections for FAQs and details. Behaviour comes from React Aria: each trigger is a button inside a heading, linked to its panel, and closed panels are still found by the browser's find-in-page.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Accordion defaultValue="refund" style={{ maxWidth: 560, margin: "0 auto" }}>
          {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
        </Accordion>
      </Demo>

      <div className="doc-section">
        <h2>Appearance</h2>
        <p className="lead"><b>plain</b> is rows with no lines — only the rounded hover fill. <b>bordered</b> is one box with <b>radius.card</b>, only its outer corners rounded. <b>separated</b> is a surface card per item; inside a filled Card the items step up to the raised fill, with a border in light only. Hover tints the trigger toward the text color; the chevron turns in <b>motion.normal</b>. The panel height is not animated, so the page below never slides.</p>
        <Demo className="demo-on-page stack">
          {(["plain", "bordered", "separated"] as const).map((appearance) => (
            <Stack key={appearance} gap="xs" style={{ width: "100%", maxWidth: 560 }}>
              <Text variant="code" tone="secondary">{appearance}</Text>
              <Accordion appearance={appearance}>
                {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
              </Accordion>
            </Stack>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Type and collapsible</h2>
        <p className="lead"><b>single</b> keeps one item open. With <b>collapsible</b> false the open item can't be closed, only replaced — its trigger stays focusable and is marked <b>aria-disabled</b>. <b>multiple</b> lets any number stay open.</p>
        <Demo className="demo-on-page stack">
          <Stack gap="xs" style={{ width: "100%", maxWidth: 560 }}>
            <Text variant="code" tone="secondary">single, collapsible=false</Text>
            <Accordion collapsible={false} defaultValue="refund">
              {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
            </Accordion>
          </Stack>
          <Stack gap="xs" style={{ width: "100%", maxWidth: 560 }}>
            <Text variant="code" tone="secondary">multiple</Text>
            <Accordion type="multiple" appearance="separated" defaultValue={["refund", "seats"]}>
              {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
              <AccordionItem value="sso" title="Is SSO available? (disabled)" disabled>On the Enterprise plan.</AccordionItem>
            </Accordion>
          </Stack>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={accordionProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Set headingLevel so triggers fit the page outline.", "Write titles as the question or topic, so they scan."]}
          donts={["Hide content everyone needs — critical information belongs on the page.", "Nest accordions."]}
        />
      </div>
      <A11y items={[
          ["Tab", "Moves between item headers."],
          ["Enter / Space", "Expands or collapses the focused item; aria-expanded reflects it."],
          ["Headers", "Each trigger sits in a heading, so screen-reader users can jump between items."],
        ]} />
    </section>


    </>
  );
}
