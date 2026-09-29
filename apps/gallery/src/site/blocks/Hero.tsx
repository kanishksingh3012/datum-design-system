import { Badge, Button, Container, Heading, Section, Stack, Text } from "@datum-design/react";

export default function Hero() {
  return (
    <Section spacing="lg">
      <Container size="md" padded>
        <Stack gap="md" align="center" style={{ textAlign: "center" }}>
          <Badge intent="accent" appearance="soft">Now in beta</Badge>
          <Heading level={1} size="display-sm">Plan, track and ship in one place</Heading>
          <Text as="p" variant="body-lg" tone="secondary">The workspace for teams that would rather build than coordinate.</Text>
          <Stack direction="horizontal" gap="sm" justify="center" wrap>
            <Button size="lg">Start free</Button>
            <Button size="lg" intent="neutral" appearance="outline">Book a demo</Button>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
