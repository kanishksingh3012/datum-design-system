import { useState } from "react";
import { Button, ButtonGroup } from "@datum-design/react";
import { AlignCenter, AlignLeft, AlignRight, Plus } from "lucide-react";
import { A11y, Demo } from "./kit";

const ranges = ["Day", "Week", "Month"];
const aligns = [["Left", AlignLeft], ["Center", AlignCenter], ["Right", AlignRight]] as const;
const sections = ["Overview", "Activity", "Settings"];

export default function ButtonGroupDoc() {
  const [pressed, setPressed] = useState(false);
  const [range, setRange] = useState("Week");
  const [align, setAlign] = useState("Left");
  const [section, setSection] = useState("Overview");
  return (
    <>
    <section className="component-doc" id="button-group">
      <h1>Button Group</h1>
      <p className="dek">Related actions as one unit. Spaced by default. <span className="prop-values">attached</span> joins them into one track, where the pressed segment is a raised thumb: a view switcher. Either way the group hugs its content, and vertical groups are as wide as their widest button.</p>

      <Demo box="example">
        <ButtonGroup attached aria-label="Range">
          {ranges.map((r) => (
            <Button key={r} pressed={range === r} onPressedChange={() => setRange(r)}>{r}</Button>
          ))}
        </ButtonGroup>
      </Demo>

      <div className="doc-section">
        <h2>Attached</h2>
        <p className="lead">One track, no lines between segments. Give each Button <b>pressed</b>; the pressed one becomes the thumb. Works with text or icon-only segments, in every size.</p>
        <Demo>
          <ButtonGroup attached size="sm" aria-label="Range, small">
            {ranges.map((r) => (
              <Button key={r} pressed={range === r} onPressedChange={() => setRange(r)}>{r}</Button>
            ))}
          </ButtonGroup>
          <ButtonGroup attached aria-label="Alignment">
            {aligns.map(([name, Icon]) => (
              <Button key={name} iconOnly label={name} pressed={align === name} onPressedChange={() => setAlign(name)}><Icon /></Button>
            ))}
          </ButtonGroup>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Vertical</h2>
        <p className="lead">A tall track uses the 20px card radius, since a tall box is never a pill. Its segments use 20px minus the 4px inset, so the thumb's corners run parallel to the track's. Items share the widest item's width.</p>
        <Demo>
          <ButtonGroup attached orientation="vertical" aria-label="Section">
            {sections.map((x) => (
              <Button key={x} pressed={section === x} onPressedChange={() => setSection(x)}>{x}</Button>
            ))}
          </ButtonGroup>
          <ButtonGroup orientation="vertical" intent="neutral" appearance="outline" aria-label="Export">
            <Button>Export CSV</Button>
            <Button>Export PDF</Button>
            <Button>Share link</Button>
          </ButtonGroup>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Spaced, with shared props</h2>
        <p className="lead"><b>size</b>, <b>intent</b> and <b>appearance</b> set on the group reach every Button inside it; a Button's own prop wins.</p>
        <Demo>
          <ButtonGroup intent="neutral" appearance="ghost" aria-label="Dialog actions">
            <Button>Cancel</Button>
            <Button intent="accent" appearance="solid">Save</Button>
          </ButtonGroup>
          <ButtonGroup size="sm" intent="neutral" appearance="outline" aria-label="Edit">
            <Button prefix={<Plus />}>Add</Button>
            <Button>Duplicate</Button>
            <Button intent="danger">Delete</Button>
          </ButtonGroup>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <ul>
          <li><b>orientation</b><span className="prop-values">horizontal | vertical — default horizontal</span></li>
          <li><b>attached</b><span className="prop-values">boolean — one track with a raised thumb vs spaced buttons</span></li>
          <li><b>size</b> / <b>intent</b> / <b>appearance</b><span className="prop-values">as Button — passed to every child; the child's own prop wins. In an attached group, intent and appearance give way to the track treatment.</span></li>
          <li><b>aria-label</b><span className="prop-values">name the group, e.g. "Date range"</span></li>
        </ul>
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <div className="usage-grid">
          <div>
            <h3>Do</h3>
            <ul>
              <li>Use attached for switching between views of the same content.</li>
              <li>Keep exactly one segment pressed in a view switcher.</li>
              <li>Use spaced groups for a set of separate actions.</li>
            </ul>
          </div>
          <div>
            <h3>Don't</h3>
            <ul>
              <li>Put more than about five segments in one track.</li>
              <li>Mix text and icon-only segments in one track.</li>
            </ul>
          </div>
        </div>
      </div>
      <A11y items={[
          ["Tab", "Each button is its own tab stop."],
          ["Enter / Space", "Activates the focused button; in an attached group the pressed one is announced via aria-pressed."],
          ["Name", "Give the group an aria-label so the set is announced, e.g. \"Range\"."],
        ]} />
    </section>

    </>
  );
}
