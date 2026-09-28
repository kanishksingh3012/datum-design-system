import { Link } from "@datum-design/react";
import { A11y, Demo } from "./kit";

export default function LinkDoc() {
  return (
    <>
    <section className="component-doc" id="link">
      <h1>Link</h1>
      <p className="dek">Inline and standalone navigation — a real &lt;a&gt;, so keyboard and screen reader behavior come free. Use Link to go somewhere; use Button (with <span className="prop-values">render</span> if it must be an anchor) to do something.</p>

      <Demo box="example">
        <p style={{ margin: 0 }}>Read our <Link href="#link">privacy policy</Link> before continuing.</p>
      </Demo>

      <div className="doc-section">
        <h2>Tone</h2>
        <p className="lead"><b>accent</b> for most links, <b>neutral</b> for quieter ones (it turns accent on hover), <b>inherit</b> to take the surrounding text color, e.g. inside an alert.</p>
        <Demo>
          <Link href="#link">Accent</Link>
          <Link href="#link" tone="neutral">Neutral</Link>
          <span style={{ color: "var(--color-text-danger)" }}>Payment failed. <Link href="#link" tone="inherit">Update card</Link></span>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Underline</h2>
        <p className="lead">Links in running text keep <b>always</b>, so they aren't told apart by color alone. <b>hover</b> and <b>none</b> are for standalone links such as navigation and footers. Hover thickens the underline instead of dimming the text.</p>
        <Demo>
          <Link href="#link" underline="always">Always</Link>
          <Link href="#link" underline="hover">Hover only</Link>
          <Link href="#link" underline="none">No underline</Link>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>External</h2>
        <p className="lead">Opens in a new tab with <b>rel="noopener noreferrer"</b>, adds an arrow, and tells screen readers "opens in a new tab".</p>
        <Demo>
          <Link href="https://www.w3.org/WAI/standards-guidelines/wcag/" external>WCAG guidelines</Link>
          <Link href="https://github.com" external tone="neutral" underline="hover">GitHub</Link>
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Sizes</h2>
        <p className="lead">Defaults to <b>inherit</b>, matching the surrounding text. <b>sm</b> and <b>md</b> set the body-sm / body-md roles for standalone links.</p>
        <Demo>
          <Link href="#link" size="sm" underline="hover">Small link</Link>
          <Link href="#link" size="md" underline="hover">Medium link</Link>
        </Demo>
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
      <A11y items={[
          ["Tab", "Moves focus to the link."],
          ["Enter", "Follows it."],
          ["external", "Opens in a new tab with rel=\"noopener noreferrer\" and says so to screen readers."],
          ["Text", "Write link text that makes sense out of context; avoid \"click here\"."],
        ]} />
    </section>
    </>
  );
}
