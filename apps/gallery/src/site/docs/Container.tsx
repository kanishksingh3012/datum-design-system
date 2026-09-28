import { Container, Section, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const containerProps: PropRow[] = [
  ["size", "sm | md | lg | xl | full", "xl", "Max content width: 640 / 768 / 1024 / 1280px / none."],
  ["padded", "boolean", "true", "Adds the responsive page gutter (grid.margin, 16–64px) outside the max width."],
];

export default function ContainerDoc() {
  return (
    <>
    <section className="component-doc" id="container">
      <h1>Container</h1>
      <p className="dek">Centers content at a readable max width and adds the page gutter. Put one inside every Section; nest a smaller one for text that shouldn't run the full width.</p>

      <Demo box="example" className="demo-frame">
        <Container size="sm" className="demo-outline">
          <Text variant="caption" tone="secondary">size="sm" · 640px + gutter</Text>
        </Container>
      </Demo>

      <div className="doc-section">
        <h2>Sizes</h2>
        <p className="lead"><b>sm</b> 640, <b>md</b> 768, <b>lg</b> 1024, <b>xl</b> 1280 (the default, <b>grid.container</b>) and <b>full</b> for no limit, shown here at half scale in a 1400px page (it scrolls sideways on a narrow screen). The width is the content width; the gutter sits outside it.</p>
        <Demo className="demo-frame demo-scroll">
          <div className="demo-zoom">
            {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
              <Container key={size} size={size} padded={false} className="demo-outline">
                <Text variant="body-lg" tone="secondary">{`size="${size}"`}</Text>
              </Container>
            ))}
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Gutter</h2>
        <p className="lead"><b>padded</b> (on by default) adds <b>grid.margin</b> on both sides: 16px on a phone, growing to 64px on a wide screen. Turn it off when the parent already has padding.</p>
        <Demo className="stack demo-frame">
          <Container size="full" className="demo-outline"><Text variant="caption" tone="secondary">padded</Text></Container>
          <Container size="full" padded={false} className="demo-outline"><Text variant="caption" tone="secondary">padded={"{false}"}</Text></Container>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={containerProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use one Container per Section for the page width.", "Use sm or md for long-form reading."]}
          donts={["Nest padded Containers — the gutter doubles.", "Set max-width by hand on page content."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "A plain div with no role; wrap it in a landmark (main, section) when it holds page content."],
        ]} />
    </section>

    </>
  );
}
