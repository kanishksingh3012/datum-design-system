import { Container, Grid, Heading, Section, Stack, Text } from "@datum-design/react";
import { CalendarRange, GitBranch, LayoutList, MessagesSquare, Radar, ShieldCheck } from "lucide-react";

const features = [
  { icon: LayoutList, title: "One backlog", text: "Ideas, bugs and requests land in one list, ranked by the team that owns them." },
  { icon: CalendarRange, title: "Plans that move", text: "Drag a milestone and every dependent task shifts with it, with the owners told." },
  { icon: GitBranch, title: "Linked to your code", text: "Branches and pull requests update their task as they open, pass review and merge." },
  { icon: MessagesSquare, title: "Specs in context", text: "Write the spec next to the work, and keep the discussion on the paragraph it's about." },
  { icon: Radar, title: "Early warnings", text: "Loomwork flags a slipping milestone days before the date, not the morning of." },
  { icon: ShieldCheck, title: "Admin controls", text: "SSO, audit log and per-project permissions, on every paid plan." },
];

export default function FeatureGrid() {
  return (
    <Section>
      <Container padded>
        <Stack gap="xl">
          <Stack gap="sm">
            <Text variant="overline" tone="accent">Features</Text>
            <Heading level={2} size="xl">Everything between the idea and the release</Heading>
            <Text as="p" variant="body-lg" tone="secondary">Loomwork replaces the tracker, the roadmap deck and the status meeting.</Text>
          </Stack>
          <Grid columns={{ base: 1, md: 2, lg: 3 }} gap="lg">
            {features.map(({ icon: Icon, title, text }) => (
              <Stack key={title} gap="sm">
                <Stack
                  align="center"
                  justify="center"
                  style={{
                    alignSelf: "start",
                    padding: "var(--space-tight)",
                    borderRadius: "var(--radius-control)",
                    background: "var(--color-bg-accentSubtle)",
                    color: "var(--color-text-accent)",
                  }}
                >
                  <Icon aria-hidden size={20} />
                </Stack>
                <Heading level={3} size="sm">{title}</Heading>
                <Text as="p" tone="secondary">{text}</Text>
              </Stack>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
}
