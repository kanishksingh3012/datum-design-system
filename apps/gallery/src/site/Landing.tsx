import { useState } from "react";
import {
  Alert, Badge, Button, ButtonGroup, Card, CardBody, CardHeader, CodeBlock, Container, Grid, Heading, Link, Section,
  Stack, Switch, Text, TextField,
} from "@datum-design/react";
import { ArrowRight } from "lucide-react";

const install = "npm install @datum-design/react @datum-design/styles";

export function Landing() {
  const [range, setRange] = useState("Week");
  return (
    <>
      <Section spacing="lg">
        <Container size="md">
          <Stack gap="lg" align="start">
            <Badge intent="accent">Open source · React</Badge>
            <Heading level={1} size="display-md">A design system with two themes and one set of rules.</Heading>
            <Text as="p" variant="body-lg" tone="secondary">
              Datum is a React component library built on design tokens: accessible components, orange and navy themes,
              light and dark modes, all switched with one attribute.
            </Text>
            <Stack direction="horizontal" gap="sm" wrap>
              <Button size="lg" suffix={<ArrowRight />} render={(p) => <a {...p} href="/docs" />}>Get started</Button>
              <Button size="lg" intent="neutral" appearance="outline" render={(p) => <a {...p} href="/docs/components/button" />}>
                Browse components
              </Button>
            </Stack>
            <div className="site-install">
              <CodeBlock code={install} language="bash" copyable />
            </div>
          </Stack>
        </Container>
      </Section>
      <Section spacing="md" tone="muted">
        <Container size="lg">
          <Stack gap="lg">
            <Heading level={2}>Live, not screenshots</Heading>
            <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="md">
              <Card>
                <CardHeader title="Actions" />
                <CardBody>
                  <Stack gap="md" align="start">
                    <ButtonGroup attached aria-label="Range">
                      {["Day", "Week", "Month"].map((r) => (
                        <Button key={r} pressed={range === r} onPressedChange={() => setRange(r)}>{r}</Button>
                      ))}
                    </ButtonGroup>
                    <Stack direction="horizontal" gap="sm" wrap>
                      <Button>Save</Button>
                      <Button appearance="soft">Draft</Button>
                      <Button intent="danger" appearance="ghost">Delete</Button>
                    </Stack>
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Forms" />
                <CardBody>
                  <Stack gap="md">
                    <TextField label="Email" placeholder="you@example.com" />
                    <Switch label="Email me updates" defaultChecked />
                  </Stack>
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Feedback" />
                <CardBody>
                  <Stack gap="md">
                    <Alert intent="success" title="Deployed">Your changes are live.</Alert>
                    <Text as="p" tone="secondary">
                      See every component in the <Link href="/docs/components/button">docs</Link>.
                    </Text>
                  </Stack>
                </CardBody>
              </Card>
            </Grid>
          </Stack>
        </Container>
      </Section>
    </>
  );
}
