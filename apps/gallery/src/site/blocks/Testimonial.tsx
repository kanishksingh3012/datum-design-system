import { Avatar, Container, Section, Stack, Text } from "@datum-design/react";

export default function Testimonial() {
  return (
    <Section>
      <Container size="sm" padded>
        <Stack gap="md" align="center" style={{ textAlign: "center" }}>
          <Text as="p" variant="paragraph-lg">
            “We replaced three internal libraries with Datum. Theming a new product now takes an afternoon, not a sprint.”
          </Text>
          <Stack direction="horizontal" gap="sm" align="center" style={{ textAlign: "start" }}>
            <Avatar name="Priya Raman" />
            <Stack gap="none">
              <Text weight="semibold">Priya Raman</Text>
              <Text variant="caption" tone="secondary">Design lead, Northwind</Text>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
