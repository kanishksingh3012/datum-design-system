import { Badge, Button, Card, CardBody, CardFooter, CardHeader, CardMedia, Heading, Link, Text } from "@datum-design/react";
import { A11y, Demo, PropRow, PropsTable, Usage } from "./kit";

const cardProps: PropRow[] = [
  ["appearance", "elevated | outline | soft", "elevated", "Surface shadow / border only / surface fill."],
  ["padding", "sm | md | lg", "md", "16 / 24 / 32px."],
  ["interactive", "boolean", "false", "Whole card is clickable: an <a> with href, a <button> without. Hover lift, press, focus ring."],
  ["href", "string", "—", "With interactive, makes the card a link."],
  ["render", "(props) => ReactElement", "—", "With interactive, render as a router Link."],
  ["slots", "CardMedia · CardHeader · CardBody · CardFooter", "—", "Media bleeds to the edges; the body grows; the footer sits at the bottom."],
];

export default function CardDoc() {
  return (
    <>
    <section className="component-doc" id="card">
      <h1>Card</h1>
      <p className="dek">A container for one piece of grouped content: a plan, an article, a person. Compose it from four optional slots — <span className="prop-values">CardMedia</span>, <span className="prop-values">CardHeader</span>, <span className="prop-values">CardBody</span>, <span className="prop-values">CardFooter</span>.</p>

      <Demo box="example">
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
      </Demo>

      <div className="doc-section">
        <h2>Appearance</h2>
        <p className="lead"><b>elevated</b> lifts off the page with the surface shadow. <b>outline</b> is a border and no fill, for dense grids. <b>soft</b> is the surface fill alone, for cards on a busy page. All use <b>radius.card</b> (20px). A filled card inside a filled card steps up to the raised fill; in light it also draws a border (both fills are white), in dark only the outer card is outlined.</p>
        <Demo className="demo-on-page">
          {(["elevated", "outline", "soft"] as const).map((appearance) => (
            <Card key={appearance} appearance={appearance} style={{ width: 200 }}>
              <Heading level={3} size="sm">{appearance}</Heading>
              <Text variant="body-sm" tone="secondary">Card content</Text>
            </Card>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Padding</h2>
        <p className="lead"><b>sm</b> 16, <b>md</b> 24, <b>lg</b> 32px. Media in the first or last slot bleeds to the edges whatever the padding.</p>
        <Demo>
          {(["sm", "md", "lg"] as const).map((padding) => (
            <Card key={padding} appearance="outline" padding={padding}>
              <Text variant="code" tone="secondary">{padding}</Text>
            </Card>
          ))}
        </Demo>
      </div>

      <div className="doc-section">
        <h2>Interactive</h2>
        <p className="lead">The whole card is one target: an <b>&lt;a&gt;</b> with <b>href</b>, a <b>&lt;button&gt;</b> without, or your router link via <b>render</b>. It lifts 2px and takes the raised shadow on hover, scales to 0.98 on press, and shows the focus ring from the keyboard. A clickable outline card uses <b>border.strong</b> so its edge reaches 3:1. Put no other controls inside.</p>
        <Demo className="demo-on-page">
          {(["elevated", "outline", "soft"] as const).map((appearance) => (
            <Card key={appearance} appearance={appearance} interactive href="#card" style={{ width: 200 }}>
              <Heading level={3} size="sm">Read the guide</Heading>
              <Text variant="body-sm" tone="secondary">{`${appearance}, links to #card`}</Text>
            </Card>
          ))}
        </Demo>
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
      <A11y items={[
          ["Semantics", "A plain container. When the whole card is a link, put the link on the title and let it cover the card, so there's one tab stop."],
          ["Headings", "Card titles should fit the page's heading order."],
        ]} />
    </section>

    </>
  );
}
