import { ScrollArea, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const scrollAreaProps: PropRow[] = [
  ["orientation", "vertical | horizontal | both", "vertical", "Which way the content scrolls."],
  ["maxHeight", "number | string", "—", "The largest it grows before it scrolls; or size it with style."],
  ["padding", "none | sm | md", "md", "0 / 12 / 16px between the box and the region the content scrolls in, on all four sides."],
  ["fade", "boolean", "true", "Fades content out at an edge while more is hidden past it."],
  ["scrollbarGutter", "boolean", "true", "Keeps room beside the content for an overlay scrollbar. Turn off when content must run edge to edge, as Table does."],
  ["label", "string", "—", "Names it as a region for screen readers."],
];

export default function ScrollAreaDoc() {
  return (
    <>
    <section className="component-doc" id="scroll-area">
      <h1>Scroll Area</h1>
      <p className="dek">A box whose content scrolls inside an inset region: the <b>padding</b> surrounds a viewport on all four sides, and content fades out at any edge it is hidden past. Scrolling is native, with thin <b>border.strong</b> scrollbars; while content is hidden, the region is a tab stop for the arrow keys, and <b>label</b> names it.</p>

      <Demo box="example" style={{ display: "block" }}>
        <ScrollArea label="Release notes" maxHeight={180} style={{ maxWidth: 360, margin: "0 auto", background: "var(--color-bg-surface)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-card)" }}>
          {Array.from({ length: 12 }, (_, i) => <Text key={i}>{`Release 2.${12 - i}: fixes and small improvements.`}</Text>)}
        </ScrollArea>
      </Demo>

      <div className="doc-section">
        <h2>Orientation</h2>
        <p className="lead"><b>vertical</b> (default), <b>horizontal</b> or <b>both</b>.</p>
        <Demo className="demo-on-page">
          <ScrollArea orientation="horizontal" label="Wide line" style={{ maxWidth: 360, background: "var(--color-bg-surface)", border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-card)" }}>
            <Text style={{ whiteSpace: "nowrap" }}>A single line far too long for its box, so the area scrolls sideways instead of wrapping it.</Text>
          </ScrollArea>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={scrollAreaProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Give a scrolling region a label when it holds more than a list.", "Size it with maxHeight or the layout around it."]}
          donts={["Nest scroll areas that scroll the same way.", "Hide the only copy of important content in a small scroll box."]}
        />
      </div>
      <A11y items={[
          ["Tab", "A tab stop only while its content overflows, so keyboard users can scroll it."],
          ["Arrow keys / Page Up / Page Down", "Scroll the focused area."],
          ["label", "Names it as a region for screen readers."],
        ]} />
    </section>

    </>
  );
}
