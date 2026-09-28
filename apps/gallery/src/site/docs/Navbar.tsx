import { type ReactNode } from "react";
import { Button, Container, Link, Navbar, NavbarAppearance, NavbarLayout, NavbarLink, Sheet } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const navbarLayouts: NavbarLayout[] = ["standard", "start", "centered"];
const navLinks: NavbarLink[] = [
  { label: "Product", href: "#product" },
  { label: "Docs", href: "#docs", badge: "New" },
  { label: "Resources", items: [{ label: "Blog", href: "#blog" }, { label: "Guides", href: "#guides" }, { label: "Changelog", href: "#changelog" }] },
  {
    label: "Solutions",
    columns: [
      { title: "By team", items: [{ label: "Design", href: "#design", description: "Tokens, themes and a gallery" }, { label: "Engineering", href: "#eng", description: "React components on React Aria" }] },
      { title: "By site", items: [{ label: "Marketing", href: "#marketing", description: "Heroes, pricing, footers" }, { label: "Docs", href: "#docs-sites", description: "Navigation that scales" }] },
    ],
  },
];
const DemoNavbar = (props: Partial<Parameters<typeof Navbar>[0]>) => (
  <Navbar
    position="static"
    links={navLinks}
    activeHref="#docs"
    maxWidth="full"
    logo={<a href="#navbar">Datum</a>}
    actions={<><Button intent="neutral" appearance="ghost" size="sm">Sign in</Button><Button size="sm">Get started</Button></>}
    {...props}
  />
);
const navbarAppearances: NavbarAppearance[] = ["solid", "blur", "transparent", "inverse"];
const navbarProps: PropRow[] = [
  ["layout", "standard | start | centered", "standard", "Logo left, links center / logo and links left / logo in the middle."],
  ["appearance", "solid | blur | transparent | inverse", "solid", "transparent turns solid on scroll; inverse is an ink band."],
  ["position", "static | sticky | fixed", "sticky", ""],
  ["hideOnScroll", "boolean", "false", "Slides away scrolling down, returns scrolling up or on focus."],
  ["size", "compact | default", "default", "56 / 72px tall."],
  ["bordered", "boolean", "true", "Hairline under the bar."],
  ["links", "{ label, href, icon, badge, active, items, columns }[]", "—", "items opens a dropdown; columns opens a mega menu with descriptions."],
  ["activeHref", "string", "—", "Marks the current page (and the menu holding it) with aria-current."],
  ["logo / search / actions / announcement", "ReactNode", "—", "announcement is a thin bar above the navbar."],
  ["mobileBreakpoint", "sm | md | lg", "md", "Below 640 / 768 / 1024px the links move into a Sheet with accordion groups."],
  ["maxWidth", "Container size", "xl", "Keeps the bar aligned with page content."],
  ["open / defaultOpen / onOpenChange", "boolean / boolean / (open) => void", "—", "The mobile menu."],
];

export default function NavbarDoc() {
  return (
    <>
    <section className="component-doc" id="navbar">
      <h1>Navbar</h1>
      <p className="dek">
        One site header for every website layout. Built from Container, Button, DropdownMenu and Sheet, so it inherits their keyboard
        and focus behavior. A link can open a dropdown or a mega menu; below the breakpoint, links move into a Sheet with accordion
        groups. Replaces Header, Nav and NavigationMenu.
      </p>

      <Demo box="example" style={{ display: "block", padding: 0 }}>
        <DemoNavbar announcement={<>Datum 2 is out. <Link href="#navbar">Read the notes</Link></>} />
      </Demo>

      <div className="doc-section">
        <h2>Layouts</h2>
        <p className="lead"><b>standard</b>: logo left, links center, actions right · <b>start</b>: logo and links left · <b>centered</b>: logo in the middle.</p>
        <Demo className="stack">
          {navbarLayouts.map((layout) => <DemoNavbar key={layout} layout={layout} size="compact" />)}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Appearances</h2>
        <p className="lead"><b>solid</b> and <b>blur</b> (translucent, blurring the page behind) for most sites; <b>transparent</b> sits over a hero and turns solid once the page scrolls; <b>inverse</b> is an ink band that re-points the text and focus tokens, so the Buttons inside follow.</p>
        <Demo className="stack">
          {navbarAppearances.map((appearance) => <DemoNavbar key={appearance} appearance={appearance} size="compact" layout="start" />)}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Menus</h2>
        <p className="lead">Give a link <b>items</b> for a dropdown (Resources), or <b>columns</b> for a mega menu with descriptions (Solutions). Both are React Aria menus of real links: arrow keys, typeahead, Escape.</p>
      </div>

      <div className="doc-section">
        <h2>Mobile</h2>
        <p className="lead">Below <b>mobileBreakpoint</b> (640 / 768 / 1024px) the links fold into a Sheet: plain links as rows, menus as accordions, with the one holding the current page open. Narrow the window to see it.</p>
        <Demo>
          <DemoNavbar mobileBreakpoint="lg" style={{ width: "100%" }} />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={navbarProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Keep five to seven top-level links.", "Use one accent action; the rest ghost.", "Set maxWidth to match the page's Container."]}
          donts={["Use transparent where the hero behind it can't hold the text's contrast.", "Nest menus inside menus.", "Use hideOnScroll on a short page."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "A navigation landmark; the active link has aria-current=\"page\"."],
          ["Menus", "Links with items open a DropdownMenu: arrow keys move, Escape closes."],
          ["Small screens", "Below the breakpoint the links move into a Sheet with focus trapped while it's open."],
        ]} />
    </section>

    </>
  );
}
