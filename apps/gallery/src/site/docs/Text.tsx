import { useState } from "react";
import { SelectOption, Stack, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const textVariants = [
  ["body-lg", "Interface text, large"],
  ["body-md", "Interface text, the default"],
  ["body-sm", "Interface text, small"],
  ["paragraph-lg", "Long-form reading, looser line height"],
  ["paragraph-md", "Long-form reading, looser line height"],
  ["label", "Form label"],
  ["caption", "Helper text under a field"],
  ["overline", "Category marker"],
  ["numeric-lg", "$12,480.00"],
  ["numeric-md", "1,024 / 2,048"],
  ["numeric-sm", "08:45:12"],
  ["code", "npm install @datum-design/react"],
] as const;
const textTones = ["primary", "secondary", "accent", "danger", "success", "warning"] as const;
const roles: SelectOption[] = [
  { value: "viewer", label: "Viewer", description: "Can read and comment" },
  { value: "editor", label: "Editor", description: "Can change content" },
  { value: "admin", label: "Admin", description: "Can manage members and billing" },
];
const textProps: PropRow[] = [
  ["variant", "body-lg | body-md | body-sm | paragraph-lg | paragraph-md | label | caption | overline | numeric-lg | numeric-md | numeric-sm | code", "body-md", "One of the type roles. Numeric uses tabular figures; overline is uppercase."],
  ["tone", "primary | secondary | accent | danger | success | warning", "primary", "Two text colors; build hierarchy with the variant, not a third gray."],
  ["weight", "regular | medium | semibold", "from role", "Override only when the role's weight doesn't fit."],
  ["truncate", "boolean | number", "false", "true: one line with an ellipsis. A number: clamp to that many lines."],
  ["as", "p | span | div | label", "p", "htmlFor passes through for label."],
];

export default function TextDoc() {
  const [align, setAlign] = useState("Left");
  return (
    <>
    <section className="component-doc" id="text">
      <h1>Text</h1>
      <p className="dek">Every non-heading text style, picked by purpose rather than size. Resets margins, so space it with Stack.</p>

      <Demo box="example">
        <Stack gap="xs">
          <Text variant="overline" tone="secondary">Monthly revenue</Text>
          <Text variant="numeric-lg">$48,210.00</Text>
          <Text variant="caption" tone="success">+12.4% from last month</Text>
        </Stack>
      </Demo>

      <div className="doc-section">
        <h2>Variants</h2>
        <p className="lead"><b>body</b> for interface text, <b>paragraph</b> for long-form reading (line height 1.7), <b>label</b>, <b>caption</b> and <b>overline</b> for UI text, <b>numeric</b> for figures (IBM Plex Mono, tabular so columns line up) and <b>code</b>.</p>
        <Demo className="stack">
          {textVariants.map(([variant, sample]) => (
            <Stack key={variant} direction="horizontal" gap="md" align="baseline">
              <Text variant="code" tone="secondary" className="demo-label">{variant}</Text>
              <Text variant={variant}>{sample}</Text>
            </Stack>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Tone</h2>
        <p className="lead">Two text colors, <b>primary</b> and <b>secondary</b>, plus accent and the state tones. All pass 4.5:1 on <b>bg.page</b> and <b>bg.surface</b> in every theme and mode. There is no third gray: for less important text, step down the variant (body-sm, caption, overline) instead. State tones say what happened; don't use them for decoration.</p>
        <Demo>
          {textTones.map((tone) => <Text key={tone} as="span" tone={tone}>{tone}</Text>)}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Weight</h2>
        <p className="lead">Each variant brings its own weight. Override with <b>regular</b>, <b>medium</b> or <b>semibold</b> only when needed, e.g. to emphasise a total.</p>
        <Demo>
          <Text as="span" weight="regular">Regular</Text>
          <Text as="span" weight="medium">Medium</Text>
          <Text as="span" weight="semibold">Semibold</Text>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Truncate</h2>
        <p className="lead"><b>true</b> cuts one line with an ellipsis; a number clamps to that many lines. Put the full text in a tooltip or detail view when it matters.</p>
        <Demo style={{ display: "block", maxWidth: 320 }}>
          <Stack gap="sm">
          <Text truncate>Quarterly planning — design system rollout across marketing and product</Text>
          <Text truncate={2} tone="secondary">A description that runs on for a while, clamped to two lines so that cards in a grid stay the same height.</Text>
          </Stack>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={textProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Pick the variant by purpose: figures use numeric, reading uses paragraph.", "Use as=\"span\" inside other text, as=\"label\" with htmlFor for a form label."]}
          donts={["Pick a variant for its size — use the one that matches the job.", "Use tone alone to say something went wrong — say it in words too."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "Renders a span by default; use as=\"p\" for paragraphs and as=\"label\" with htmlFor for form labels."],
          ["Color", "Only two text tones for hierarchy; status tones should pair with words or icons, not stand alone."],
        ]} />
    </section>

    </>
  );
}
