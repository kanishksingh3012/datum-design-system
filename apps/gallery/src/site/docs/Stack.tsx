import { useState } from "react";
import { Button, Grid, Heading, Link, Stack, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const Cell = ({ children }: { children: string }) => <div className="demo-cell">{children}</div>;
const stackProps: PropRow[] = [
  ["direction", "vertical | horizontal", "vertical", ""],
  ["gap", "none | xs | sm | md | lg | xl", "md", "0 / 4 / 8 / 16 / 24 / 32px from the space scale."],
  ["align", "start | center | end | stretch | baseline", "stretch", "Cross axis."],
  ["justify", "start | center | end | between", "start", "Main axis."],
  ["wrap", "boolean", "false", "Lets children wrap onto new lines."],
];

export default function StackDoc() {
  const [align, setAlign] = useState("Left");
  return (
    <>
    <section className="component-doc" id="stack">
      <h1>Stack</h1>
      <p className="dek">A row or column of children with one consistent gap. Replaces margins between siblings, so spacing lives in one place and always comes from the space scale.</p>

      <Demo box="example">
        <Stack gap="sm" align="center">
          <Heading level={3}>Ready to start?</Heading>
          <Text tone="secondary">Set up your workspace in a few minutes.</Text>
          <Stack direction="horizontal" gap="sm">
            <Button>Get started</Button>
            <Button intent="neutral" appearance="outline">Talk to sales</Button>
          </Stack>
        </Stack>
      </Demo>

      <div className="doc-section">
        <h2>Gap</h2>
        <p className="lead"><b>none</b> 0, <b>xs</b> 4, <b>sm</b> 8, <b>md</b> 16 (default), <b>lg</b> 24, <b>xl</b> 32px.</p>
        <Demo className="stack">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((gap) => (
            <Stack key={gap} direction="horizontal" align="center">
              <Text variant="code" tone="secondary" className="demo-label">{gap}</Text>
              <Stack direction="horizontal" gap={gap}>
                <Cell>A</Cell><Cell>B</Cell><Cell>C</Cell>
              </Stack>
            </Stack>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Align and justify</h2>
        <p className="lead"><b>align</b> works across the stack (default <b>stretch</b>; use <b>baseline</b> to line up text of different sizes). <b>justify</b> works along it; <b>between</b> pushes the first and last child to the ends.</p>
        <Demo className="stack">
          <Stack direction="horizontal" justify="between" align="baseline">
            <Heading level={3} size="md">Invoices</Heading>
            <Link href="#stack" underline="hover" size="sm">View all</Link>
          </Stack>
          <Stack direction="horizontal" justify="end" gap="sm">
            <Button intent="neutral" appearance="ghost">Cancel</Button>
            <Button>Save</Button>
          </Stack>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Wrap</h2>
        <p className="lead">With <b>wrap</b>, a horizontal stack flows onto new lines instead of overflowing — for tags and button rows on small screens.</p>
        <Demo style={{ display: "block", maxWidth: 320 }}>
          <Stack direction="horizontal" gap="xs" wrap>
            {["Design", "Tokens", "React", "Accessibility", "Theming", "Docs"].map((t) => <Cell key={t}>{t}</Cell>)}
          </Stack>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={stackProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Space siblings with Stack instead of margins.", "Nest stacks: a vertical page stack of horizontal rows."]}
          donts={["Add margins to children inside a Stack.", "Use Stack for a two-dimensional layout — use Grid."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "A plain div. Visual order follows source order, so reading and tab order match what people see."],
        ]} />
    </section>

    </>
  );
}
