import {
  Avatar, Badge, Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Grid, Heading, Link, ProgressBar, Separator, Stack,
  Text, TextField,
} from "@datum-design/react";
import { Check } from "lucide-react";
import { Demo } from "./docs/kit";

function Block({ id, title, text, children }: { id: string; title: string; text: string; children: React.ReactNode }) {
  return (
    <section className="site-block" id={id}>
      <Stack gap="xs">
        <Heading level={2} size="md">{title}</Heading>
        <Text as="p" tone="secondary">{text}</Text>
      </Stack>
      <Demo box="example" style={{ display: "block" }}>{children}</Demo>
    </section>
  );
}

export function Blocks() {
  return (
    <div className="site-blocks">
      <Stack gap="sm" className="site-section-head">
        <Text variant="overline" tone="accent">Blocks</Text>
        <Heading level={1} size="xl">Page sections, built from Datum components</Heading>
        <Text as="p" variant="body-lg" tone="secondary">
          Copy a block's code, drop it into your page and change the words. Every block follows the active theme and mode.
        </Text>
      </Stack>

      <Block id="hero" title="Hero" text="A centered headline with a primary and a secondary action.">
        <Stack gap="md" align="center" className="block-hero">
          <Badge intent="accent" appearance="soft">Now in beta</Badge>
          <Heading level={2} size="display-sm">Plan, track and ship in one place</Heading>
          <Text as="p" variant="body-lg" tone="secondary">The workspace for teams that would rather build than coordinate.</Text>
          <Stack direction="horizontal" gap="sm" justify="center" wrap>
            <Button size="lg">Start free</Button>
            <Button size="lg" intent="neutral" appearance="outline">Book a demo</Button>
          </Stack>
        </Stack>
      </Block>

      <Block id="pricing" title="Pricing" text="Three plans side by side; the recommended one is raised and marked.">
        <Grid columns={{ base: 1, md: 3 }} gap="md">
          {[
            { name: "Starter", price: "$0", note: "For trying things out", perks: ["3 projects", "Community support"], pick: false },
            { name: "Team", price: "$24", note: "Per member, per month", perks: ["Unlimited projects", "Shared themes", "Priority support"], pick: true },
            { name: "Enterprise", price: "Custom", note: "For large organizations", perks: ["SSO and audit log", "Dedicated manager"], pick: false },
          ].map((p) => (
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
                      <Check aria-hidden className="block-check" />
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
      </Block>

      <Block id="sign-in" title="Sign in" text="A compact form card with a remember-me option and a link to sign up.">
        <Card appearance="outline" className="block-narrow">
          <CardHeader>
            <Stack gap="xs">
              <Heading level={3} size="md">Welcome back</Heading>
              <Text variant="body-sm" tone="secondary">Sign in to continue to your workspace.</Text>
            </Stack>
          </CardHeader>
          <CardBody>
            <Stack gap="md">
              <TextField label="Email" type="email" placeholder="name@company.com" />
              <TextField label="Password" type="password" />
              <Checkbox label="Remember me" />
            </Stack>
          </CardBody>
          <CardFooter>
            <Stack gap="sm">
              <Button fullWidth>Sign in</Button>
              <Text variant="body-sm" tone="secondary">No account? <Link href="#sign-in">Create one</Link></Text>
            </Stack>
          </CardFooter>
        </Card>
      </Block>

      <Block id="stats" title="Dashboard stats" text="Key figures with their change and progress toward a goal.">
        <Grid columns={{ base: 1, md: 3 }} gap="md">
          {[
            { label: "Active users", value: "12,480", change: "+8.1%", goal: 64 },
            { label: "Conversion", value: "3.9%", change: "+0.6%", goal: 78 },
            { label: "Churn", value: "1.2%", change: "−0.3%", goal: 40 },
          ].map((s) => (
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
      </Block>

      <Block id="testimonial" title="Testimonial" text="A quote with the person behind it.">
        <Stack gap="md" align="center" className="block-quote">
          <Text as="p" variant="paragraph-lg">
            “We replaced three internal libraries with Datum. Theming a new product now takes an afternoon, not a sprint.”
          </Text>
          <Stack direction="horizontal" gap="sm" align="center">
            <Avatar name="Priya Raman" />
            <Stack gap="none">
              <Text weight="semibold">Priya Raman</Text>
              <Text variant="caption" tone="secondary">Design lead, Northwind</Text>
            </Stack>
          </Stack>
        </Stack>
      </Block>
    </div>
  );
}
