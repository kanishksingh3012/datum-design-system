import { type ReactNode } from "react";
import { Navbar, Sheet, Sidebar, SidebarSection, Text } from "@datum-design/react";
import { Folder, Globe, Home, Inbox, Search } from "lucide-react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const sidebarSections: SidebarSection[] = [
  { links: [{ label: "Home", href: "#sidebar", icon: <Home /> }, { label: "Inbox", href: "#inbox", icon: <Inbox />, badge: 12 }, { label: "Search", href: "#search", icon: <Search /> }] },
  { title: "Projects", links: [{ label: "Datum", href: "#datum", icon: <Folder /> }, { label: "Website", href: "#website", icon: <Globe /> }] },
];
const sections = ["Overview", "Activity", "Settings"];
const sidebarProps: PropRow[] = [
  ["sections", "{ title?, links }[]", "—", "Links: label, href, icon, badge, active. The current page is a dark pill in both modes, with its icon in the accent."],
  ["appearance", "floating | flush", "floating", "floating is a rounded card set in from the page edge; flush runs edge to edge with a hairline on the right."],
  ["activeHref", "string", "—", "The link holding it gets aria-current=\"page\"."],
  ["label", "string", "Sidebar", "Names the navigation and the mobile menu."],
  ["header / footer", "ReactNode", "—", "A logo, an account row. The header stays in the mobile bar."],
  ["size", "sm | md", "md", "240 / 288px wide."],
  ["mobileBreakpoint", "sm | md | lg", "md", "Below it: a bar with a menu button that opens a Sheet."],
  ["open / defaultOpen / onOpenChange", "boolean", "false", "The mobile menu."],
];

export default function SidebarDoc() {
  return (
    <>
    <section className="component-doc" id="sidebar">
      <h1>Sidebar</h1>
      <p className="dek">App navigation down the side of a page: grouped links, a header and a footer, in a floating rounded panel. The current page is a dark pill in light and dark mode alike, with its icon in the accent; the other rows stay secondary until hovered. Below <b>mobileBreakpoint</b> it folds into a bar with a menu button that opens the same links in a Sheet, like the Navbar.</p>

      <Demo box="example" style={{ display: "block" }}>
        <Sidebar sections={sidebarSections} activeHref="#inbox" label="Workspace" header={<b>Acme Inc.</b>} footer={<Text>Ada Lovelace</Text>} style={{ height: 420, margin: "0 auto" }} />
      </Demo>

      <div className="doc-section">
        <h2>Appearances</h2>
        <p className="lead"><b>floating</b> (the default) draws the panel as a card; the page layout supplies the gap around it. <b>flush</b> runs edge to edge with a hairline on the right, for layouts where the sidebar is part of the frame.</p>
        <Demo>
          <Sidebar sections={sidebarSections} activeHref="#inbox" label="Floating" size="sm" style={{ height: 300 }} />
          <Sidebar sections={sidebarSections} activeHref="#datum" label="Flush" size="sm" appearance="flush" style={{ height: 300 }} />
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={sidebarProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Group links under short titles.", "Keep the header in the bar on small screens.", "Give every link an icon, or none of them.", "Leave a gap between a floating sidebar and the page edge."]}
          donts={["Nest more than one level.", "Use it for a marketing site — use a Navbar."]}
        />
      </div>
      <A11y items={[
          ["Semantics", "A navigation landmark named by label; the active link has aria-current=\"page\" and is marked by its fill and weight, not color alone."],
          ["Small screens", "Below the breakpoint it becomes a Sheet opened from a menu button; Escape closes it."],
        ]} />
    </section>
    </>
  );
}
