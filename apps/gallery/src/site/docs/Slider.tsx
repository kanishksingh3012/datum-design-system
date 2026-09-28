import { useState } from "react";
import { NumberField, Slider } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const sliderProps: PropRow[] = [
  ["label", "string", "—", "Names the slider; or pass aria-label for none."],
  ["value / defaultValue / onValueChange", "number | number[]", "min", "Two numbers make a range with two thumbs."],
  ["onValueCommit", "(value) => void", "—", "Once a drag or key press ends — for heavy work."],
  ["min / max / step", "number", "0 / 100 / 1", ""],
  ["formatOptions", "Intl.NumberFormatOptions", "—", "How the value is shown and announced."],
  ["showValue", "boolean", "true with a label", "The value beside the label."],
  ["size", "sm | md", "md", "4 / 6px rail, 16 / 20px thumb; a 44px hit area on touch."],
  ["disabled", "boolean", "false", ""],
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];

export default function SliderDoc() {
  const [range, setRange] = useState("Week");
  return (
    <>
    <section className="component-doc" id="slider">
      <h1>Slider</h1>
      <p className="dek">Picks a number, or a range, by dragging along a track, on React Aria's <span className="prop-values">useSlider</span> and <span className="prop-values">useSliderThumb</span>. Each thumb is a native range input: arrow keys, Page Up / Down, Home and End work, and the formatted value is announced. The fill is <b>text.accent</b>, like ProgressBar.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Slider label="Volume" defaultValue={60} style={{ maxWidth: 320, margin: "0 auto" }} />
      </Demo>

      <div className="doc-section">
        <h2>Ranges and formats</h2>
        <p className="lead">Two values make a range with two thumbs, named Minimum and Maximum. <b>formatOptions</b> formats the value shown beside the label and the one announced.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            <Slider label="Price range" defaultValue={[20, 80]} formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />
            <Slider label="Opacity" defaultValue={0.4} min={0} max={1} step={0.05} formatOptions={{ style: "percent" }} />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Sizes and states</h2>
        <p className="lead">A 6px (md) or 4px (sm) rail. The thumb is a raised knob drawn like a field; its hit area is 44px on touch screens either way.</p>
        <Demo className="demo-on-page">
          <div className="form-grid">
            <Slider label="Size md" defaultValue={40} />
            <Slider label="Size sm" size="sm" defaultValue={40} />
            <Slider label="Disabled" defaultValue={50} disabled />
          </div>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={sliderProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use where the relative position matters more than the exact number — volume, opacity, a price range.", "Show the value when people need to know it."]}
          donts={["Use for an exact value people will type — use a NumberField.", "Run heavy work on every move — use onValueCommit."]}
        />
      </div>
      <A11y items={[
          ["Arrow keys", "Move by step; Page Up / Page Down by larger steps, Home / End to min / max."],
          ["Semantics", "The thumb is a native range input with its label and value text."],
        ]} />
    </section>

    </>
  );
}
