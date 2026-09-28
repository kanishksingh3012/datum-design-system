import { useState } from "react";
import { Button, Link, Spinner } from "@datum-design/react";
import { ArrowRight, Bold, Italic, MoreHorizontal, Plus, Search, Star, Trash2, Underline, X } from "lucide-react";
import { A11y, Demo } from "./kit";

const appearances = ["solid", "soft", "outline", "ghost"] as const;
const intents = ["accent", "neutral", "danger"] as const;
const buttonProps: [string, string, string, string][] = [
  ["intent", "accent | neutral | danger", "accent", "What the color means. neutral + solid is the ink button."],
  ["appearance", "solid | soft | outline | ghost", "solid", "How much fill."],
  ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."],
  ["prefix / suffix", "ReactNode", "—", "Icon or element before / after the label."],
  ["iconOnly", "boolean", "false", "Circular; requires label."],
  ["label", "string", "—", "Accessible name; required with iconOnly."],
  ["loading", "boolean", "false", "Spinner over the label, no size change; blocks clicks, keeps focus, sets aria-busy."],
  ["disabled", "boolean", "false", "Native disabled."],
  ["pressed / defaultPressed / onPressedChange", "boolean / boolean / (pressed) => void", "—", "Toggle mode via aria-pressed; on = the solid of its intent. pressed is controlled, defaultPressed uncontrolled."],
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

export default function ButtonDoc() {
  const [pressed, setPressed] = useState(false);
  return (
    <>
    <section className="component-doc" id="button">
      <h1>Button</h1>
      <p className="dek">
        The core action. Three props decide how it looks: <span className="prop-values">intent</span> is what the color
        means, <span className="prop-values">appearance</span> is how much fill, and <span className="prop-values">size</span>{" "}
        is how tall. Always a pill. Icon-only, toggle and floating are modes of the same component.
      </p>

      <Demo box="example">
        <Button>Get started</Button>
        <Button intent="neutral" appearance="outline">Learn more</Button>
      </Demo>

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
        <Demo>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Prefix and suffix</h2>
        <Demo>
          <Button intent="neutral" appearance="soft" prefix={<Search />}>Search</Button>
          <Button suffix={<ArrowRight />}>Continue</Button>
          <Button intent="danger" appearance="outline" prefix={<Trash2 />}>Delete</Button>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>States</h2>
        <p className="lead">
          Default, hover (the fill changes to its hover token), focus (a <b>border.focus</b> ring — press Tab to see it), pressed, disabled and loading. Loading swaps the
          prefix for a spinner and blocks clicks but keeps focus, so a submit button doesn't drop the keyboard user.
        </p>
        <Demo>
          <Button disabled>Disabled</Button>
          <Button intent="neutral" appearance="outline" disabled>Disabled</Button>
          <Button loading>Saving</Button>
          <Button intent="neutral" appearance="soft" loading>Loading</Button>
          <Button intent="neutral" appearance="outline" pressed={false} onPressedChange={() => {}}>Not pressed</Button>
          <Button intent="neutral" appearance="outline" pressed onPressedChange={() => {}}>Pressed</Button>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Full width</h2>
        <Demo className="stack">
          <Button fullWidth size="lg">Create account</Button>
          <Button fullWidth intent="neutral" appearance="outline" size="lg">Sign in</Button>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Render as a link</h2>
        <p className="lead">Use <b>render</b> when the action navigates, so it is a real anchor (or your router's Link).</p>
        <Demo>
          <Button appearance="soft" suffix={<ArrowRight />} render={(props) => <a href="#link" {...props} />}>
            Read the docs
          </Button>
        </Demo>
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
        <Demo className="column" style={{ padding: 0, border: "none", background: "none", gap: 0 }}>
          {legacy.map(([from, to]) => (
            <div className="variant-row" key={from}>
              <span className="name">{from}</span>
              <span className="desc">{to}</span>
            </div>
          ))}
        </Demo>
      </div>
    </section>

    <section className="component-doc" id="icon-only">
      <h1>Icon-only</h1>
      <p className="dek">Same Button, <span className="prop-values">iconOnly</span> set — no separate Icon Button component. Always requires <span className="prop-values">label</span>, since there's no visible text to fall back on.</p>

      <Demo box="example">
        <Button iconOnly label="Search" intent="neutral" appearance="ghost"><Search /></Button>
      </Demo>

      <div className="doc-section">
        <h2>Appearances &amp; sizes</h2>
        <Demo>
          <Button iconOnly label="More" intent="neutral" appearance="ghost" size="sm"><MoreHorizontal /></Button>
          <Button iconOnly label="More" intent="neutral" appearance="outline"><MoreHorizontal /></Button>
          <Button iconOnly label="Add" intent="neutral"><Plus /></Button>
          <Button iconOnly label="Next" size="lg"><ArrowRight /></Button>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Common use: dismiss controls</h2>
        <p className="lead">A neutral, ghost, sm, icon-only Button with an X glyph covers toasts, modals, and dialogs.</p>
        <Demo>
          <Button iconOnly label="Close" intent="neutral" appearance="ghost" size="sm"><X /></Button>
        </Demo>
      </div>
    </section>

    <section className="component-doc" id="toggle">
      <h1>Toggle</h1>
      <p className="dek">Same Button, with <span className="prop-values">pressed</span> or <span className="prop-values">defaultPressed</span> — a persistent on/off state exposed via aria-pressed. When on, it takes the solid treatment of its own intent: neutral turns ink, accent turns accent.</p>

      <Demo box="example">
        <Button pressed={pressed} onPressedChange={setPressed} intent="neutral" appearance="outline" prefix={<Star />}>
          Favorite
        </Button>
      </Demo>

      <div className="doc-section">
        <h2>Off / on</h2>
        <Demo>
          <Button intent="neutral" appearance="outline" pressed={false} onPressedChange={() => {}}>Off</Button>
          <Button intent="neutral" appearance="outline" pressed onPressedChange={() => {}}>On</Button>
          <Button appearance="soft" pressed={false} onPressedChange={() => {}}>Off</Button>
          <Button appearance="soft" pressed onPressedChange={() => {}}>On</Button>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Controlled or uncontrolled</h2>
        <p className="lead">Like every piece of state in Datum, it comes as a trio. <b>pressed</b> + <b>onPressedChange</b>: you hold the state (the Favorite button above). <b>defaultPressed</b>: the button holds it and starts where you say; <b>onPressedChange</b> still reports each change. These formatting toggles are uncontrolled — Bold starts on.</p>
        <Demo>
          <Button iconOnly label="Bold" intent="neutral" appearance="ghost" defaultPressed><Bold /></Button>
          <Button iconOnly label="Italic" intent="neutral" appearance="ghost" defaultPressed={false}><Italic /></Button>
          <Button iconOnly label="Underline" intent="neutral" appearance="ghost" defaultPressed={false}><Underline /></Button>
        </Demo>
      </div>
    </section>

    <section className="component-doc" id="floating">
      <h1>Floating (FAB)</h1>
      <p className="dek">Same Button, <span className="prop-values">floating</span> set — the single most important action on a screen, floats above content and stays reachable while scrolling.</p>

      <Demo box="example">
        <Button floating iconOnly label="New project"><Plus /></Button>
      </Demo>

      <div className="doc-section">
        <h2>Icon-only vs. extended</h2>
        <Demo>
          <Button floating iconOnly label="New project"><Plus /></Button>
          <Button floating prefix={<Plus />}>New project</Button>
          <Button floating intent="neutral" prefix={<Plus />}>New project</Button>
        </Demo>
      </div>
      <A11y items={[
          ["Tab", "Moves focus to the button; the focus ring uses border.focus."],
          ["Enter / Space", "Activates it. A toggle flips aria-pressed."],
          ["Loading", "Sets aria-busy and blocks clicks but keeps focus, so keyboard users don't lose their place."],
          ["Icon-only", "Needs label, which becomes the accessible name."],
        ]} />
    </section>

    </>
  );
}
