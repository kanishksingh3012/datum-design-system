import { Button, ProgressBar, Spinner, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const spinnerProps: PropRow[] = [
  ["size", "sm | md | lg", "md", "16 / 20 / 24px."],
  ["tone", "current | accent", "current", "current inherits the text color; accent is text.accent."],
  ["label", "string", "\"Loading\"", "Screen-reader text in a role=status."],
];

export default function SpinnerDoc() {
  return (
    <>
    <section className="component-doc" id="spinner">
      <h1>Spinner</h1>
      <p className="dek">Indeterminate loading, on its own. The same ring as a loading Button: drawn in the text color, so it reaches 3:1 wherever that text reaches 4.5:1. It is a <span className="prop-values">role=status</span> with a visually hidden label.</p>

      <Demo box="example">
        <Spinner size="lg" tone="accent" />
      </Demo>

      <div className="doc-section">
        <h2>Size and tone</h2>
        <p className="lead"><b>sm</b>, <b>md</b>, <b>lg</b> are 16, 20 and 24px. <b>current</b> inherits the color around it; <b>accent</b> uses <b>text.accent</b>. One turn every <b>motion.slow</b>; four times slower under reduced motion, since it is the only sign that something is happening.</p>
        <Demo>
          {(["sm", "md", "lg"] as const).map((size) => <Spinner key={size} size={size} />)}
          {(["sm", "md", "lg"] as const).map((size) => <Spinner key={size} size={size} tone="accent" />)}
          <Text as="span" variant="body-sm" tone="secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Spinner size="sm" label="Saving" /> Saving…
          </Text>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={spinnerProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Give a specific label: \"Loading invoices\" beats \"Loading\".", "Use Button's loading prop for a button, not a Spinner inside it."]}
          donts={["Use a spinner when you know how far along it is — that's a ProgressBar.", "Show several spinners for one wait; use Skeletons for the layout instead."]}
        />
      </div>
      <A11y items={[
          ["Role", "role=\"status\"; the ring is decorative and label (default \"Loading\") is what gets announced."],
        ]} />
    </section>

    </>
  );
}
