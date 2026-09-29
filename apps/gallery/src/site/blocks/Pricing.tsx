import { Badge, Button, Card, CardBody, CardFooter, CardHeader, Container, Grid, Heading, Section, Separator, Stack, Text } from "@datum-design/react";
import { Check } from "lucide-react";

const plans = [
  { name: "Starter", price: "$0", note: "For trying things out", perks: ["3 projects", "Community support"], pick: false },
  { name: "Team", price: "$24", note: "Per member, per month", perks: ["Unlimited projects", "Shared themes", "Priority support"], pick: true },
  { name: "Enterprise", price: "Custom", note: "For large organizations", perks: ["SSO and audit log", "Dedicated manager"], pick: false },
];

export default function Pricing() {
  return (
    <Section>
      <Container padded>
        <Grid columns={{ base: 1, md: 3 }} gap="md">
          {plans.map((p) => (
            <Card key={p.name} appearance={p.pick ? "elevated" : "outline"}>
              <CardHeader>
                <Stack direction="horizontal" justify="between" align="center">
                  <Heading level={3} size="sm">{p.name}</Heading>
                  {p.pick && <Badge intent="accent" size="sm">Popular</Badge>}
                </Stack>
              </CardHeader>
              <CardBody>
                <Stack gap="sm">
                  <Text variant="numeric-lg">{p.price}</Text>
                  <Text variant="caption" tone="secondary">{p.note}</Text>
                  <Separator />
                  {p.perks.map((perk) => (
                    <Stack key={perk} direction="horizontal" gap="sm" align="center">
                      <Check aria-hidden size={16} style={{ flex: "none", color: "var(--color-text-accent)" }} />
                      <Text variant="body-sm">{perk}</Text>
                    </Stack>
                  ))}
                </Stack>
              </CardBody>
              <CardFooter>
                <Button fullWidth intent={p.pick ? "accent" : "neutral"} appearance={p.pick ? "solid" : "outline"}>Choose {p.name}</Button>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
