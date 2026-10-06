import { useState, type ReactNode } from "react";
import { CheckboxGroup, Field, TagInput } from "@datum-design/react";
import { A11y, Demo, Usage } from "./kit";

type Row = [string, string, string, string];
const sizeRow: Row = ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."];
const fieldRow: Row = ["…Field props", "—", "—", "label, helpText, errorText, required, disabled, readOnly."];
const tagProps: Row[] = [
  sizeRow,
  ["value / defaultValue / onValueChange", "string[]", "— / [] / —", "Trimmed; duplicates (any case) are ignored."],
  ["maxTags", "number", "—", "At the limit the input stops taking tags; a counter shows."],
  ["placeholder / name", "string", "—", "Each tag is submitted as a hidden input under name."],
  fieldRow,
];
const Section = ({ title, lead, children }: { title: string; lead: ReactNode; children: ReactNode }) => (
  <div className="doc-section">
    <h2>{title}</h2>
    <p className="lead">{lead}</p>
    {children}
  </div>
);
function Props({ rows }: { rows: Row[] }) {
  return (
    <table className="props-table">
      <thead><tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr></thead>
      <tbody>{rows.map(([p, t, d, n]) => <tr key={p}><th scope="row"><code>{p}</code></th><td><code>{t}</code></td><td><code>{d}</code></td><td>{n}</td></tr>)}</tbody>
    </table>
  );
}

export default function TagInputDoc() {
  const [topics, setTopics] = useState(["design", "tokens"]);
  return (
    <>
    <section className="component-doc" id="tag-input">
      <h1>Tag Input</h1>
      <p className="dek">Several short values in one field. Enter or a comma adds the typed text as a tag; Backspace in an empty input removes the last one. The tags are a React Aria tag group (<span className="prop-values">useTagGroup</span>): arrows move between them and Delete removes the focused one.</p>
      <Demo box="example" style={{ display: "block" }}>
        <TagInput label="Topics" value={topics} onValueChange={setTopics} placeholder="Add a topic" helpText="Press Enter or comma to add." style={{ maxWidth: 360, margin: "0 auto" }} />
      </Demo>
      <Section title="Tags, limits and wrapping" lead={<>Tags are chips on the raised fill with a hairline edge, and a 44px touch area on their ×. <b>maxTags</b> stops new tags and shows a counter; the input then stops taking a row of its own. When tags wrap to a second line the box is no longer a pill, so it takes <b>radius.card</b>.</>}>
        <Demo>
          <TagInput label="Reviewers" defaultValue={["Ada", "Grace", "Alan"]} maxTags={3} style={{ width: 300 }} />
          <TagInput label="Keywords" defaultValue={["accessibility", "design tokens", "typography", "motion"]} style={{ width: 300 }} />
        </Demo>
      </Section>
      <Section title="Sizes and states" lead="Read-only and disabled tags have no remove button.">
        <Demo className="demo-on-page">
          <div className="form-grid">
            {(["sm", "md", "lg"] as const).map((size) => <TagInput key={size} size={size} label={`Size ${size}`} defaultValue={["react"]} />)}
            <TagInput label="Invalid" errorText="Add at least one topic." />
            <TagInput label="Read-only" defaultValue={["react", "aria"]} readOnly />
            <TagInput label="Disabled" defaultValue={["react", "aria"]} disabled />
          </div>
        </Demo>
      </Section>
      <div className="doc-section"><h2>Properties</h2><Props rows={tagProps} /></div>
      <div className="doc-section"><h2>Usage guidelines</h2>
        <Usage dos={["Use for short free-form values: topics, emails, labels.", "Say how to add a tag in helpText."]} donts={["Use for a fixed set of choices — use a CheckboxGroup.", "Put sentences in tags."]} />
      </div>
      <A11y items={[
          ["Enter / comma", "Adds the typed tag."],
          ["Backspace", "In an empty input, removes the last tag."],
          ["Arrow keys", "Move between tags; Delete or Backspace removes the focused tag."],
        ]} />
    </section>

    </>
  );
}
