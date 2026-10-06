import { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, CodeBlock, Heading, Stack, Tabs, Text } from "@datum-design/react";
import { Monitor, Smartphone, Tablet } from "lucide-react";

// Each block is one file in ./blocks with a default export and no props: the Code tab shows that file as-is.
const sources = import.meta.glob<string>("./blocks/*.tsx", { query: "?raw", import: "default", eager: true });
const fileOf = (name: string) => `./blocks/${name}.tsx`;

const groups: { title: string; blocks: [name: string, title: string, purpose: string][] }[] = [
  {
    title: "Marketing",
    blocks: [
      ["Hero", "Hero", "A centered headline with a primary and a secondary action."],
      ["LogoCloud", "Logo cloud", "Customer wordmarks under a one-line trust statement."],
      ["FeatureGrid", "Feature grid", "Six features with an icon each, three across on wide screens."],
      ["FeatureSplit", "Feature split", "One feature told in text beside a product mock drawn from components."],
      ["Stats", "Stats", "Four headline numbers on a muted band."],
      ["CtaBand", "Call to action band", "A closing pitch with two actions on an accent band."],
    ],
  },
  {
    title: "Pricing & contact",
    blocks: [
      ["Pricing", "Pricing", "Three plans side by side; the recommended one is raised and marked."],
      ["Faq", "FAQ", "Common questions in an accordion, with a route to support."],
    ],
  },
  {
    title: "Content",
    blocks: [
      ["Testimonial", "Testimonial", "A single quote with the person behind it."],
      ["Testimonials", "Testimonials", "Three customer quotes in cards."],
    ],
  },
  {
    title: "App shells",
    blocks: [
      ["SignIn", "Sign in", "A compact form card with a remember-me option and a link to sign up."],
      ["DashboardStats", "Dashboard stats", "Key figures with their change and progress toward a goal."],
    ],
  },
];

const widths = [
  { label: "Desktop", px: 1280, icon: <Monitor /> },
  { label: "Tablet", px: 768, icon: <Tablet /> },
  { label: "Mobile", px: 390, icon: <Smartphone /> },
];

/**
 * The block in an iframe, so its media queries respond to the frame's width, not the docs page's.
 * Desktop fills the preview (never narrower than 1024px); Tablet and Mobile are fixed device widths.
 */
function Frame({ name, width }: { name: string; width: number }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(360);
  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;
    const attach = () => {
      const body = frame.contentDocument?.body;
      if (!body) return;
      observer?.disconnect();
      observer = new ResizeObserver(() => setHeight(Math.ceil(body.getBoundingClientRect().height)));
      observer.observe(body);
    };
    frame.addEventListener("load", attach);
    attach();
    return () => {
      frame.removeEventListener("load", attach);
      observer?.disconnect();
    };
  }, []);
  return (
    <div className="block-viewport">
      <iframe ref={ref} src={`${import.meta.env.BASE_URL}block.html?name=${name}`} title={`${name} preview`} data-fill={width === 1280 || undefined} style={{ width: width === 1280 ? "100%" : width, height }} />
    </div>
  );
}

function Block({ name, title, purpose }: { name: string; title: string; purpose: string }) {
  const [width, setWidth] = useState(1280);
  return (
    <section className="site-block" id={name.toLowerCase()}>
      <Stack direction="horizontal" justify="between" align="end" gap="md" wrap>
        <Stack gap="xs">
          <Heading level={3} size="md">{title}</Heading>
          <Text as="p" tone="secondary">{purpose}</Text>
        </Stack>
        <ButtonGroup size="sm" intent="neutral" appearance="outline" aria-label={`${title} preview width`}>
          {widths.map((w) => (
            <Button key={w.px} prefix={w.icon} pressed={width === w.px} onPressedChange={() => setWidth(w.px)}>
              {w.label}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>
      <Tabs
        size="sm"
        defaultValue="preview"
        items={[
          { value: "preview", label: "Preview", content: <Frame name={name} width={width} /> },
          { value: "code", label: "Code", content: <CodeBlock code={sources[fileOf(name)] ?? ""} language="tsx" copyable /> },
        ]}
      />
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
          Each block is one file that imports only @datum-design/react and lucide-react. Copy it into your project and change the words. Every block follows the active theme and mode.
        </Text>
      </Stack>
      {groups.map((g) => (
        <Stack key={g.title} gap="lg">
          <Heading level={2} size="lg">{g.title}</Heading>
          {g.blocks.map(([name, title, purpose]) => (
            <Block key={name} name={name} title={title} purpose={purpose} />
          ))}
        </Stack>
      ))}
    </div>
  );
}
