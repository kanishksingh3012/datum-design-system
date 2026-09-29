import { Button, Container, Heading, Section, Stack, Text } from "@datum-design/react";

export default function CtaBand() {
  return (
    <Section tone="accent">
      <Container padded>
        <Stack direction="horizontal" justify="between" align="center" gap="lg" wrap>
          <Stack gap="xs" style={{ flex: "1 1 auto" }}>
            <Heading level={2} size="lg">Bring your next release into Loomwork</Heading>
            <Text as="p" tone="secondary">Free for up to 10 people. Import from your current tracker in minutes.</Text>
          </Stack>
          <Stack direction="horizontal" gap="sm" wrap>
            <Button size="lg">Start free</Button>
            <Button size="lg" intent="neutral" appearance="outline">Talk to sales</Button>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
