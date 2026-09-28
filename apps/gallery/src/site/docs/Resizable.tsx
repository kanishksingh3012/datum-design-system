import { Resizable, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const resizableProps: PropRow[] = [
  ["first / second", "ReactNode", "—", "The two panels."],
  ["orientation", "horizontal | vertical", "horizontal", "Side by side, or stacked."],
  ["value / defaultValue / onValueChange", "number", "50", "The first panel's share, 0–100."],
  ["onValueCommit", "(value) => void", "—", "Once a drag or key press ends — for saving the layout."],
  ["min / max / step", "number", "10 / 90 / 1", "Limits on the first panel, and one arrow key's move."],
  ["minPanelSize", "number (px)", "64", "Neither panel shrinks below this, whatever min and max say."],
  ["handleLabel", "string", "Resize panels", "Names the handle."],
  ["disabled", "boolean", "false", ""],
];

export default function ResizableDoc() {
  return (
    <>
    <section className="component-doc" id="resizable">
      <h1>Resizable</h1>
      <p className="dek">Two panels with a handle between them. The handle is a slider thumb on React Aria's <span className='prop-values'>useSlider</span>: drag it, or focus it and use the arrow keys, Home and End. The line is 1px; its grab area is 44px.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Resizable
          first={<div style={{ padding: "var(--space-default)" }}><Text>Files</Text></div>}
          second={<div style={{ padding: "var(--space-default)" }}><Text>Editor</Text></div>}
          defaultValue={30}
          style={{ height: 200, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-card)" }}
        />
      </Demo>

      <div className="doc-section">
        <h2>Vertical</h2>
        <p className="lead"><b>vertical</b> stacks the panels; ArrowDown grows the top one.</p>
        <Demo className="demo-on-page">
          <Resizable
            orientation="vertical"
            first={<div style={{ padding: "var(--space-default)" }}><Text>Preview</Text></div>}
            second={<div style={{ padding: "var(--space-default)" }}><Text>Console</Text></div>}
            style={{ height: 240, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-card)" }}
          />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={resizableProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Set min and max so neither panel can vanish.", "Save the layout from onValueCommit."]}
          donts={["Use it where a fixed layout would do.", "Put a resizable inside a resizable that moves the same way."]}
        />
      </div>
      <A11y items={[
          ["Tab", "Focuses the handle, a native range input."],
          ["Arrow keys", "Resize by step; Home / End jump to min / max."],
          ["Pointer", "The handle has a 44px grab area."],
        ]} />
    </section>
    </>
  );
}
