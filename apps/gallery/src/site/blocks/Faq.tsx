import { Accordion, AccordionItem, Container, Heading, Link, Section, Stack, Text } from "@datum-design/react";

const questions = [
  { q: "Can we import from our current tracker?", a: "Yes. Loomwork imports projects, tasks, comments and attachments from CSV and from most trackers' export files. Owners and statuses are matched by name." },
  { q: "What counts as a member on the Team plan?", a: "Anyone who can edit. People you invite to view a shared roadmap or leave comments are free and don't count toward your seats." },
  { q: "Is there a free trial of the paid plans?", a: "Every new workspace gets the Team plan free for 14 days, with no card required. When it ends you choose a plan or stay on Starter." },
  { q: "Where is our data stored?", a: "In the EU or the US, chosen when the workspace is created. Data is encrypted at rest and in transit, and backups are kept for 30 days." },
  { q: "Can we cancel at any time?", a: "Yes. Paid plans are billed monthly or yearly, and you can export everything before you cancel." },
];

export default function Faq() {
  return (
    <Section>
      <Container size="md" padded>
        <Stack gap="xl">
          <Stack gap="sm">
            <Heading level={2} size="xl">Questions, answered</Heading>
            <Text as="p" tone="secondary">
              Can't find what you need? <Link href="#contact" underline="always">Contact support</Link> and a person will reply within a day.
            </Text>
          </Stack>
          <Accordion type="multiple" appearance="separated" headingLevel={3}>
            {questions.map((item) => (
              <AccordionItem key={item.q} value={item.q} title={item.q}>
                <Text as="p" tone="secondary">{item.a}</Text>
              </AccordionItem>
            ))}
          </Accordion>
        </Stack>
      </Container>
    </Section>
  );
}
