import { Navbar, TabItem, Tabs } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const tabItems: TabItem[] = [
  { value: "overview", label: "Overview", content: <p className="lead">Overview: the numbers that matter this week.</p> },
  { value: "activity", label: "Activity", content: <p className="lead">Activity: every change, newest first.</p> },
  { value: "settings", label: "Settings", content: <p className="lead">Settings: names, members and billing.</p> },
  { value: "archive", label: "Archive", disabled: true },
];
const plainTabs = tabItems.map(({ content: _content, ...item }) => item);
const tabsProps: PropRow[] = [
  ["items", "{ value, label, icon, disabled, content }[]", "—", "content becomes the tab panel, wired with aria-controls; leave it out to render the view yourself."],
  ["value / defaultValue / onValueChange", "string / string / (value) => void", "first enabled tab", "The selected tab."],
  ["appearance", "underline | pill | segmented", "underline", "An accent bar on a hairline / an ink pill / a raised thumb on a track."],
  ["size", "sm | md", "md", "32 / 40px; +4px on touch screens."],
  ["orientation", "horizontal | vertical", "horizontal", "Arrow keys follow the orientation."],
  ["fullWidth", "boolean", "false", "Tabs share the width of the row."],
];

export default function TabsDoc() {
  return (
    <>
    <section className="component-doc" id="tabs">
      <h1>Tabs</h1>
      <p className="dek">
        Switch between views in the same place, on React Aria's tab hooks: arrow keys move and select, Home and End jump, disabled
        tabs are skipped. Give an item <span className="prop-values">content</span> and it becomes the tab panel.
      </p>

      <Demo box="example">
        <Tabs items={tabItems} aria-label="Project" style={{ width: "100%" }} />
      </Demo>

      <div className="doc-section">
        <h2>Appearances</h2>
        <p className="lead"><b>underline</b> for page sections, <b>pill</b> (ink when selected, like a pressed Button) for filters, <b>segmented</b> (a raised thumb on a track) for switching a view in place.</p>
        <Demo className="column">
          {(["underline", "pill", "segmented"] as const).map((appearance) => (
            <Tabs key={appearance} items={plainTabs} appearance={appearance} aria-label={appearance} />
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Sizes and width</h2>
        <p className="lead">32 and 40px, growing to 36 and 44px on touch screens. <b>fullWidth</b> shares the row.</p>
        <Demo className="column">
          <Tabs items={plainTabs} appearance="segmented" size="sm" aria-label="Small" />
          <Tabs items={plainTabs.slice(0, 3)} appearance="segmented" fullWidth aria-label="Full width" style={{ width: "100%" }} />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Vertical</h2>
        <p className="lead">The list stands beside the panel; up and down arrows move.</p>
        <Demo>
          <Tabs items={tabItems} orientation="vertical" aria-label="Vertical" />
          <Tabs items={tabItems} appearance="pill" orientation="vertical" aria-label="Vertical pill" />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Nested</h2>
        <p className="lead">Each Tabs draws one selection mark: the accent bar (underline), the ink fill (pill) or the raised thumb (segmented). A Tabs inside another's panel keeps its own appearance.</p>
        <Demo>
          <Tabs
            aria-label="Report"
            style={{ width: "100%" }}
            items={[
              { value: "traffic", label: "Traffic", content: <Tabs items={plainTabs.slice(0, 3)} appearance="segmented" size="sm" aria-label="Range" /> },
              { value: "sales", label: "Sales", content: <Tabs items={plainTabs.slice(0, 3)} appearance="pill" size="sm" aria-label="Channel" /> },
            ]}
          />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={tabsProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Keep labels to a word or two.", "Use segmented for two to four views of the same thing."]}
          donts={["Use tabs to move between pages — use the Navbar or links.", "Use tabs for steps in a sequence.", "Nest two Tabs of the same appearance."]}
        />
      </div>
      <A11y items={[
          ["Tab", "Moves into the tab list on the selected tab, then on to its panel."],
          ["Arrow keys", "Move between tabs (\u2190 / \u2192 horizontal, \u2191 / \u2193 vertical); Home / End jump to the ends."],
          ["Semantics", "tablist / tab / tabpanel, with each panel labelled by its tab."],
        ]} />
    </section>

    </>
  );
}
