import { useState } from "react";
import { Button, ButtonGroup, Link } from "@datum-design/react";
import { Search, Plus, Star, MoreHorizontal, ArrowRight, X } from "lucide-react";

export function App() {
  const [pressed, setPressed] = useState(false);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "orange");

  function switchTheme(next: string) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }

  return (
    <div className="doc">
      <div className="theme-switch" role="group" aria-label="Theme">
        {["orange", "navy"].map((t) => (
          <button key={t} type="button" aria-pressed={theme === t} onClick={() => switchTheme(t)}>
            {t}
          </button>
        ))}
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
        <p className="dek">A single, unified button component — icon-only, toggle, and floating (FAB) are all modes of the same component, not separate ones. Eight variants, full keyboard/loading/disabled support.</p>

        <div className="example-box">
          <Button variant="primary">Save changes</Button>
        </div>

        <div className="doc-section">
          <h2>Composition</h2>
          <p className="lead">A Button consists of:</p>
          <ul>
            <li><b>Label</b> — the action text, passed as children. The only content when <span className="prop-values">iconOnly</span> is not set.</li>
            <li><b>Prefix</b> — optional, icon or element displayed before the label.</li>
            <li><b>Suffix</b> — optional, icon or element displayed after the label.</li>
          </ul>
          <p className="lead">Prefix and suffix together:</p>
          <div className="sample-box">
            <Button prefix={<Search style={{ width: 16, height: 16 }} />}>Search</Button>
            <Button suffix={<ArrowRight style={{ width: 16, height: 16 }} />}>Continue</Button>
            <Button prefix={<Search style={{ width: 16, height: 16 }} />} suffix={<ArrowRight style={{ width: 16, height: 16 }} />}>Both</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">Buttons are available in three sizes. Size controls height, padding, and text size while preserving the same structure.</p>
          <div className="sample-box">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <p className="lead">Button exposes the following properties:</p>
          <ul>
            <li><b>variant</b><span className="prop-values">primary | secondary | tertiary | outline | text | link | danger | danger-soft</span></li>
            <li><b>size</b><span className="prop-values">sm | md | lg</span></li>
            <li><b>loading</b><span className="prop-values">boolean — implies disabled, replaces prefix with a spinner, hides suffix, sets aria-busy</span></li>
            <li><b>prefix</b> / <b>suffix</b><span className="prop-values">ReactNode — icon or element before/after the label</span></li>
            <li><b>disabled</b><span className="prop-values">boolean</span></li>
            <li><b>iconOnly</b><span className="prop-values">boolean — circular, icon-only. Requires label.</span></li>
            <li><b>label</b><span className="prop-values">string — accessible name, required when iconOnly</span></li>
            <li><b>pressed</b> / <b>onPressedChange</b><span className="prop-values">makes this a toggle button, exposed via aria-pressed</span></li>
            <li><b>floating</b><span className="prop-values">boolean — FAB treatment: bigger, elevated, circular or wide pill</span></li>
            <li><b>render</b><span className="prop-values">(props) =&gt; ReactElement — renders a different element (e.g. an anchor) in Button's place</span></li>
          </ul>
        </div>

        <div className="doc-section">
          <h2>States</h2>
          <ul>
            <li>Default</li>
            <li>Hover</li>
            <li>Focus</li>
            <li>Pressed (toggle mode)</li>
            <li>Disabled</li>
            <li>Loading</li>
          </ul>
          <p className="lead">Focus state includes a visible focus ring for accessibility.</p>
          <div className="sample-box">
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Variants</h2>
          <div className="sample-box column" style={{ padding: 0, border: "none", background: "none", gap: 0 }}>
            <div className="variant-row">
              <span className="name">Primary</span>
              <span className="desc">The main call to action. Use for the most important action in a view.</span>
              <span className="sample"><Button variant="primary" size="sm">Primary</Button></span>
            </div>
            <div className="variant-row">
              <span className="name">Secondary</span>
              <span className="desc">A medium-emphasis alternative to the primary action — a soft tint of the accent color, not a competing fill.</span>
              <span className="sample"><Button variant="secondary" size="sm">Secondary</Button></span>
            </div>
            <div className="variant-row">
              <span className="name">Tertiary</span>
              <span className="desc">Minimal-emphasis filled button, typically used alongside primary or secondary actions.</span>
              <span className="sample"><Button variant="tertiary" size="sm">Tertiary</Button></span>
            </div>
            <div className="variant-row">
              <span className="name">Outline</span>
              <span className="desc">A bordered button used when you need emphasis without a filled background.</span>
              <span className="sample"><Button variant="outline" size="sm">Outline</Button></span>
            </div>
            <div className="variant-row">
              <span className="name">Text</span>
              <span className="desc">No background or border, for the most subtle actions.</span>
              <span className="sample"><Button variant="text" size="sm">Text</Button></span>
            </div>
            <div className="variant-row">
              <span className="name">Link</span>
              <span className="desc">Underlined, accent-colored — styled like an inline hyperlink rather than a button.</span>
              <span className="sample"><Button variant="link" size="sm">Link</Button></span>
            </div>
            <div className="variant-row">
              <span className="name">Danger</span>
              <span className="desc">Used for destructive or irreversible actions.</span>
              <span className="sample"><Button variant="danger" size="sm">Danger</Button></span>
            </div>
            <div className="variant-row">
              <span className="name">Danger soft</span>
              <span className="desc">A lower-emphasis destructive action, used when caution is required but urgency is lower.</span>
              <span className="sample"><Button variant="danger-soft" size="sm">Danger soft</Button></span>
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Usage Guidelines</h2>
          <div className="usage-grid">
            <div>
              <h3>Do</h3>
              <ul>
                <li>Use one primary or danger button per view region.</li>
                <li>Keep size consistent within a region.</li>
                <li>Treat loading as implicitly disabled.</li>
              </ul>
            </div>
            <div>
              <h3>Don't</h3>
              <ul>
                <li>Use multiple primary buttons in one region.</li>
                <li>Rely on color alone for danger — label the action too.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ICON-ONLY ============ */}
      <section className="component-doc" id="icon-only">
        <h1>Icon-only</h1>
        <p className="dek">Same Button, <span className="prop-values">iconOnly</span> set — no separate Icon Button component. Always requires <span className="prop-values">label</span>, since there's no visible text to fall back on.</p>

        <div className="example-box">
          <Button iconOnly label="Search" variant="text"><Search /></Button>
        </div>

        <div className="doc-section">
          <h2>Variants &amp; sizes</h2>
          <div className="sample-box">
            <Button iconOnly label="More" variant="text" size="sm"><MoreHorizontal /></Button>
            <Button iconOnly label="More" variant="outline"><MoreHorizontal /></Button>
            <Button iconOnly label="Next" variant="primary" size="lg"><ArrowRight /></Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Common use: dismiss controls</h2>
          <p className="lead">A text-variant, sm, icon-only Button with an X glyph covers toasts, modals, and dialogs.</p>
          <div className="sample-box">
            <Button iconOnly label="Close" variant="text" size="sm"><X /></Button>
          </div>
        </div>
      </section>

      {/* ============ TOGGLE ============ */}
      <section className="component-doc" id="toggle">
        <h1>Toggle</h1>
        <p className="dek">Same Button, with <span className="prop-values">pressed</span> + <span className="prop-values">onPressedChange</span> — a persistent on/off state exposed via aria-pressed. Pressed always renders filled-accent, regardless of variant.</p>

        <div className="example-box">
          <Button pressed={pressed} onPressedChange={setPressed} variant="outline" prefix={<Star style={{ width: 16, height: 16 }} />}>
            Favorite
          </Button>
        </div>

        <div className="doc-section">
          <h2>Off / on</h2>
          <div className="sample-box">
            <Button variant="outline" pressed={false} onPressedChange={() => {}}>Off</Button>
            <Button variant="outline" pressed onPressedChange={() => {}}>On</Button>
            <Button variant="outline" pressed={false} onPressedChange={() => {}} size="sm">Small</Button>
            <Button variant="outline" pressed={false} onPressedChange={() => {}} size="lg">Large</Button>
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
            <Button floating label="New project" prefix={<Plus style={{ width: 20, height: 20 }} />}>New project</Button>
          </div>
        </div>
      </section>

      {/* ============ BUTTON GROUP ============ */}
      <section className="component-doc" id="button-group">
        <h1>Button Group</h1>
        <p className="dek">Visually merges adjacent Buttons into one segmented control. The only member of the family that stays its own component — it wraps multiple buttons, a different shape of problem than a single Button's props can express.</p>

        <div className="example-box">
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="primary">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <ul>
            <li><b>orientation</b><span className="prop-values">horizontal | vertical</span></li>
          </ul>
        </div>

        <div className="doc-section">
          <h2>Vertical</h2>
          <div className="sample-box">
            <ButtonGroup orientation="vertical">
              <Button variant="outline">Day</Button>
              <Button variant="primary">Week</Button>
              <Button variant="outline">Month</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* ============ LINK ============ */}
      <section className="component-doc" id="link">
        <h1>Link</h1>
        <p className="dek">A styled anchor. A real &lt;a&gt; element — keyboard and screen reader behavior come free. Stays its own component — Button renders a &lt;button&gt;, Link renders a real &lt;a&gt;, and that's a real semantic difference worth keeping.</p>

        <div className="example-box">
          <p style={{ margin: 0, fontSize: 15 }}>Read our <Link href="#">privacy policy</Link> before continuing.</p>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <ul>
            <li><b>underline</b><span className="prop-values">always | hover | none</span></li>
            <li><b>decorationStyle</b><span className="prop-values">solid | dotted | dashed</span></li>
          </ul>
        </div>

        <div className="doc-section">
          <h2>Underline</h2>
          <div className="sample-box">
            <Link href="#" underline="always">Always</Link>
            <Link href="#" underline="hover">Hover only</Link>
            <Link href="#" underline="none">No underline</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
