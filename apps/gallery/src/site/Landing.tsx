import { useState } from "react";
import {
  Alert, Avatar, AvatarGroup, Badge, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Checkbox, CodeBlock, Container,
  Grid, Heading, Message, MessageList, ProgressBar, Section, Stack, Switch, Tabs, Text, TextField,
} from "@datum-design/react";
import { Accessibility, ArrowRight, Bot, Palette, SwatchBook } from "lucide-react";

const install = "npm install @datum-design/react @datum-design/styles";

const features = [
  { icon: Accessibility, title: "Accessible by default", text: "Native elements and React Aria underneath: keyboard, focus and screen-reader behavior come built in." },
  { icon: Palette, title: "Two themes, one API", text: "Orange and navy share every token name. Switch with data-theme; light and dark follow color-scheme." },
  { icon: SwatchBook, title: "Tokens all the way down", text: "175 semantic tokens per theme. Components never reference a hex value, so your CSS can use the same ones." },
  { icon: Bot, title: "AI primitives", text: "Messages, reasoning, tool calls, sources and diffs for building chat and agent interfaces." },
];

const stats = ["66 components", "2 themes", "Light and dark", "WCAG AA pairs"];

function Showcase() {
  const [range, setRange] = useState("Week");
  return (
    <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="md" className="site-bento">
      <Card appearance="outline">
        <CardHeader><Heading level={3} size="sm">Notifications</Heading></CardHeader>
        <CardBody>
          <Stack gap="md">
            <Switch label="Product updates" description="A summary each Monday." defaultChecked />
            <Switch label="Mentions" description="When someone tags you." />
            <Switch label="Security alerts" defaultChecked />
          </Stack>
        </CardBody>
      </Card>

      <Card appearance="outline">
        <CardHeader>
          <Stack direction="horizontal" justify="between" align="center">
            <Heading level={3} size="sm">Revenue</Heading>
            <ButtonGroup attached size="sm" aria-label="Range">
              {["Day", "Week", "Month"].map((r) => (
                <Button key={r} pressed={range === r} onPressedChange={() => setRange(r)}>{r}</Button>
              ))}
            </ButtonGroup>
          </Stack>
        </CardHeader>
        <CardBody>
          <Stack gap="sm">
            <Text variant="numeric-lg">$48,210</Text>
            <Stack direction="horizontal" gap="sm" align="center">
              <Badge intent="success" appearance="soft" size="sm">+12.4%</Badge>
              <Text variant="caption" tone="secondary">vs last {range.toLowerCase()}</Text>
            </Stack>
            <ProgressBar label="Quarterly goal" value={72} showValue />
          </Stack>
        </CardBody>
      </Card>

      <Card appearance="outline">
        <CardHeader><Heading level={3} size="sm">Invite your team</Heading></CardHeader>
        <CardBody>
          <Stack gap="md">
            <AvatarGroup max={4} size="sm">
              {["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Linus Torvalds"].map((n) => <Avatar key={n} name={n} />)}
            </AvatarGroup>
            <TextField label="Email" placeholder="name@company.com" />
          </Stack>
        </CardBody>
        <CardFooter><Button fullWidth>Send invite</Button></CardFooter>
      </Card>

      <Card appearance="outline" className="site-span-2">
        <CardBody>
          <Tabs
            defaultValue="chat"
            items={[
              {
                value: "chat", label: "Assistant", content: (
                  <MessageList>
                    <Message author="user" name="You">Can Datum do dark mode?</Message>
                    <Message author="assistant" name="Datum">Yes. Every token uses light-dark(), so the same components follow color-scheme in both themes.</Message>
                  </MessageList>
                ),
              },
              {
                value: "code", label: "Code", content: (
                  <CodeBlock code={`<html data-theme="navy">\n  <Button intent="accent">Get started</Button>\n</html>`} language="tsx" copyable />
                ),
              },
            ]}
          />
        </CardBody>
      </Card>

      <Card appearance="outline">
        <CardHeader><Heading level={3} size="sm">Getting set up</Heading></CardHeader>
        <CardBody>
          <Stack gap="sm">
            <Checkbox label="Install the packages" defaultChecked />
            <Checkbox label="Import the stylesheets" defaultChecked />
            <Checkbox label="Pick a theme" />
            <Alert intent="info" title="Tip">Both themes ship in themes.css.</Alert>
          </Stack>
        </CardBody>
      </Card>
    </Grid>
  );
}

export function Landing() {
  return (
    <>
      <section className="site-hero">
        <Container size="lg">
          <Stack gap="lg" align="center" className="site-hero-inner">
            <a className="site-announce" href="/docs/components/message">
              <Badge intent="accent" size="sm">New</Badge>
              <span>AI primitives for chat and agent UIs</span>
              <ArrowRight aria-hidden />
            </a>
            <Heading level={1} size="display-lg" className="site-hero-title">
              Build interfaces that stay consistent in every theme.
            </Heading>
            <Text as="p" variant="body-lg" tone="secondary" className="site-hero-sub">
              Datum is an accessible React component library built on design tokens. Two themes, light and dark,
              switched with one attribute.
            </Text>
            <Stack direction="horizontal" gap="sm" justify="center" wrap>
              <Button size="lg" suffix={<ArrowRight />} render={(p) => <a {...p} href="/docs" />}>Get started</Button>
              <Button size="lg" intent="neutral" appearance="outline" render={(p) => <a {...p} href="/docs/components/button" />}>
                Browse components
              </Button>
            </Stack>
            <div className="site-install">
              <CodeBlock code={install} language="bash" lineNumbers={false} copyable />
            </div>
            <ul className="site-stats" aria-label="At a glance">
              {stats.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </Stack>
        </Container>
      </section>

      <Section spacing="md">
        <Container size="xl">
          <Showcase />
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="xl">
          <Stack gap="lg">
            <Stack gap="sm" className="site-section-head">
              <Text variant="overline" tone="accent">Why Datum</Text>
              <Heading level={2} size="xl">One set of rules, applied everywhere</Heading>
            </Stack>
            <Grid columns={{ base: 1, md: 2, lg: 4 }} gap="lg">
              {features.map(({ icon: Icon, title, text }) => (
                <Stack key={title} gap="sm" className="site-feature">
                  <span className="site-feature-icon"><Icon aria-hidden /></span>
                  <Heading level={3} size="sm">{title}</Heading>
                  <Text as="p" variant="body-sm" tone="secondary">{text}</Text>
                </Stack>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>

      <Section spacing="md">
        <Container size="xl">
          <div className="site-cta">
            <Stack gap="sm">
              <Heading level={2} size="lg">Start with a Button. Ship a design system.</Heading>
              <Text as="p" tone="secondary">Every component page has live demos, the code behind them, props and keyboard notes.</Text>
            </Stack>
            <Stack direction="horizontal" gap="sm" wrap>
              <Button suffix={<ArrowRight />} render={(p) => <a {...p} href="/docs" />}>Read the docs</Button>
              <Button intent="neutral" appearance="outline" render={(p) => <a {...p} href="/blocks" />}>See blocks</Button>
            </Stack>
          </div>
        </Container>
      </Section>
    </>
  );
}
