import { useState, type ReactNode } from "react";
import { Checkbox, CheckboxGroup, CheckedState, Field, RadioGroup, Stack, Switch } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const toppingOptions = [["cheese", "Cheese"], ["olives", "Olives"], ["basil", "Basil"]] as const;
const checkboxProps: PropRow[] = [
  ["size", "sm | md", "md", "16 / 20px box; the label steps body-sm / body-md."],
  ["checked / defaultChecked / onCheckedChange", "true | false | \"indeterminate\"", "— / false / —", "A press always lands on true or false."],
  ["label / description", "ReactNode", "—", "The description is a second line in text.secondary, read as the description, not the name."],
  ["invalid / required / disabled", "boolean", "false", "Standalone checkbox states."],
  ["CheckboxGroup", "orientation, size, value / defaultValue / onValueChange (string[]), …Field props", "vertical", "A labelled group; each Checkbox needs a value."],
];

export default function CheckboxDoc() {
  const [toppings, setToppings] = useState<string[]>(["cheese"]);
  const allToppings: CheckedState = toppings.length === toppingOptions.length ? true : toppings.length ? "indeterminate" : false;
  return (
    <>
    <section className="component-doc" id="checkbox">
      <h1>Checkbox</h1>
      <p className="dek">A binary choice, or a mixed one for a parent of partly checked children. A native checkbox under a drawn box with <span className="prop-values">radius.subtle</span> — never round, so it never reads as a radio.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Stack gap="xs" style={{ maxWidth: 320, margin: "0 auto" }}>
          <Checkbox label="All toppings" checked={allToppings} onCheckedChange={(on) => setToppings(on ? toppingOptions.map(([v]) => v) : [])} />
          <CheckboxGroup label="Toppings" value={toppings} onValueChange={setToppings} style={{ paddingInlineStart: 28 }}>
            {toppingOptions.map(([value, label]) => <Checkbox key={value} value={value} label={label} />)}
          </CheckboxGroup>
        </Stack>
      </Demo>

      <div className="doc-section">
        <h2>States</h2>
        <p className="lead">On is the <b>bg.accent</b> fill with a <b>text.onAccent</b> mark and a <b>border.accent</b> edge — the fill alone falls under 3:1 on a surface in orange dark, the edge doesn't. Hover adds a soft halo in the text color; keyboard focus rings the box. <b>"indeterminate"</b> shows a dash and is announced as mixed; pressing it checks it.</p>
        <Demo className="demo-on-page column">
          {(["md", "sm"] as const).map((size) => (
            <div key={size} style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              <Checkbox size={size} label={`Unchecked (${size})`} />
              <Checkbox size={size} label="Checked" defaultChecked />
              <Checkbox size={size} label="Indeterminate" defaultChecked="indeterminate" />
              <Checkbox size={size} label="Invalid" invalid />
              <Checkbox size={size} label="Disabled" disabled defaultChecked />
            </div>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Description and groups</h2>
        <p className="lead"><b>description</b> is a second line, one type step down in <b>text.secondary</b>; it describes the checkbox without becoming part of its name. <b>CheckboxGroup</b> takes the Field props and an array value; <b>errorText</b> marks every box in it.</p>
        <Demo className="demo-on-page" style={{ alignItems: "flex-start", gap: 48 }}>
          <CheckboxGroup label="Email me about" helpText="You can unsubscribe from any email." defaultValue={["mentions"]}>
            <Checkbox value="mentions" label="Mentions" description="When someone @mentions you" />
            <Checkbox value="replies" label="Replies" description="On threads you started" />
            <Checkbox value="digest" label="Weekly digest" />
          </CheckboxGroup>
          <CheckboxGroup label="Agreements" required errorText="Accept the terms to continue." orientation="horizontal">
            <Checkbox value="terms" label="Terms" />
            <Checkbox value="privacy" label="Privacy policy" />
          </CheckboxGroup>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={checkboxProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Use for choices that are applied later, with a Save or Submit.", "Write labels as the positive statement: “Email me”, not “Don't email me”."]}
          donts={["Use a checkbox for a setting that applies at once — that's a Switch.", "Use checkboxes for one choice out of several — that's a RadioGroup."]}
        />
      </div>
      <A11y items={[
          ["Space", "Toggles the focused checkbox."],
          ["Tab", "Moves between checkboxes; a group is a labelled fieldset."],
          ["Indeterminate", "Announced as \"mixed\"."],
        ]} />
    </section>

    </>
  );
}
