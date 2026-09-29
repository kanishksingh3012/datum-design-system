import { Avatar, Card, CardBody, CardFooter, Container, Grid, Heading, Section, Stack, Text } from "@datum-design/react";

const quotes = [
  { quote: "Our roadmap used to be out of date the day we presented it. Now it's the first thing leadership opens.", name: "Priya Raman", role: "Head of product, Fernhill Labs" },
  { quote: "We cut two tools and a weekly meeting. Engineers update one task and everyone who cares sees it.", name: "Tomás Lindqvist", role: "Engineering manager, Quillstack" },
  { quote: "The early warnings are the feature. We moved a launch a week before it would have slipped, not after.", name: "Amara Osei", role: "COO, Brightmoor" },
];

export default function Testimonials() {
  return (
    <Section>
      <Container padded>
        <Stack gap="xl">
          <Stack gap="sm" align="center" style={{ textAlign: "center" }}>
            <Text variant="overline" tone="accent">Customers</Text>
            <Heading level={2} size="xl">Teams that stopped chasing status updates</Heading>
          </Stack>
          <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="md">
            {quotes.map((q) => (
              <Card key={q.name} appearance="outline">
                <CardBody>
                  <blockquote style={{ margin: 0 }}>
                    <Text as="p" variant="paragraph-md">“{q.quote}”</Text>
                  </blockquote>
                </CardBody>
                <CardFooter>
                  <Stack direction="horizontal" gap="sm" align="center">
                    <Avatar name={q.name} />
                    <Stack gap="none">
                      <Text weight="semibold">{q.name}</Text>
                      <Text variant="caption" tone="secondary">{q.role}</Text>
                    </Stack>
                  </Stack>
                </CardFooter>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
