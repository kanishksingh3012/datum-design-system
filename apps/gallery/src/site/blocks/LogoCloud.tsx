import { Container, Grid, Section, Stack, Text } from "@datum-design/react";
import { Feather, Hexagon, Leaf, Mountain, Package, Triangle } from "lucide-react";

const teams = [
  { name: "Fernhill Labs", icon: Leaf },
  { name: "Quillstack", icon: Feather },
  { name: "Brightmoor", icon: Mountain },
  { name: "Tessellate", icon: Hexagon },
  { name: "Parcelwise", icon: Package },
  { name: "Oakvale", icon: Triangle },
];

export default function LogoCloud() {
  return (
    <Section spacing="sm">
      <Container padded>
        <Stack gap="lg" style={{ textAlign: "center" }}>
          <Text as="p" variant="label" tone="secondary">Trusted by 2,000+ product teams</Text>
          <Grid columns={{ base: 2, md: 3, lg: 6 }} gap="lg">
            {teams.map(({ name, icon: Icon }) => (
              <Stack key={name} direction="horizontal" gap="xs" align="center" justify="center" style={{ color: "var(--color-text-secondary)" }}>
                <Icon aria-hidden size={20} />
                <Text weight="semibold" tone="secondary">{name}</Text>
              </Stack>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
