import type { ReactNode } from "react";
import { Button, ButtonGroup, Container, Grid, Heading, Link, Section, Stack, Text } from "@datum-design/react";
import { AlignCenter, AlignLeft, AlignRight, Plus } from "lucide-react";

const intents = ["accent", "neutral", "danger"] as const;
const appearances = ["solid", "soft", "outline", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;
const noop = () => {};
const headingSizes = ["display-lg", "display-md", "display-sm", "xl", "lg", "md", "sm"] as const;
const textVariants = [
  "body-lg", "body-md", "body-sm", "paragraph-lg", "paragraph-md", "label",
  "caption", "overline", "numeric-lg", "numeric-md", "numeric-sm", "code",
] as const;
const textTones = ["primary", "secondary", "accent", "danger", "success", "warning"] as const;
const box = { background: "var(--color-bg-surface)", padding: "var(--space-compact)" };

/** Every state the combo checker renders, keyed by component name. */
export const fixtures: Record<string, () => ReactNode> = {
  Container: () => (
    <>
      {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
        <Container key={size} size={size} style={box}>
          <Text data-check-text>{`Container ${size}`}</Text>
        </Container>
      ))}
      <Container padded={false} style={box}>
        <Text data-check-text>Container without gutter</Text>
      </Container>
    </>
  ),
  Stack: () => (
    <>
      {(["none", "xs", "sm", "md", "lg", "xl"] as const).map((gap) => (
        <Stack key={gap} direction="horizontal" gap={gap} align="center" wrap>
          <Text data-check-text>{`gap ${gap}`}</Text>
          <Button size="sm">One</Button>
          <Button size="sm" intent="neutral" appearance="outline">Two</Button>
        </Stack>
      ))}
      <Stack justify="between" direction="horizontal" align="baseline">
        <Heading level={3} data-check-text>Between</Heading>
        <Text variant="caption" tone="secondary" data-check-text>baseline</Text>
      </Stack>
    </>
  ),
  Grid: () => (
    <>
      <Grid columns={{ base: 1, md: 2, lg: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Text key={i} style={box} data-check-text>{`Cell ${i}`}</Text>
        ))}
      </Grid>
      <Grid minItemWidth={200} gap="lg">
        {[1, 2, 3].map((i) => (
          <Text key={i} style={box} data-check-text>{`Auto-fit ${i}`}</Text>
        ))}
      </Grid>
    </>
  ),
  Section: () => (
    <>
      {(["default", "muted", "accent"] as const).map((tone) => (
        <Section key={tone} tone={tone} spacing="sm">
          <Container>
            <Stack gap="sm">
              <Text variant="overline" tone="accent" data-check-text>{`${tone} tone`}</Text>
              <Heading data-check-text>A section heading</Heading>
              <Text tone="secondary" data-check-text>Secondary text on this band.</Text>
              <Stack direction="horizontal" gap="sm">
                <Button>Primary</Button>
                <Button intent="neutral" appearance="outline">Secondary</Button>
                <Link href="#check">A link</Link>
              </Stack>
            </Stack>
          </Container>
        </Section>
      ))}
    </>
  ),
  Heading: () => (
    <>
      {headingSizes.map((size) => (
        <Heading key={size} size={size} data-check-text>{`Heading ${size}`}</Heading>
      ))}
      {(["secondary", "accent"] as const).map((tone) =>
        (["display-sm", "sm"] as const).map((size) => (
          <Heading key={`${tone}-${size}`} size={size} tone={tone} data-check-text>{`${tone} ${size}`}</Heading>
        ))
      )}
    </>
  ),
  Text: () => (
    <>
      {textVariants.map((variant) => (
        <Stack key={variant} direction="horizontal" gap="md" wrap>
          {textTones.map((tone) => (
            <Text key={tone} variant={variant} tone={tone} data-check-text>{`${variant} ${tone}`}</Text>
          ))}
        </Stack>
      ))}
      <div style={box}>
        {textTones.map((tone) => (
          <Text key={tone} variant="body-sm" tone={tone} data-check-text>{`${tone} on surface`}</Text>
        ))}
      </div>
      <Text truncate style={{ maxWidth: 200 }} data-check-text>A single line that is far too long to fit</Text>
      <Text truncate={2} style={{ maxWidth: 200 }} data-check-text>Two lines at most, then an ellipsis cuts off whatever is left over here.</Text>
    </>
  ),
  Button: () => (
    <>
      {intents.map((intent) =>
        appearances.map((appearance) => (
          <div className="row" key={`${intent}-${appearance}`}>
            {sizes.map((size) => (
              <Button key={size} intent={intent} appearance={appearance} size={size}>
                {`${intent} ${appearance} ${size}`}
              </Button>
            ))}
            <Button intent={intent} appearance={appearance} iconOnly label={`${intent} ${appearance} icon`}>
              <Plus />
            </Button>
            <Button intent={intent} appearance={appearance} loading>
              Loading
            </Button>
            <Button intent={intent} appearance={appearance} pressed={false} onPressedChange={noop}>
              Off
            </Button>
            <Button intent={intent} appearance={appearance} pressed onPressedChange={noop}>
              On
            </Button>
            <Button intent={intent} appearance={appearance} disabled>
              Disabled
            </Button>
          </div>
        ))
      )}
      <div className="row">
        <Button floating iconOnly label="Floating icon">
          <Plus />
        </Button>
        <Button floating prefix={<Plus />}>
          Floating
        </Button>
        <Button intent="neutral" floating>
          Floating ink
        </Button>
      </div>
      <div className="row">
        <Button fullWidth>Full width</Button>
      </div>
      <div className="row">
        <Button render={(props) => <a href="#check" {...props} />}>Rendered as link</Button>
      </div>
    </>
  ),
  ButtonGroup: () => (
    <>
      {(["horizontal", "vertical", "on-surface"] as const).map((variant) => {
        const orientation = variant === "vertical" ? "vertical" : "horizontal";
        return (
        <div className="row" key={variant} style={variant === "on-surface" ? { background: "var(--color-bg-surface)" } : undefined}>
          {sizes.map((size) => (
            <ButtonGroup key={size} attached orientation={orientation} size={size} aria-label={`attached ${orientation} ${size}`}>
              <Button pressed={false} onPressedChange={noop}>{`Day ${size}`}</Button>
              <Button pressed onPressedChange={noop}>{`Week ${size}`}</Button>
              <Button pressed={false} onPressedChange={noop} disabled>
                Month
              </Button>
            </ButtonGroup>
          ))}
          <ButtonGroup attached orientation={orientation} aria-label="attached icons">
            <Button iconOnly label="Left" pressed onPressedChange={noop}>
              <AlignLeft />
            </Button>
            <Button iconOnly label="Center" pressed={false} onPressedChange={noop}>
              <AlignCenter />
            </Button>
            <Button iconOnly label="Right" pressed={false} onPressedChange={noop}>
              <AlignRight />
            </Button>
          </ButtonGroup>
          {appearances.map((appearance) => (
            <ButtonGroup key={appearance} orientation={orientation} intent="neutral" appearance={appearance}>
              <Button>{`Spaced ${appearance}`}</Button>
              <Button intent="accent" appearance="solid">
                Save
              </Button>
            </ButtonGroup>
          ))}
        </div>
        );
      })}
    </>
  ),
  Link: () => (
    <>
      {([undefined, "var(--color-bg-surface)", "var(--color-bg-accentSubtle)"] as const).map((background) => (
        <div className="row" key={background ?? "page"} style={background ? { background } : undefined}>
          {(["accent", "neutral", "inherit"] as const).map((tone) =>
            (["always", "hover", "none"] as const).map((underline) => (
              <p key={`${tone}-${underline}`} style={{ margin: 0, color: "var(--color-text-secondary)" }}>
                Text with a{" "}
                <Link href="#check" tone={tone} underline={underline}>
                  {`${tone} ${underline}`}
                </Link>
              </p>
            ))
          )}
          <Link href="#check" size="sm">
            Small
          </Link>
          <Link href="#check" size="md" tone="neutral">
            Medium
          </Link>
          <Link href="https://example.com" external>
            External
          </Link>
          <Link href="#check" size="sm" underline="hover">
            Standalone sm
          </Link>
          <Link href="#check" tone="neutral" underline="none">
            Standalone
          </Link>
        </div>
      ))}
    </>
  ),
};
