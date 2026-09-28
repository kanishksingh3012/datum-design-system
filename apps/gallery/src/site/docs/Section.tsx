import { useState } from "react";
import { Button, Container, Heading, Section, Stack, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const sectionProps: PropRow[] = [
  ["spacing", "sm | md | lg", "md", "32 / 64 / 96px vertical padding."],
  ["tone", "default | muted | accent", "default", "bg.page / bg.surface / bg.accentSubtle."],
  ["as", "section | div | header | footer", "section", "The landmark element."],
];

export default function SectionDoc() {
  const [section, setSection] = useState("Overview");
  return (
    <>
    <section className="component-doc" id="section">
      <h1>Section</h1>
      <p className="dek">A full-width page band with consistent vertical rhythm. The page is a stack of Sections, each holding a Container.</p>

      <Demo box="example" className="demo-bands">
        <Section tone="accent" spacing="sm">
          <Container size="sm">
            <Stack gap="sm" align="center">
              <Text variant="overline" tone="accent">New</Text>
              <Heading level={2} size="xl">Datum 1.0 is here</Heading>
              <Button>Read the release notes</Button>
            </Stack>
          </Container>
        </Section>
      </Demo>

      <div className="doc-section">
        <h2>Tone</h2>
        <p className="lead"><b>default</b> is <b>bg.page</b>, <b>muted</b> is <b>bg.surface</b>, <b>accent</b> is <b>bg.accentSubtle</b>. Alternate default and muted to separate bands; keep accent for one band per page.</p>
        <Demo className="stack demo-bands">
          {(["default", "muted", "accent"] as const).map((tone) => (
            <Section key={tone} tone={tone} spacing="sm">
              <Container size="full">
                <Stack gap="xs">
                  <Heading level={3} size="md">{`tone="${tone}"`}</Heading>
                  <Text tone="secondary">Text and controls are checked for contrast on every tone.</Text>
                </Stack>
              </Container>
            </Section>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Spacing</h2>
        <p className="lead"><b>sm</b> 32, <b>md</b> 64 (default), <b>lg</b> 96px above and below. Use lg for the hero, md for most bands.</p>
        <Demo className="stack demo-bands">
          {(["sm", "md", "lg"] as const).map((spacing) => (
            <Section key={spacing} tone="muted" spacing={spacing} className="demo-rule">
              <Container size="full"><Text variant="code" tone="secondary">{`spacing="${spacing}"`}</Text></Container>
            </Section>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={sectionProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Give each Section a heading, or an aria-label, so it is a named region.", "Use as=\"header\" / \"footer\" for the page header and footer bands."]}
          donts={["Put content straight into a Section without a Container.", "Stack two accent bands."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "Renders a real section (or the element set by as). Give it a heading so it's announced as a named region."],
        ]} />
    </section>


    </>
  );
}
