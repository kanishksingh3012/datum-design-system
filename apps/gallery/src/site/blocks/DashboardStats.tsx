import { Badge, Card, CardBody, Container, Grid, ProgressBar, Section, Stack, Text } from "@datum-design/react";

const stats = [
  { label: "Active users", value: "12,480", change: "+8.1%", goal: 64 },
  { label: "Conversion", value: "3.9%", change: "+0.6%", goal: 78 },
  { label: "Churn", value: "1.2%", change: "−0.3%", goal: 40 },
];

export default function DashboardStats() {
  return (
    <Section spacing="sm">
      <Container padded>
        <Grid columns={{ base: 1, md: 3 }} gap="md">
          {stats.map((s) => (
            <Card key={s.label} appearance="outline" padding="sm">
              <CardBody>
                <Stack gap="sm">
                  <Stack direction="horizontal" justify="between" align="center">
                    <Text variant="label" tone="secondary">{s.label}</Text>
                    <Badge intent="success" appearance="soft" size="sm">{s.change}</Badge>
                  </Stack>
                  <Text variant="numeric-lg">{s.value}</Text>
                  <ProgressBar label="Toward goal" value={s.goal} size="sm" />
                </Stack>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
