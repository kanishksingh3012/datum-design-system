import { Container, Grid, Heading, Section, Stack, Text } from "@datum-design/react";

const stats = [
  { value: "2,000+", label: "product teams plan in Loomwork" },
  { value: "38%", label: "fewer status meetings after one quarter" },
  { value: "4.8 / 5", label: "average rating from admins" },
  { value: "99.95%", label: "uptime over the last twelve months" },
];

export default function Stats() {
  return (
    <Section tone="muted">
      <Container padded>
        <Stack gap="xl">
          <Heading level={2} size="lg">Teams ship more when the plan is honest</Heading>
          <Grid columns={{ base: 1, md: 2, lg: 4 }} gap="lg">
            {stats.map((s) => (
              <Stack key={s.value} gap="xs">
                <Text variant="numeric-lg" tone="accent">{s.value}</Text>
                <Text as="p" tone="secondary">{s.label}</Text>
              </Stack>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
