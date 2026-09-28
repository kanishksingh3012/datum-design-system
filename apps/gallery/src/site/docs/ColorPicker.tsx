import { ColorPicker, Popover, Radio } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const colorPickerProps: PropRow[] = [
  ["label / helpText / errorText", "string", "—", "As every field."],
  ["value / defaultValue / onValueChange", "string", "#000000", "Any CSS color in; a 6-digit hex out."],
  ["swatches", "string[]", "—", "Preset colors under the picker."],
  ["open / defaultOpen / onOpenChange", "boolean", "false", "The panel."],
  ["size", "sm | md | lg", "md", "32 / 40 / 48px trigger."],
  ["placement", "Popover placements", "bottom-start", ""],
  ["disabled / readOnly / required / name", "boolean / string", "—", "As every field; name submits the hex."],
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];

export default function ColorPickerDoc() {
  return (
    <>
    <section className="component-doc" id="color-picker">
      <h1>Color Picker</h1>
      <p className="dek">A field whose trigger shows the color and its hex value. It opens a panel with a saturation × brightness area, a hue slider, a hex field and optional swatches, on React Aria's color hooks. The colors are the user's data, so they are set inline; everything around them is tokens.</p>

      <Demo box="example" style={{ display: "block" }}>
        <ColorPicker label="Brand color" defaultValue="#FC6E20" swatches={["#FC6E20", "#355695", "#007440", "#D52F4A", "#F1C035", "#1B1B1B"]} style={{ margin: "0 auto" }} />
      </Demo>

      <div className="doc-section">
        <h2>Sizes and states</h2>
        <p className="lead">32 / 40 / 48px triggers, like the other fields.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            <ColorPicker label="Size sm" size="sm" defaultValue="#355695" />
            <ColorPicker label="Invalid" defaultValue="#F1C035" errorText="Too light for text on white." />
            <ColorPicker label="Disabled" defaultValue="#007440" disabled />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={colorPickerProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Offer swatches for the colors people use most.", "Say what the color is used for in helpText."]}
          donts={["Use it to pick from a few fixed options — use Radio cards.", "Rely on the color alone to carry meaning."]}
        />
      </div>
      <A11y items={[
          ["Swatch button", "Opens the panel in a Popover; Escape closes it and returns focus."],
          ["Area / sliders", "Arrow keys adjust saturation, brightness and hue."],
          ["Field", "The hex field accepts typed values."],
        ]} />
    </section>

    </>
  );
}
