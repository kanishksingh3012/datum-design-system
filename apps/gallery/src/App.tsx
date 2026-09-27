import { useState } from "react";
import {
  Accordion, AccordionItem, Avatar, AvatarGroup, Badge, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, CardMedia,
  Container, Grid, Heading, Link, Section, Separator, Stack, Text,
} from "@datum-design/react";
import { Search, Plus, Star, MoreHorizontal, ArrowRight, X, Trash2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

const intents = ["accent", "neutral", "danger"] as const;
const appearances = ["solid", "soft", "outline", "ghost"] as const;

const ranges = ["Day", "Week", "Month"];
const sections = ["Overview", "Activity", "Settings"];
const aligns = [["Left", AlignLeft], ["Center", AlignCenter], ["Right", AlignRight]] as const;

const buttonProps: [string, string, string, string][] = [
  ["intent", "accent | neutral | danger", "accent", "What the color means. neutral + solid is the ink button."],
  ["appearance", "solid | soft | outline | ghost", "solid", "How much fill."],
  ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."],
  ["prefix / suffix", "ReactNode", "—", "Icon or element before / after the label."],
  ["iconOnly", "boolean", "false", "Circular; requires label."],
  ["label", "string", "—", "Accessible name; required with iconOnly."],
  ["loading", "boolean", "false", "Spinner over the label, no size change; blocks clicks, keeps focus, sets aria-busy."],
  ["disabled", "boolean", "false", "Native disabled."],
  ["pressed / onPressedChange", "boolean / (pressed) => void", "—", "Toggle mode via aria-pressed; on = the solid of its intent."],
  ["floating", "boolean", "false", "FAB treatment with overlay shadow."],
  ["fullWidth", "boolean", "false", "Stretches to its container."],
  ["render", "(props) => ReactElement", "—", "Render as an anchor or router Link."],
];

const legacy: [string, string][] = [
  ["primary", "accent · solid"],
  ["secondary", "accent · soft"],
  ["tertiary", "neutral · soft"],
  ["outline", "neutral · outline"],
  ["text", "neutral · ghost"],
  ["danger", "danger · solid"],
  ["danger-soft", "danger · soft"],
  ["link", "dropped — use Link"],
];

type PropRow = [string, string, string, string];

const containerProps: PropRow[] = [
  ["size", "sm | md | lg | xl | full", "xl", "Max content width: 640 / 768 / 1024 / 1280px / none."],
  ["padded", "boolean", "true", "Adds the responsive page gutter (grid.margin, 16–64px) outside the max width."],
];
const stackProps: PropRow[] = [
  ["direction", "vertical | horizontal", "vertical", ""],
  ["gap", "none | xs | sm | md | lg | xl", "md", "0 / 4 / 8 / 16 / 24 / 32px from the space scale."],
  ["align", "start | center | end | stretch | baseline", "stretch", "Cross axis."],
  ["justify", "start | center | end | between", "start", "Main axis."],
  ["wrap", "boolean", "false", "Lets children wrap onto new lines."],
];
const gridProps: PropRow[] = [
  ["columns", "1–12 | { base, md, lg }", "1", "A number applies at every width; an object switches at 768 / 1024px, each step inheriting the one below."],
  ["minItemWidth", "number | string", "—", "Auto-fit: as many columns as fit, each at least this wide. Wins over columns."],
  ["gap", "none | xs | sm | md | lg | xl", "md", "Same scale as Stack."],
];
const sectionProps: PropRow[] = [
  ["spacing", "sm | md | lg", "md", "32 / 64 / 96px vertical padding."],
  ["tone", "default | muted | accent", "default", "bg.page / bg.surface / bg.accentSubtle."],
  ["as", "section | div | header | footer", "section", "The landmark element."],
];
const headingProps: PropRow[] = [
  ["level", "1–6", "2", "Semantic tag, h1–h6."],
  ["size", "display-lg | display-md | display-sm | xl | lg | md | sm", "from level", "Type role. Level 1 → xl, 2 → lg, 3 → md, 4–6 → sm."],
  ["tone", "primary | secondary | accent", "primary", ""],
];
const textProps: PropRow[] = [
  ["variant", "body-lg | body-md | body-sm | paragraph-lg | paragraph-md | label | caption | overline | numeric-lg | numeric-md | numeric-sm | code", "body-md", "One of the type roles. Numeric uses tabular figures; overline is uppercase."],
  ["tone", "primary | secondary | accent | danger | success | warning", "primary", "Two text colors; build hierarchy with the variant, not a third gray."],
  ["weight", "regular | medium | semibold", "from role", "Override only when the role's weight doesn't fit."],
  ["truncate", "boolean | number", "false", "true: one line with an ellipsis. A number: clamp to that many lines."],
  ["as", "p | span | div | label", "p", "htmlFor passes through for label."],
];

const headingSizes = ["display-lg", "display-md", "display-sm", "xl", "lg", "md", "sm"] as const;
const textVariants = [
  ["body-lg", "Interface text, large"],
  ["body-md", "Interface text, the default"],
  ["body-sm", "Interface text, small"],
  ["paragraph-lg", "Long-form reading, looser line height"],
  ["paragraph-md", "Long-form reading, looser line height"],
  ["label", "Form label"],
  ["caption", "Helper text under a field"],
  ["overline", "Category marker"],
  ["numeric-lg", "$12,480.00"],
  ["numeric-md", "1,024 / 2,048"],
  ["numeric-sm", "08:45:12"],
  ["code", "npm install @datum-design/react"],
] as const;
const textTones = ["primary", "secondary", "accent", "danger", "success", "warning"] as const;

const cardProps: PropRow[] = [
  ["appearance", "elevated | outline | soft", "elevated", "Surface shadow / border only / surface fill."],
  ["padding", "sm | md | lg", "md", "16 / 24 / 32px."],
  ["interactive", "boolean", "false", "Whole card is clickable: an <a> with href, a <button> without. Hover lift, press, focus ring."],
  ["href", "string", "—", "With interactive, makes the card a link."],
  ["render", "(props) => ReactElement", "—", "With interactive, render as a router Link."],
  ["slots", "CardMedia · CardHeader · CardBody · CardFooter", "—", "Media bleeds to the edges; the body grows; the footer sits at the bottom."],
];
const badgeIntents = ["accent", "neutral", "danger", "success", "warning", "info"] as const;
const badgeProps: PropRow[] = [
  ["intent", "accent | neutral | danger | success | warning | info", "neutral", "What the color means. neutral + solid is ink."],
  ["appearance", "solid | soft | outline", "soft", "How much fill."],
  ["size", "sm | md", "md", "20 / 24px tall."],
  ["dot", "boolean", "false", "Leading status dot in the text color; decorative."],
];
const avatarProps: PropRow[] = [
  ["size", "xs | sm | md | lg | xl", "md", "24 / 32 / 40 / 48 / 64px."],
  ["shape", "circle | square", "circle", "Square uses radius.subtle."],
  ["src / name", "string", "—", "Falls back to initials from name, then an icon. name is the accessible name."],
  ["status", "online | away | busy | offline", "—", "Presence dot; added to the accessible name."],
  ["AvatarGroup", "max, size, shape", "—", "Overlapping stack with \"+N\"."],
];
const separatorProps: PropRow[] = [
  ["orientation", "horizontal | vertical", "horizontal", "Vertical stretches to its row."],
  ["tone", "subtle | default", "subtle", "border.subtle / border.default."],
  ["label", "string", "—", "Text in the middle, e.g. \"or\"; also the accessible name."],
];
const accordionProps: PropRow[] = [
  ["type", "single | multiple", "single", "One item open at a time, or any number."],
  ["appearance", "plain | bordered | separated", "bordered", "Dividers / one box / a card per item."],
  ["collapsible", "boolean", "true", "With single: allow closing the open item."],
  ["value / defaultValue / onValueChange", "string | string[]", "—", "Open items by their AccordionItem value."],
  ["disabled", "boolean", "false", "On Accordion or on one AccordionItem."],
  ["headingLevel", "2–6", "3", "The heading that wraps each trigger."],
  ["AccordionItem", "title, value, disabled", "—", "title is the trigger label."],
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];
const faq = [
  ["refund", "Can I get a refund?", "Yes, within 30 days of purchase, no questions asked."],
  ["seats", "How do seats work?", "Each person who signs in uses one seat. Remove someone and their seat frees up the same day."],
  ["cancel", "What happens when I cancel?", "Your workspace stays readable for 90 days, so you can export everything."],
] as const;

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className="props-table">
      <thead>
        <tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr>
      </thead>
      <tbody>
        {rows.map(([prop, values, def, note]) => (
          <tr key={prop}>
            <th scope="row"><code>{prop}</code></th>
            <td><code>{values}</code></td>
            <td><code>{def}</code></td>
            <td>{note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Usage({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="usage-grid">
      <div>
        <h3>Do</h3>
        <ul>{dos.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
      <div>
        <h3>Don't</h3>
        <ul>{donts.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
    </div>
  );
}

const Cell = ({ children }: { children: string }) => <div className="demo-cell">{children}</div>;

export function App() {
  const [pressed, setPressed] = useState(false);
  const [range, setRange] = useState("Week");
  const [align, setAlign] = useState("Left");
  const [section, setSection] = useState("Overview");
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "orange");
  const [mode, setMode] = useState(() =>
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  function switchTheme(next: string) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }

  function switchMode(next: string) {
    document.documentElement.style.colorScheme = next;
    setMode(next);
  }

  return (
    <div className="doc">
      <div className="switches">
        <div className="theme-switch" role="group" aria-label="Theme">
          {["orange", "navy"].map((t) => (
            <button key={t} type="button" aria-pressed={theme === t} onClick={() => switchTheme(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="theme-switch" role="group" aria-label="Mode">
          {["light", "dark"].map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => switchMode(m)}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <nav className="doc-nav">
        <a href="#button">Button</a>
        <a href="#icon-only">Icon-only</a>
        <a href="#toggle">Toggle</a>
        <a href="#floating">Floating (FAB)</a>
        <a href="#button-group">Button Group</a>
        <a href="#link">Link</a>
        <a href="#container">Container</a>
        <a href="#stack">Stack</a>
        <a href="#grid">Grid</a>
        <a href="#section">Section</a>
        <a href="#heading">Heading</a>
        <a href="#text">Text</a>
        <a href="#card">Card</a>
        <a href="#badge">Badge</a>
        <a href="#avatar">Avatar</a>
        <a href="#separator">Separator</a>
        <a href="#accordion">Accordion</a>
      </nav>

      {/* ============ BUTTON ============ */}
      <section className="component-doc" id="button">
        <h1>Button</h1>
        <p className="dek">
          The core action. Three props decide how it looks: <span className="prop-values">intent</span> is what the color
          means, <span className="prop-values">appearance</span> is how much fill, and <span className="prop-values">size</span>{" "}
          is how tall. Always a pill. Icon-only, toggle and floating are modes of the same component.
        </p>

        <div className="example-box">
          <Button>Get started</Button>
          <Button intent="neutral" appearance="outline">Learn more</Button>
        </div>

        <div className="doc-section">
          <h2>Intent × appearance</h2>
          <p className="lead">
            Twelve combinations, all checked for contrast in orange and navy, light and dark. Neutral + solid is the{" "}
            <b>ink</b> button (<b>bg.inverse</b> / <b>text.onInverse</b>).
          </p>
          <div className="matrix" role="table" aria-label="Intent by appearance">
            <div role="row" className="matrix-row">
              <span role="columnheader" />
              {appearances.map((a) => (
                <span role="columnheader" key={a} className="matrix-head">{a}</span>
              ))}
            </div>
            {intents.map((intent) => (
              <div role="row" className="matrix-row" key={intent}>
                <span role="rowheader" className="matrix-head">{intent}</span>
                {appearances.map((appearance) => (
                  <span role="cell" key={appearance}>
                    <Button intent={intent} appearance={appearance}>
                      {intent === "danger" ? "Delete" : "Button"}
                    </Button>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">32, 40 and 48px tall with a mouse or trackpad; each grows by 4px on touch screens, so md meets the 44px target.</p>
          <div className="sample-box">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Prefix and suffix</h2>
          <div className="sample-box">
            <Button intent="neutral" appearance="soft" prefix={<Search />}>Search</Button>
            <Button suffix={<ArrowRight />}>Continue</Button>
            <Button intent="danger" appearance="outline" prefix={<Trash2 />}>Delete</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>States</h2>
          <p className="lead">
            Default, hover (the fill changes to its hover token), focus (a <b>border.focus</b> ring — press Tab to see it), pressed, disabled and loading. Loading swaps the
            prefix for a spinner and blocks clicks but keeps focus, so a submit button doesn't drop the keyboard user.
          </p>
          <div className="sample-box">
            <Button disabled>Disabled</Button>
            <Button intent="neutral" appearance="outline" disabled>Disabled</Button>
            <Button loading>Saving</Button>
            <Button intent="neutral" appearance="soft" loading>Loading</Button>
            <Button intent="neutral" appearance="outline" pressed={false} onPressedChange={() => {}}>Not pressed</Button>
            <Button intent="neutral" appearance="outline" pressed onPressedChange={() => {}}>Pressed</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Full width</h2>
          <div className="sample-box stack">
            <Button fullWidth size="lg">Create account</Button>
            <Button fullWidth intent="neutral" appearance="outline" size="lg">Sign in</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Render as a link</h2>
          <p className="lead">Use <b>render</b> when the action navigates, so it is a real anchor (or your router's Link).</p>
          <div className="sample-box">
            <Button appearance="soft" suffix={<ArrowRight />} render={(props) => <a href="#link" {...props} />}>
              Read the docs
            </Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <table className="props-table">
            <thead>
              <tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr>
            </thead>
            <tbody>
              {buttonProps.map(([prop, values, def, note]) => (
                <tr key={prop}>
                  <th scope="row"><code>{prop}</code></th>
                  <td><code>{values}</code></td>
                  <td><code>{def}</code></td>
                  <td>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <div className="usage-grid">
            <div>
              <h3>Do</h3>
              <ul>
                <li>Use one solid accent (or danger) button per view region.</li>
                <li>Pair a solid with a soft, outline or ghost button for secondary actions.</li>
                <li>Keep size consistent within a region.</li>
              </ul>
            </div>
            <div>
              <h3>Don't</h3>
              <ul>
                <li>Put two solid accent buttons side by side.</li>
                <li>Rely on color alone for danger — say what gets deleted.</li>
                <li>Use Button for navigation without <span className="prop-values">render</span>; use Link in running text.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Migrating from variant</h2>
          <div className="sample-box column" style={{ padding: 0, border: "none", background: "none", gap: 0 }}>
            {legacy.map(([from, to]) => (
              <div className="variant-row" key={from}>
                <span className="name">{from}</span>
                <span className="desc">{to}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ICON-ONLY ============ */}
      <section className="component-doc" id="icon-only">
        <h1>Icon-only</h1>
        <p className="dek">Same Button, <span className="prop-values">iconOnly</span> set — no separate Icon Button component. Always requires <span className="prop-values">label</span>, since there's no visible text to fall back on.</p>

        <div className="example-box">
          <Button iconOnly label="Search" intent="neutral" appearance="ghost"><Search /></Button>
        </div>

        <div className="doc-section">
          <h2>Appearances &amp; sizes</h2>
          <div className="sample-box">
            <Button iconOnly label="More" intent="neutral" appearance="ghost" size="sm"><MoreHorizontal /></Button>
            <Button iconOnly label="More" intent="neutral" appearance="outline"><MoreHorizontal /></Button>
            <Button iconOnly label="Add" intent="neutral"><Plus /></Button>
            <Button iconOnly label="Next" size="lg"><ArrowRight /></Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Common use: dismiss controls</h2>
          <p className="lead">A neutral, ghost, sm, icon-only Button with an X glyph covers toasts, modals, and dialogs.</p>
          <div className="sample-box">
            <Button iconOnly label="Close" intent="neutral" appearance="ghost" size="sm"><X /></Button>
          </div>
        </div>
      </section>

      {/* ============ TOGGLE ============ */}
      <section className="component-doc" id="toggle">
        <h1>Toggle</h1>
        <p className="dek">Same Button, with <span className="prop-values">pressed</span> + <span className="prop-values">onPressedChange</span> — a persistent on/off state exposed via aria-pressed. When on, it takes the solid treatment of its own intent: neutral turns ink, accent turns accent.</p>

        <div className="example-box">
          <Button pressed={pressed} onPressedChange={setPressed} intent="neutral" appearance="outline" prefix={<Star />}>
            Favorite
          </Button>
        </div>

        <div className="doc-section">
          <h2>Off / on</h2>
          <div className="sample-box">
            <Button intent="neutral" appearance="outline" pressed={false} onPressedChange={() => {}}>Off</Button>
            <Button intent="neutral" appearance="outline" pressed onPressedChange={() => {}}>On</Button>
            <Button appearance="soft" pressed={false} onPressedChange={() => {}}>Off</Button>
            <Button appearance="soft" pressed onPressedChange={() => {}}>On</Button>
          </div>
        </div>
      </section>

      {/* ============ FLOATING (FAB) ============ */}
      <section className="component-doc" id="floating">
        <h1>Floating (FAB)</h1>
        <p className="dek">Same Button, <span className="prop-values">floating</span> set — the single most important action on a screen, floats above content and stays reachable while scrolling.</p>

        <div className="example-box">
          <Button floating iconOnly label="New project"><Plus /></Button>
        </div>

        <div className="doc-section">
          <h2>Icon-only vs. extended</h2>
          <div className="sample-box">
            <Button floating iconOnly label="New project"><Plus /></Button>
            <Button floating prefix={<Plus />}>New project</Button>
            <Button floating intent="neutral" prefix={<Plus />}>New project</Button>
          </div>
        </div>
      </section>

      {/* ============ BUTTON GROUP ============ */}
      <section className="component-doc" id="button-group">
        <h1>Button Group</h1>
        <p className="dek">Related actions as one unit. Spaced by default. <span className="prop-values">attached</span> joins them into one track, where the pressed segment is a raised thumb: a view switcher. Either way the group hugs its content, and vertical groups are as wide as their widest button.</p>

        <div className="example-box">
          <ButtonGroup attached aria-label="Range">
            {ranges.map((r) => (
              <Button key={r} pressed={range === r} onPressedChange={() => setRange(r)}>{r}</Button>
            ))}
          </ButtonGroup>
        </div>

        <div className="doc-section">
          <h2>Attached</h2>
          <p className="lead">One track, no lines between segments. Give each Button <b>pressed</b>; the pressed one becomes the thumb. Works with text or icon-only segments, in every size.</p>
          <div className="sample-box">
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
          </div>
        </div>

        <div className="doc-section">
          <h2>Vertical</h2>
          <p className="lead">A tall track uses the 20px card radius, since a tall box is never a pill. Its segments use 20px minus the 4px inset, so the thumb's corners run parallel to the track's. Items share the widest item's width.</p>
          <div className="sample-box">
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
          </div>
        </div>

        <div className="doc-section">
          <h2>Spaced, with shared props</h2>
          <p className="lead"><b>size</b>, <b>intent</b> and <b>appearance</b> set on the group reach every Button inside it; a Button's own prop wins.</p>
          <div className="sample-box">
            <ButtonGroup intent="neutral" appearance="ghost" aria-label="Dialog actions">
              <Button>Cancel</Button>
              <Button intent="accent" appearance="solid">Save</Button>
            </ButtonGroup>
            <ButtonGroup size="sm" intent="neutral" appearance="outline" aria-label="Edit">
              <Button prefix={<Plus />}>Add</Button>
              <Button>Duplicate</Button>
              <Button intent="danger">Delete</Button>
            </ButtonGroup>
          </div>
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
      </section>

      {/* ============ LINK ============ */}
      <section className="component-doc" id="link">
        <h1>Link</h1>
        <p className="dek">Inline and standalone navigation — a real &lt;a&gt;, so keyboard and screen reader behavior come free. Use Link to go somewhere; use Button (with <span className="prop-values">render</span> if it must be an anchor) to do something.</p>

        <div className="example-box">
          <p style={{ margin: 0 }}>Read our <Link href="#link">privacy policy</Link> before continuing.</p>
        </div>

        <div className="doc-section">
          <h2>Tone</h2>
          <p className="lead"><b>accent</b> for most links, <b>neutral</b> for quieter ones (it turns accent on hover), <b>inherit</b> to take the surrounding text color, e.g. inside an alert.</p>
          <div className="sample-box">
            <Link href="#link">Accent</Link>
            <Link href="#link" tone="neutral">Neutral</Link>
            <span style={{ color: "var(--color-text-danger)" }}>Payment failed. <Link href="#link" tone="inherit">Update card</Link></span>
          </div>
        </div>

        <div className="doc-section">
          <h2>Underline</h2>
          <p className="lead">Links in running text keep <b>always</b>, so they aren't told apart by color alone. <b>hover</b> and <b>none</b> are for standalone links such as navigation and footers. Hover thickens the underline instead of dimming the text.</p>
          <div className="sample-box">
            <Link href="#link" underline="always">Always</Link>
            <Link href="#link" underline="hover">Hover only</Link>
            <Link href="#link" underline="none">No underline</Link>
          </div>
        </div>

        <div className="doc-section">
          <h2>External</h2>
          <p className="lead">Opens in a new tab with <b>rel="noopener noreferrer"</b>, adds an arrow, and tells screen readers "opens in a new tab".</p>
          <div className="sample-box">
            <Link href="https://www.w3.org/WAI/standards-guidelines/wcag/" external>WCAG guidelines</Link>
            <Link href="https://github.com" external tone="neutral" underline="hover">GitHub</Link>
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">Defaults to <b>inherit</b>, matching the surrounding text. <b>sm</b> and <b>md</b> set the body-sm / body-md roles for standalone links.</p>
          <div className="sample-box">
            <Link href="#link" size="sm" underline="hover">Small link</Link>
            <Link href="#link" size="md" underline="hover">Medium link</Link>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <ul>
            <li><b>tone</b><span className="prop-values">accent | neutral | inherit — default accent</span></li>
            <li><b>underline</b><span className="prop-values">always | hover | none — default always</span></li>
            <li><b>external</b><span className="prop-values">boolean — new tab, safe rel, arrow icon, screen reader hint</span></li>
            <li><b>size</b><span className="prop-values">inherit | sm | md — default inherit</span></li>
            <li><b>…anchor attributes</b><span className="prop-values">href, target, rel and the rest are passed through; explicit target/rel win over external</span></li>
          </ul>
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <div className="usage-grid">
            <div>
              <h3>Do</h3>
              <ul>
                <li>Write link text that makes sense on its own ("Read the pricing guide").</li>
                <li>Keep the underline on links inside paragraphs.</li>
                <li>Mark links that leave the site with external.</li>
              </ul>
            </div>
            <div>
              <h3>Don't</h3>
              <ul>
                <li>Use "click here" or a bare URL as link text.</li>
                <li>Use a Link for an action that doesn't navigate — use Button.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ============ CONTAINER ============ */}
      <section className="component-doc" id="container">
        <h1>Container</h1>
        <p className="dek">Centers content at a readable max width and adds the page gutter. Put one inside every Section; nest a smaller one for text that shouldn't run the full width.</p>

        <div className="example-box demo-frame">
          <Container size="sm" className="demo-outline">
            <Text variant="caption" tone="secondary">size="sm" · 640px + gutter</Text>
          </Container>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead"><b>sm</b> 640, <b>md</b> 768, <b>lg</b> 1024, <b>xl</b> 1280 (the default, <b>grid.container</b>) and <b>full</b> for no limit, shown here at half scale in a 1400px page. The width is the content width; the gutter sits outside it.</p>
          <div className="sample-box demo-frame">
            <div className="demo-zoom">
              {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
                <Container key={size} size={size} padded={false} className="demo-outline">
                  <Text variant="body-lg" tone="secondary">{`size="${size}"`}</Text>
                </Container>
              ))}
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Gutter</h2>
          <p className="lead"><b>padded</b> (on by default) adds <b>grid.margin</b> on both sides: 16px on a phone, growing to 64px on a wide screen. Turn it off when the parent already has padding.</p>
          <div className="sample-box stack demo-frame">
            <Container size="full" className="demo-outline"><Text variant="caption" tone="secondary">padded</Text></Container>
            <Container size="full" padded={false} className="demo-outline"><Text variant="caption" tone="secondary">padded={"{false}"}</Text></Container>
          </div>
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
      </section>

      {/* ============ STACK ============ */}
      <section className="component-doc" id="stack">
        <h1>Stack</h1>
        <p className="dek">A row or column of children with one consistent gap. Replaces margins between siblings, so spacing lives in one place and always comes from the space scale.</p>

        <div className="example-box">
          <Stack gap="sm" align="center">
            <Heading level={3}>Ready to start?</Heading>
            <Text tone="secondary">Set up your workspace in a few minutes.</Text>
            <Stack direction="horizontal" gap="sm">
              <Button>Get started</Button>
              <Button intent="neutral" appearance="outline">Talk to sales</Button>
            </Stack>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Gap</h2>
          <p className="lead"><b>none</b> 0, <b>xs</b> 4, <b>sm</b> 8, <b>md</b> 16 (default), <b>lg</b> 24, <b>xl</b> 32px.</p>
          <div className="sample-box stack">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((gap) => (
              <Stack key={gap} direction="horizontal" align="center">
                <Text variant="code" tone="secondary" className="demo-label">{gap}</Text>
                <Stack direction="horizontal" gap={gap}>
                  <Cell>A</Cell><Cell>B</Cell><Cell>C</Cell>
                </Stack>
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Align and justify</h2>
          <p className="lead"><b>align</b> works across the stack (default <b>stretch</b>; use <b>baseline</b> to line up text of different sizes). <b>justify</b> works along it; <b>between</b> pushes the first and last child to the ends.</p>
          <div className="sample-box stack">
            <Stack direction="horizontal" justify="between" align="baseline">
              <Heading level={3} size="md">Invoices</Heading>
              <Link href="#stack" underline="hover" size="sm">View all</Link>
            </Stack>
            <Stack direction="horizontal" justify="end" gap="sm">
              <Button intent="neutral" appearance="ghost">Cancel</Button>
              <Button>Save</Button>
            </Stack>
          </div>
        </div>

        <div className="doc-section">
          <h2>Wrap</h2>
          <p className="lead">With <b>wrap</b>, a horizontal stack flows onto new lines instead of overflowing — for tags and button rows on small screens.</p>
          <div className="sample-box" style={{ display: "block", maxWidth: 320 }}>
            <Stack direction="horizontal" gap="xs" wrap>
              {["Design", "Tokens", "React", "Accessibility", "Theming", "Docs"].map((t) => <Cell key={t}>{t}</Cell>)}
            </Stack>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={stackProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Space siblings with Stack instead of margins.", "Nest stacks: a vertical page stack of horizontal rows."]}
            donts={["Add margins to children inside a Stack.", "Use Stack for a two-dimensional layout — use Grid."]}
          />
        </div>
      </section>

      {/* ============ GRID ============ */}
      <section className="component-doc" id="grid">
        <h1>Grid</h1>
        <p className="dek">Equal columns that collapse on small screens. Give it a column count per breakpoint, or a minimum item width and let it fit as many as it can.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Grid columns={{ base: 1, md: 3 }}>
            <Cell>One</Cell><Cell>Two</Cell><Cell>Three</Cell>
          </Grid>
        </div>

        <div className="doc-section">
          <h2>Responsive columns</h2>
          <p className="lead">An object switches at the <b>md</b> (768px) and <b>lg</b> (1024px) breakpoints; each step inherits the one below it. A plain number applies at every width. Resize the window to see this one go 1 → 2 → 4.</p>
          <div className="sample-box" style={{ display: "block" }}>
            <Grid columns={{ base: 1, md: 2, lg: 4 }} gap="sm">
              {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => <Cell key={n}>{n}</Cell>)}
            </Grid>
          </div>
        </div>

        <div className="doc-section">
          <h2>Auto-fit</h2>
          <p className="lead"><b>minItemWidth</b> makes as many columns as fit, each at least that wide — no breakpoints needed. A single item never overflows a narrower container.</p>
          <div className="sample-box" style={{ display: "block" }}>
            <Grid minItemWidth={180} gap="sm">
              {["Starter", "Team", "Business", "Enterprise"].map((n) => <Cell key={n}>{n}</Cell>)}
            </Grid>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={gridProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Start at one column and add columns at md and lg.", "Use minItemWidth for card grids of unknown length."]}
            donts={["Use a fixed column count above 2 without a responsive object — it stays that wide on phones.", "Use Grid for a single row of buttons — use Stack."]}
          />
        </div>
      </section>

      {/* ============ SECTION ============ */}
      <section className="component-doc" id="section">
        <h1>Section</h1>
        <p className="dek">A full-width page band with consistent vertical rhythm. The page is a stack of Sections, each holding a Container.</p>

        <div className="example-box demo-bands">
          <Section tone="accent" spacing="sm">
            <Container size="sm">
              <Stack gap="sm" align="center">
                <Text variant="overline" tone="accent">New</Text>
                <Heading level={2} size="xl">Datum 1.0 is here</Heading>
                <Button>Read the release notes</Button>
              </Stack>
            </Container>
          </Section>
        </div>

        <div className="doc-section">
          <h2>Tone</h2>
          <p className="lead"><b>default</b> is <b>bg.page</b>, <b>muted</b> is <b>bg.surface</b>, <b>accent</b> is <b>bg.accentSubtle</b>. Alternate default and muted to separate bands; keep accent for one band per page.</p>
          <div className="sample-box stack demo-bands">
            {(["default", "muted", "accent"] as const).map((tone) => (
              <Section key={tone} tone={tone} spacing="sm">
                <Container size="full">
                  <Stack gap="xs">
                    <Heading level={3} size="md">{`tone="${tone}"`}</Heading>
                    <Text tone="secondary">Text and controls are checked for contrast on every tone.</Text>
                  </Stack>
                </Container>
              </Section>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Spacing</h2>
          <p className="lead"><b>sm</b> 32, <b>md</b> 64 (default), <b>lg</b> 96px above and below. Use lg for the hero, md for most bands.</p>
          <div className="sample-box stack demo-bands">
            {(["sm", "md", "lg"] as const).map((spacing) => (
              <Section key={spacing} tone="muted" spacing={spacing} className="demo-rule">
                <Container size="full"><Text variant="code" tone="secondary">{`spacing="${spacing}"`}</Text></Container>
              </Section>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={sectionProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Give each Section a heading, or an aria-label, so it is a named region.", "Use as=\"header\" / \"footer\" for the page header and footer bands."]}
            donts={["Put content straight into a Section without a Container.", "Stack two accent bands."]}
          />
        </div>
      </section>

      {/* ============ HEADING ============ */}
      <section className="component-doc" id="heading">
        <h1>Heading</h1>
        <p className="dek">Titles in the display and heading type roles. <span className="prop-values">level</span> is the HTML tag, for the document outline; <span className="prop-values">size</span> is how it looks. Pick them separately.</p>

        <div className="example-box">
          <Stack gap="xs" align="center">
            <Heading level={1} size="display-md">Build faster</Heading>
            <Heading level={2} size="md" tone="secondary">A design system for the web</Heading>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">Three display sizes for hero statements (one per view) and four heading sizes for page, section, subsection and card titles. Barlow throughout.</p>
          <div className="sample-box stack">
            {headingSizes.map((size) => (
              <Stack key={size} direction="horizontal" gap="md" align="baseline">
                <Text variant="code" tone="secondary" className="demo-label">{size}</Text>
                <Heading level={3} size={size}>Pricing plans</Heading>
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Level and size</h2>
          <p className="lead">Without <b>size</b>, the level decides: 1 → xl, 2 → lg, 3 → md, 4–6 → sm. Override the size, not the level, when a heading needs to look bigger or smaller — the outline must not skip levels.</p>
          <div className="sample-box stack">
            <Heading level={1} size="display-sm">level 1, size display-sm</Heading>
            <Heading level={2} size="sm">level 2, size sm</Heading>
          </div>
        </div>

        <div className="doc-section">
          <h2>Tone</h2>
          <div className="sample-box">
            <Heading level={3} size="md">Primary</Heading>
            <Heading level={3} size="md" tone="secondary">Secondary</Heading>
            <Heading level={3} size="md" tone="accent">Accent</Heading>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={headingProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use one level 1 per page.", "Choose the level for the outline and the size for the look."]}
            donts={["Skip levels to get a smaller heading — change size.", "Use a display size more than once per view."]}
          />
        </div>
      </section>

      {/* ============ TEXT ============ */}
      <section className="component-doc" id="text">
        <h1>Text</h1>
        <p className="dek">Every non-heading text style, picked by purpose rather than size. Resets margins, so space it with Stack.</p>

        <div className="example-box">
          <Stack gap="xs">
            <Text variant="overline" tone="secondary">Monthly revenue</Text>
            <Text variant="numeric-lg">$48,210.00</Text>
            <Text variant="caption" tone="success">+12.4% from last month</Text>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Variants</h2>
          <p className="lead"><b>body</b> for interface text, <b>paragraph</b> for long-form reading (line height 1.7), <b>label</b>, <b>caption</b> and <b>overline</b> for UI text, <b>numeric</b> for figures (IBM Plex Mono, tabular so columns line up) and <b>code</b>.</p>
          <div className="sample-box stack">
            {textVariants.map(([variant, sample]) => (
              <Stack key={variant} direction="horizontal" gap="md" align="baseline">
                <Text variant="code" tone="secondary" className="demo-label">{variant}</Text>
                <Text variant={variant}>{sample}</Text>
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Tone</h2>
          <p className="lead">Two text colors, <b>primary</b> and <b>secondary</b>, plus accent and the state tones. All pass 4.5:1 on <b>bg.page</b> and <b>bg.surface</b> in every theme and mode. There is no third gray: for less important text, step down the variant (body-sm, caption, overline) instead. State tones say what happened; don't use them for decoration.</p>
          <div className="sample-box">
            {textTones.map((tone) => <Text key={tone} as="span" tone={tone}>{tone}</Text>)}
          </div>
        </div>

        <div className="doc-section">
          <h2>Weight</h2>
          <p className="lead">Each variant brings its own weight. Override with <b>regular</b>, <b>medium</b> or <b>semibold</b> only when needed, e.g. to emphasise a total.</p>
          <div className="sample-box">
            <Text as="span" weight="regular">Regular</Text>
            <Text as="span" weight="medium">Medium</Text>
            <Text as="span" weight="semibold">Semibold</Text>
          </div>
        </div>

        <div className="doc-section">
          <h2>Truncate</h2>
          <p className="lead"><b>true</b> cuts one line with an ellipsis; a number clamps to that many lines. Put the full text in a tooltip or detail view when it matters.</p>
          <div className="sample-box" style={{ display: "block", maxWidth: 320 }}>
            <Stack gap="sm">
            <Text truncate>Quarterly planning — design system rollout across marketing and product</Text>
            <Text truncate={2} tone="secondary">A description that runs on for a while, clamped to two lines so that cards in a grid stay the same height.</Text>
            </Stack>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={textProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Pick the variant by purpose: figures use numeric, reading uses paragraph.", "Use as=\"span\" inside other text, as=\"label\" with htmlFor for a form label."]}
            donts={["Pick a variant for its size — use the one that matches the job.", "Use tone alone to say something went wrong — say it in words too."]}
          />
        </div>
      </section>

      {/* ============ CARD ============ */}
      <section className="component-doc" id="card">
        <h1>Card</h1>
        <p className="dek">A container for one piece of grouped content: a plan, an article, a person. Compose it from four optional slots — <span className="prop-values">CardMedia</span>, <span className="prop-values">CardHeader</span>, <span className="prop-values">CardBody</span>, <span className="prop-values">CardFooter</span>.</p>

        <div className="example-box">
          <Card style={{ width: 300 }}>
            <CardMedia><div className="demo-media" /></CardMedia>
            <CardHeader>
              <Heading level={3} size="sm">Team plan</Heading>
              <Badge intent="accent">Popular</Badge>
            </CardHeader>
            <CardBody>
              <Text tone="secondary">Shared workspaces, roles and an audit log for up to 50 people.</Text>
            </CardBody>
            <CardFooter>
              <Button size="sm">Start trial</Button>
              <Button size="sm" intent="neutral" appearance="ghost">Compare</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="doc-section">
          <h2>Appearance</h2>
          <p className="lead"><b>elevated</b> lifts off the page with the surface shadow. <b>outline</b> is a border and no fill, for dense grids. <b>soft</b> is the surface fill alone, for cards on a busy page. All use <b>radius.card</b> (20px).</p>
          <div className="sample-box demo-on-page">
            {(["elevated", "outline", "soft"] as const).map((appearance) => (
              <Card key={appearance} appearance={appearance} style={{ width: 200 }}>
                <Heading level={3} size="sm">{appearance}</Heading>
                <Text variant="body-sm" tone="secondary">Card content</Text>
              </Card>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Padding</h2>
          <p className="lead"><b>sm</b> 16, <b>md</b> 24, <b>lg</b> 32px. Media in the first or last slot bleeds to the edges whatever the padding.</p>
          <div className="sample-box">
            {(["sm", "md", "lg"] as const).map((padding) => (
              <Card key={padding} appearance="outline" padding={padding}>
                <Text variant="code" tone="secondary">{padding}</Text>
              </Card>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Interactive</h2>
          <p className="lead">The whole card is one target: an <b>&lt;a&gt;</b> with <b>href</b>, a <b>&lt;button&gt;</b> without, or your router link via <b>render</b>. It lifts 2px and takes the raised shadow on hover, scales to 0.98 on press, and shows the focus ring from the keyboard. A clickable outline card uses <b>border.strong</b> so its edge reaches 3:1. Put no other controls inside.</p>
          <div className="sample-box demo-on-page">
            {(["elevated", "outline", "soft"] as const).map((appearance) => (
              <Card key={appearance} appearance={appearance} interactive href="#card" style={{ width: 200 }}>
                <Heading level={3} size="sm">Read the guide</Heading>
                <Text variant="body-sm" tone="secondary">{`${appearance}, links to #card`}</Text>
              </Card>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={cardProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Give each card a heading in CardHeader, at the right level for the page.", "Make the whole card interactive when it leads to one place."]}
            donts={["Nest cards inside cards.", "Put buttons or links inside an interactive card — use a static card with a footer instead."]}
          />
        </div>
      </section>

      {/* ============ BADGE ============ */}
      <section className="component-doc" id="badge">
        <h1>Badge</h1>
        <p className="dek">A short, non-interactive label for a status or a category. Same intent and appearance vocabulary as Button, always a pill.</p>

        <div className="example-box">
          <Badge intent="success" dot>Live</Badge>
          <Badge intent="warning">Beta</Badge>
          <Badge intent="accent" appearance="solid">New</Badge>
          <Badge appearance="outline">v2.4.0</Badge>
        </div>

        <div className="doc-section">
          <h2>Intent × appearance</h2>
          <p className="lead"><b>soft</b> is the default: a tint of the intent with its text color. <b>solid</b> is for the one badge that must stand out; neutral solid is ink. <b>outline</b> is the quietest. Every combination passes 4.5:1 in all four theme and mode combinations.</p>
          <div className="sample-box stack">
            {(["soft", "solid", "outline"] as const).map((appearance) => (
              <Stack key={appearance} direction="horizontal" gap="sm" align="center" wrap>
                <Text variant="code" tone="secondary" className="demo-label">{appearance}</Text>
                {badgeIntents.map((intent) => (
                  <Badge key={intent} intent={intent} appearance={appearance}>{intent}</Badge>
                ))}
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Size and dot</h2>
          <p className="lead"><b>md</b> is 24px tall, <b>sm</b> 20px. <b>dot</b> adds a leading dot in the text color; it is decorative, so the words still say the status.</p>
          <div className="sample-box">
            <Badge intent="success" dot>Operational</Badge>
            <Badge intent="danger" dot>Outage</Badge>
            <Badge intent="success" dot size="sm">Operational</Badge>
            <Badge intent="danger" dot size="sm">Outage</Badge>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={badgeProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Keep it to one or two words.", "Use the state intents for states and accent for brand highlights like \"New\"."]}
            donts={["Make a badge clickable — use a Button or a Link.", "Rely on color alone: \"Failed\" says what red means."]}
          />
        </div>
      </section>

      {/* ============ AVATAR ============ */}
      <section className="component-doc" id="avatar">
        <h1>Avatar</h1>
        <p className="dek">A person or an entity. Shows the image, falls back to initials from <span className="prop-values">name</span> when the image is missing or fails, then to an icon.</p>

        <div className="example-box">
          <Stack direction="horizontal" gap="md" align="center">
            <Avatar size="xl" name="Ada Lovelace" status="online" />
            <AvatarGroup max={3} aria-label="Project members">
              {people.map((name) => <Avatar key={name} name={name} />)}
            </AvatarGroup>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead"><b>xs</b> 24, <b>sm</b> 32, <b>md</b> 40, <b>lg</b> 48, <b>xl</b> 64px. The initials step up a type role with each size.</p>
          <div className="sample-box">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => <Avatar key={size} size={size} name="Grace Hopper" />)}
          </div>
        </div>

        <div className="doc-section">
          <h2>Shape and fallback</h2>
          <p className="lead"><b>circle</b> for people, <b>square</b> (<b>radius.subtle</b>) for teams, companies and projects. Initials use the accent tint; with no name the avatar shows an icon and is hidden from screen readers.</p>
          <div className="sample-box">
            <Avatar size="lg" name="Ada Lovelace" />
            <Avatar size="lg" shape="square" name="Datum" />
            <Avatar size="lg" name="Broken image" src="/missing.jpg" />
            <Avatar size="lg" />
          </div>
        </div>

        <div className="doc-section">
          <h2>Status</h2>
          <p className="lead">A presence dot, ringed in the page color. The status is added to the accessible name, e.g. "Ada Lovelace, busy".</p>
          <div className="sample-box">
            {(["online", "away", "busy", "offline"] as const).map((status) => (
              <Stack key={status} gap="xs" align="center">
                <Avatar size="lg" name="Ada Lovelace" status={status} />
                <Text variant="caption" tone="secondary">{status}</Text>
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>AvatarGroup</h2>
          <p className="lead">An overlapping stack. <b>max</b> collapses the rest into a neutral "+N" (read as "N more"); <b>size</b> and <b>shape</b> pass down to every avatar. Give the group an <b>aria-label</b>.</p>
          <div className="sample-box stack">
            {(["sm", "md", "lg"] as const).map((size) => (
              <AvatarGroup key={size} size={size} max={4} aria-label="Reviewers">
                {people.map((name) => <Avatar key={name} name={name} />)}
              </AvatarGroup>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={avatarProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Always pass the real name, even with an image — it is the accessible name and the fallback.", "Use square for anything that isn't a person."]}
            donts={["Use a generic name like \"avatar\" or \"user\".", "Show status without a way to read it elsewhere when it matters."]}
          />
        </div>
      </section>

      {/* ============ SEPARATOR ============ */}
      <section className="component-doc" id="separator">
        <h1>Separator</h1>
        <p className="dek">A thin line between groups of content. Decorative weight: prefer space, and reach for a line only when space alone doesn't separate.</p>

        <div className="example-box">
          <Stack gap="md" style={{ width: 320 }}>
            <Button intent="neutral" appearance="outline" fullWidth>Continue with Google</Button>
            <Separator label="or" />
            <Button fullWidth>Continue with email</Button>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Tone</h2>
          <p className="lead"><b>subtle</b> (<b>border.subtle</b>) is the default; <b>default</b> (<b>border.default</b>) is for lines that must hold up on a surface. Neither is a control boundary, so neither has a contrast minimum.</p>
          <div className="sample-box stack">
            <Separator />
            <Separator tone="default" />
          </div>
        </div>

        <div className="doc-section">
          <h2>Orientation and label</h2>
          <p className="lead"><b>vertical</b> stretches to the height of its row. A <b>label</b> sits in the middle in <b>body-sm</b>, secondary, and becomes the separator's accessible name.</p>
          <div className="sample-box">
            <Stack direction="horizontal" gap="md" align="center" style={{ height: 32 }}>
              <Text as="span">Docs</Text>
              <Separator orientation="vertical" />
              <Text as="span">Pricing</Text>
              <Separator orientation="vertical" />
              <Text as="span">Blog</Text>
            </Stack>
            <Separator label="Continue with" style={{ flex: 1 }} />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={separatorProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use it between groups, not between every item.", "Keep labels to a word or two."]}
            donts={["Use it as a page-section border — use Section tones.", "Stack a separator against a card or box edge."]}
          />
        </div>
      </section>

      {/* ============ ACCORDION ============ */}
      <section className="component-doc" id="accordion">
        <h1>Accordion</h1>
        <p className="dek">Collapsible sections for FAQs and details. Behaviour comes from React Aria: each trigger is a button inside a heading, linked to its panel, and closed panels are still found by the browser's find-in-page.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Accordion defaultValue="refund" style={{ maxWidth: 560, margin: "0 auto" }}>
            {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
          </Accordion>
        </div>

        <div className="doc-section">
          <h2>Appearance</h2>
          <p className="lead"><b>plain</b> is dividers between items. <b>bordered</b> is one box with <b>radius.card</b>, only its outer corners rounded. <b>separated</b> is a surface card per item. Hover tints the trigger toward the text color; the chevron turns in <b>motion.normal</b>. The panel height is not animated, so the page below never slides.</p>
          <div className="sample-box demo-on-page stack">
            {(["plain", "bordered", "separated"] as const).map((appearance) => (
              <Stack key={appearance} gap="xs" style={{ width: "100%", maxWidth: 560 }}>
                <Text variant="code" tone="secondary">{appearance}</Text>
                <Accordion appearance={appearance}>
                  {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
                </Accordion>
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Type and collapsible</h2>
          <p className="lead"><b>single</b> keeps one item open. With <b>collapsible</b> false the open item can't be closed, only replaced — its trigger stays focusable and is marked <b>aria-disabled</b>. <b>multiple</b> lets any number stay open.</p>
          <div className="sample-box demo-on-page stack">
            <Stack gap="xs" style={{ width: "100%", maxWidth: 560 }}>
              <Text variant="code" tone="secondary">single, collapsible=false</Text>
              <Accordion collapsible={false} defaultValue="refund">
                {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
              </Accordion>
            </Stack>
            <Stack gap="xs" style={{ width: "100%", maxWidth: 560 }}>
              <Text variant="code" tone="secondary">multiple</Text>
              <Accordion type="multiple" appearance="separated" defaultValue={["refund", "seats"]}>
                {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
                <AccordionItem value="sso" title="Is SSO available? (disabled)" disabled>On the Enterprise plan.</AccordionItem>
              </Accordion>
            </Stack>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={accordionProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Set headingLevel so triggers fit the page outline.", "Write titles as the question or topic, so they scan."]}
            donts={["Hide content everyone needs — critical information belongs on the page.", "Nest accordions."]}
          />
        </div>
      </section>
    </div>
  );
}
