import { Alert, CodeBlock, Heading, Link, Stack, Text } from "@datum-design/react";

const usage = `import { Button } from "@datum-design/react";
import "@datum-design/react/styles.css";
import "@datum-design/styles/themes.css";

function App() {
  return <Button intent="accent" appearance="solid">Get started</Button>;
}`;

export function GettingStarted() {
  return (
    <Stack gap="lg" className="site-doc">
      <Stack gap="sm">
        <Text variant="overline" tone="secondary">Getting started</Text>
        <Heading level={1}>Introduction</Heading>
        <Text as="p" variant="body-lg" tone="secondary">
          Datum is a React component library for building websites. It ships two themes as a set, orange and navy,
          that share one base of type, spacing, radius and motion, and both work in light and dark mode.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Install</Heading>
        <CodeBlock code="npm install @datum-design/react @datum-design/styles" language="bash" copyable />
        <Text as="p" tone="secondary">
          <code>react</code> and <code>react-dom</code> (18 or later) are peer dependencies; install them if your project
          doesn't have them yet.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Use a component</Heading>
        <Text as="p">Import the two stylesheets once, near your app's root, then use any component.</Text>
        <CodeBlock code={usage} language="tsx" copyable />
        <Text as="p" tone="secondary">
          <code>@datum-design/styles/themes.css</code> holds the design tokens for both themes as CSS custom properties.
          <code> @datum-design/react/styles.css</code> holds the components' own styles, which only reference those tokens.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Pick a theme</Heading>
        <Text as="p">Set <code>data-theme</code> on <code>&lt;html&gt;</code>. Light and dark follow the page's <code>color-scheme</code>.</Text>
        <CodeBlock code={`<html data-theme="orange"> <!-- or data-theme="navy" -->`} language="html" copyable />
        <Text as="p" tone="secondary">
          To ship only one theme, import <code>@datum-design/styles/orange.css</code> or <code>@datum-design/styles/navy.css</code> instead
          of <code>themes.css</code>. <Link href="/docs/theming">Theming</Link> covers the tokens in detail.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>What's included</Heading>
        <Text as="p">
          Layout, typography, actions, content, feedback, forms, overlays, navigation and data components, plus a set of AI
          chat primitives (Message, ToolCall, Reasoning, CodeBlock and more). Accessibility comes from native elements and
          React Aria, and every component is tested with Vitest and React Testing Library.
        </Text>
        <Alert intent="info" title="Start with Button">
          Every component page has live demos with their code, a props table, usage guidance and keyboard notes.{" "}
          <Link href="/docs/components/button">Open the Button docs</Link>.
        </Alert>
      </Stack>
    </Stack>
  );
}
