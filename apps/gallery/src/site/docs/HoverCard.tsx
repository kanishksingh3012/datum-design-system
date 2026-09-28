import { Avatar, HoverCard, Link, Text, Tooltip } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const openStateRows: PropRow[] = [
  ["open", "boolean", "—", "Controlled open state. Pair with onOpenChange."],
  ["defaultOpen", "boolean", "false", "Uncontrolled starting state."],
  ["onOpenChange", "(open) => void", "—", "Called on every open and close, from any cause."],
];
const hoverCardProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "Required. A focusable element it previews, usually a Link."],
  ["placement", "top | right | bottom | left", "bottom", "Flips when there is no room."],
  ["openDelay / closeDelay", "number (ms)", "500 / 300", "The close delay is time to move onto the card, which keeps it open."],
  ...openStateRows,
];

export default function HoverCardDoc() {
  return (
    <>
    <section className="component-doc" id="hover-card">
      <h1>Hover Card</h1>
      <p className="dek">A preview on hover (after 500ms) or keyboard focus — a profile, a page summary. It stays open while the pointer is on the trigger or the card; Escape closes it. Unlike a Tooltip it can hold links, but it is supplementary: never the one way to reach something.</p>

      <Demo box="example">
        <Text>
          Written by{" "}
          <HoverCard trigger={<Link href="#hover-card">Ada Lovelace</Link>}>
            <div style={{ display: "flex", gap: "var(--space-compact)", alignItems: "center" }}>
              <Avatar name="Ada Lovelace" />
              <strong>Ada Lovelace</strong>
            </div>
            <span>Mathematician, and the first to publish an algorithm for a machine.</span>
            <Link href="#hover-card">View profile</Link>
          </HoverCard>
          , 1843.
        </Text>
      </Demo>

      <div className="doc-section">
        <h2>Properties</h2>
        <PropsTable rows={hoverCardProps} />
      </div>

      <div className="doc-section">
        <h2>Usage guidelines</h2>
        <Usage
          dos={["Preview what the link leads to.", "Keep the same content reachable by following the trigger."]}
          donts={["Put the only way to an action in it — touch screens have no hover.", "Use for a short hint on a control — use a Tooltip."]}
        />
      </div>
      <A11y items={[
          ["Focus / hover", "Opens on hover or when the trigger gets keyboard focus."],
          ["Content", "Supplementary only; everything in it must also be reachable elsewhere, e.g. on the linked page."],
        ]} />
    </section>

    </>
  );
}
