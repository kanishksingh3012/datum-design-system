import { useState } from "react";
import { Heading, Stack, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const headingSizes = ["display-lg", "display-md", "display-sm", "xl", "lg", "md", "sm"] as const;
const headingProps: PropRow[] = [
  ["level", "1–6", "2", "Semantic tag, h1–h6."],
  ["size", "display-lg | display-md | display-sm | xl | lg | md | sm", "from level", "Type role. Level 1 → xl, 2 → lg, 3 → md, 4–6 → sm."],
  ["tone", "primary | secondary | accent", "primary", ""],
];

export default function HeadingDoc() {
  const [align, setAlign] = useState("Left");
  return (
    <>
    <section className="component-doc" id="heading">
      <h1>Heading</h1>
      <p className="dek">Titles in the display and heading type roles. <span className="prop-values">level</span> is the HTML tag, for the document outline; <span className="prop-values">size</span> is how it looks. Pick them separately.</p>

      <Demo box="example">
        <Stack gap="xs" align="center">
          <Heading level={1} size="display-md">Build faster</Heading>
          <Heading level={2} size="md" tone="secondary">A design system for the web</Heading>
        </Stack>
      </Demo>

      <div className="doc-section">
        <h2>Sizes</h2>
        <p className="lead">Three display sizes for hero statements (one per view) and four heading sizes for page, section, subsection and card titles. Barlow throughout.</p>
        <Demo className="stack">
          {headingSizes.map((size) => (
            <Stack key={size} direction="horizontal" gap="md" align="baseline">
              <Text variant="code" tone="secondary" className="demo-label">{size}</Text>
              <Heading level={3} size={size}>Pricing plans</Heading>
            </Stack>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Level and size</h2>
        <p className="lead">Without <b>size</b>, the level decides: 1 → xl, 2 → lg, 3 → md, 4–6 → sm. Override the size, not the level, when a heading needs to look bigger or smaller — the outline must not skip levels.</p>
        <Demo className="stack">
          <Heading level={1} size="display-sm">level 1, size display-sm</Heading>
          <Heading level={2} size="sm">level 2, size sm</Heading>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Tone</h2>
        <Demo>
          <Heading level={3} size="md">Primary</Heading>
          <Heading level={3} size="md" tone="secondary">Secondary</Heading>
          <Heading level={3} size="md" tone="accent">Accent</Heading>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={headingProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use one level 1 per page.", "Choose the level for the outline and the size for the look."]}
          donts={["Skip levels to get a smaller heading — change size.", "Use a display size more than once per view."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "level sets the real h1\u2013h6; size only changes the look. Keep levels in order and one h1 per page."],
        ]} />
    </section>

    </>
  );
}
