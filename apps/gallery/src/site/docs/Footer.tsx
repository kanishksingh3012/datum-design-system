import { type ReactNode } from "react";
import { Container, Footer, Link, Navbar } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const footerColumns = [
  { title: "Product", links: [{ label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }, { label: "Docs", href: "#" }] },
  { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }] },
];
const footerProps: PropRow[] = [
  ["columns", "{ title, links: { label, href }[] }[]", "—", "One column per group; they wrap on narrow screens."],
  ["bottom", "ReactNode", "—", "Legal, copyright, social."],
  ["tone", "default | muted", "muted", "muted sits on bg.surface; default on the page with a hairline above."],
  ["maxWidth", "Container size", "xl", "Match the Navbar's maxWidth so both line up with the page."],
  ["children", "ReactNode", "—", "The lead column: a logo and a line about the site."],
];

export default function FooterDoc() {
  return (
    <>
    <section className="component-doc" id="footer">
      <h1>Footer</h1>
      <p className="dek">
        The site footer: a lead column, groups of links (a heading and a named list each, in a Footer{" "}
        <span className="prop-values">nav</span>) and a bottom row for legal and social.
      </p>

      <Demo box="example" style={{ display: "block", padding: 0, overflow: "hidden" }}>
        <Footer columns={footerColumns} bottom={<><span>© 2026 Datum</span><Link href="#footer">Status</Link></>}>
          <strong style={{ color: "var(--color-text-primary)" }}>Datum</strong>
          <p>Components for building websites, in orange and navy.</p>
        </Footer>
      </Demo>

      <div className="doc-section">
        <h2>Tones</h2>
        <p className="lead"><b>muted</b> (the default) sits on bg.surface; <b>default</b> stays on the page with a hairline above.</p>
        <Demo className="stack" style={{ padding: 0, overflow: "hidden" }}>
          <Footer tone="default" bottom={<span>© 2026 Datum</span>} columns={footerColumns.slice(0, 2)} />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={footerProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Keep columns to five links or so.", "Repeat the important links from the Navbar."]}
          donts={["Put a third text color in the footer — step down a type role instead.", "Hide the only path to a page in the footer."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "Renders a contentinfo landmark; each link column is a labelled list."],
        ]} />
    </section>

    </>
  );
}
