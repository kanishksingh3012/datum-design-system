import { Badge, Button, Card, CardBody, Container, Grid, Heading, ProgressBar, Section, Stack, Text } from "@datum-design/react";
import { ArrowRight, Check } from "lucide-react";

const points = ["Milestones roll up from real task status", "Share a live roadmap link instead of a deck", "See which team is blocked, and on what"];
const milestones = [
  { name: "Offline mode", status: "On track", intent: "success", done: 72 },
  { name: "Billing v2", status: "At risk", intent: "warning", done: 41 },
  { name: "Search revamp", status: "Shipped", intent: "neutral", done: 100 },
] as const;

export default function FeatureSplit() {
  return (
    <Section>
      <Container padded>
        <Grid columns={{ base: 1, md: 2 }} gap="xl" style={{ alignItems: "center" }}>
          <Stack gap="md">
            <Text variant="overline" tone="accent">Roadmaps</Text>
            <Heading level={2} size="xl">A roadmap that updates itself</Heading>
            <Text as="p" variant="body-lg" tone="secondary">
              Loomwork builds the roadmap from the work itself, so the plan leadership sees is the plan the team is running.
            </Text>
            <Stack gap="sm">
              {points.map((point) => (
                <Stack key={point} direction="horizontal" gap="sm" align="center">
                  <Check aria-hidden size={16} style={{ flex: "none", color: "var(--color-text-accent)" }} />
                  <Text>{point}</Text>
                </Stack>
              ))}
            </Stack>
            <Stack direction="horizontal">
              <Button intent="neutral" appearance="outline" suffix={<ArrowRight aria-hidden />}>See roadmaps</Button>
            </Stack>
          </Stack>

          {/* the "image": a product mock drawn with components, so it follows the theme */}
          <Card appearance="soft" padding="lg" role="img" aria-label="Loomwork roadmap with three milestones and their progress">
            <CardBody>
              <Stack gap="sm">
                {milestones.map((m) => (
                  <Card key={m.name} appearance="elevated" padding="sm">
                    <CardBody>
                      <Stack gap="sm">
                        <Stack direction="horizontal" justify="between" align="center" gap="sm">
                          <Text weight="semibold">{m.name}</Text>
                          <Badge intent={m.intent} appearance="soft" size="sm">{m.status}</Badge>
                        </Stack>
                        <ProgressBar label={`${m.name} progress`} value={m.done} size="sm" />
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
              </Stack>
            </CardBody>
          </Card>
        </Grid>
      </Container>
    </Section>
  );
}
