import { useState } from "react";
import { Button, Section, Separator, Stack, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const separatorProps: PropRow[] = [
  ["orientation", "horizontal | vertical", "horizontal", "Vertical stretches to its row."],
  ["tone", "subtle | default", "subtle", "border.subtle / border.default."],
  ["label", "string", "—", "Text in the middle, e.g. \"or\"; also the accessible name."],
];

export default function SeparatorDoc() {
  const [section, setSection] = useState("Overview");
  return (
    <>
    <section className="component-doc" id="separator">
      <h1>Separator</h1>
      <p className="dek">A thin line between groups of content. Decorative weight: prefer space, and reach for a line only when space alone doesn't separate.</p>

      <Demo box="example">
        <Stack gap="md" style={{ width: 320 }}>
          <Button intent="neutral" appearance="outline" fullWidth>Continue with Google</Button>
          <Separator label="or" />
          <Button fullWidth>Continue with email</Button>
        </Stack>
      </Demo>

      <div className="doc-section">
        <h2>Tone</h2>
        <p className="lead"><b>subtle</b> (<b>border.subtle</b>) is the default; <b>default</b> (<b>border.default</b>) is for lines that must hold up on a surface. Neither is a control boundary, so neither has a contrast minimum.</p>
        <Demo className="stack">
          <Separator />
          <Separator tone="default" />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Orientation and label</h2>
        <p className="lead"><b>vertical</b> stretches to the height of its row. A <b>label</b> sits in the middle in <b>body-sm</b>, secondary, and becomes the separator's accessible name.</p>
        <Demo>
          <Stack direction="horizontal" gap="md" align="center" style={{ height: 32 }}>
            <Text as="span">Docs</Text>
            <Separator orientation="vertical" />
            <Text as="span">Pricing</Text>
            <Separator orientation="vertical" />
            <Text as="span">Blog</Text>
          </Stack>
          <Separator label="Continue with" style={{ flex: 1 }} />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={separatorProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use it between groups, not between every item.", "Keep labels to a word or two."]}
          donts={["Use it as a page-section border — use Section tones.", "Stack a separator against a card or box edge."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "A plain line is a native hr (vertical sets aria-orientation). With label it becomes role=\"separator\" named by the label."],
        ]} />
    </section>

    </>
  );
}
