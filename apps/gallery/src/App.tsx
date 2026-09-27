import { useState } from "react";
import { Button, ButtonGroup, Link } from "@datum-design/react";
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
    </div>
  );
}
