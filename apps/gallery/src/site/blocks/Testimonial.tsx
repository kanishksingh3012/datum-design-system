import { Avatar, Container, Section, Stack, Text } from "@datum-design/react";

export default function Testimonial() {
  return (
    <Section>
      <Container size="sm" padded>
        <Stack gap="md" align="center" style={{ textAlign: "center" }}>
          <Text as="p" variant="paragraph-lg">
            “We moved planning, specs and releases into Loomwork. Our Monday sync went from an hour to fifteen minutes.”
          </Text>
          <Stack direction="horizontal" gap="sm" align="center" style={{ textAlign: "start" }}>
            <Avatar name="Priya Raman" />
            <Stack gap="none">
              <Text weight="semibold">Priya Raman</Text>
              <Text variant="caption" tone="secondary">Head of product, Fernhill Labs</Text>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
