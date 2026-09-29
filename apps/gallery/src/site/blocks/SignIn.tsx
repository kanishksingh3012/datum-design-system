import { Button, Card, CardBody, CardFooter, CardHeader, Checkbox, Container, Heading, Link, Section, Stack, Text, TextField } from "@datum-design/react";

export default function SignIn() {
  return (
    <Section>
      <Container size="sm" padded>
        <Card appearance="outline">
          <CardHeader>
            <Stack gap="xs">
              <Heading level={2} size="md">Welcome back</Heading>
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
              <Text variant="body-sm" tone="secondary">No account? <Link href="#sign-up">Create one</Link></Text>
            </Stack>
          </CardFooter>
        </Card>
      </Container>
    </Section>
  );
}
