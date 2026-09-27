import type { ReactNode } from "react";
import {
  Accordion, AccordionItem, Alert, Avatar, AvatarGroup, Badge, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader,
  Container, Grid, Heading, Link, ProgressBar, Section, Separator, Skeleton, Spinner, Stack, Text, Toaster, toast,
} from "@datum-design/react";
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
const feedbackIntents = ["info", "success", "warning", "danger", "neutral"] as const;
let toastsSeeded = false;
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
  Card: () => (
    <>
      <div className="row">
        {(["elevated", "outline", "soft"] as const).map((appearance) => (
          <Card key={appearance} appearance={appearance} style={{ width: 240 }}>
            <CardHeader>
              <Heading level={3} size="sm" data-check-text>{`Static ${appearance}`}</Heading>
              <Badge intent="accent">New</Badge>
            </CardHeader>
            <CardBody>
              <Text tone="secondary" data-check-text>Secondary text on the card.</Text>
            </CardBody>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="row">
        {(["elevated", "outline", "soft"] as const).map((appearance) => (
          <Card key={appearance} appearance={appearance} padding="sm" interactive href="#card" style={{ width: 240 }}>
            {`Link ${appearance}`}
          </Card>
        ))}
        {(["elevated", "outline", "soft"] as const).map((appearance) => (
          <Card key={appearance} appearance={appearance} padding="lg" interactive style={{ width: 240 }}>
            {`Button ${appearance}`}
          </Card>
        ))}
      </div>
    </>
  ),
  Badge: () => (
    <>
      {(["solid", "soft", "outline"] as const).map((appearance) =>
        (["md", "sm"] as const).map((size) => (
          <div key={appearance + size} className="row">
            {(["accent", "neutral", "danger", "success", "warning", "info"] as const).map((intent) => (
              <Badge key={intent} intent={intent} appearance={appearance} size={size} dot={size === "md"} data-check-text>
                {`${intent} ${appearance}`}
              </Badge>
            ))}
          </div>
        ))
      )}
    </>
  ),
  Avatar: () => (
    <>
      <div className="row">
        {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
          <Avatar key={size} size={size} name="Ada Lovelace" data-check-text />
        ))}
        {(["online", "away", "busy", "offline"] as const).map((status) => (
          <Avatar key={status} size="lg" shape="square" name="Grace Hopper" status={status} data-check-text />
        ))}
        <Avatar size="lg" />
      </div>
      <AvatarGroup max={3} size="md" aria-label="Members">
        {["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra"].map((name) => (
          <Avatar key={name} name={name} data-check-text />
        ))}
      </AvatarGroup>
      <AvatarGroup max={2} size="xs">
        {["Ada Lovelace", "Grace Hopper", "Alan Turing"].map((name) => <Avatar key={name} name={name} />)}
      </AvatarGroup>
    </>
  ),
  Separator: () => (
    <>
      <Separator />
      <Separator tone="default" />
      <Separator label="or" data-check-text />
      <Separator tone="default" label="Continue with" data-check-text />
      <div className="row" style={{ height: 80 }}>
        <Text data-check-text>Left</Text>
        <Separator orientation="vertical" />
        <Text>Middle</Text>
        <Separator orientation="vertical" label="or" data-check-text />
        <Text>Right</Text>
      </div>
    </>
  ),
  Accordion: () => (
    <>
      {(["plain", "bordered", "separated"] as const).map((appearance) => (
        <Accordion key={appearance} appearance={appearance} defaultValue="one" style={{ maxWidth: 560 }}>
          <AccordionItem value="one" title={`What is ${appearance}?`}>
            <span data-check-text>The answer sits in the panel, in the secondary text color.</span>
          </AccordionItem>
          <AccordionItem value="two" title="Can I close every item?">Yes, unless collapsible is false.</AccordionItem>
          <AccordionItem value="three" title="Disabled item" disabled>Hidden.</AccordionItem>
        </Accordion>
      ))}
    </>
  ),
  Alert: () => (
    <>
      {(["soft", "outline", "solid"] as const).map((appearance) =>
        feedbackIntents.map((intent) => (
          <Alert
            key={appearance + intent}
            intent={intent}
            appearance={appearance}
            title={`${intent} ${appearance}`}
            description="Detail under the title, in the same text color."
            dismissible
            action={
              appearance === "solid" ? (
                <Link href="#" tone="inherit">Review</Link>
              ) : (
                <Button size="sm" intent="neutral" appearance="outline">Review</Button>
              )
            }
            data-check-text
          />
        ))
      )}
    </>
  ),
  Toast: () => {
    // Seeded before the Toaster first renders, so the toasts are there when measuring starts.
    if (!toastsSeeded) {
      toastsSeeded = true;
      (["neutral", "success", "danger", "warning", "info"] as const).forEach((intent) =>
        toast({ intent, title: `${intent} toast`, description: "Detail text.", action: { label: "Undo", onAction: noop }, duration: null })
      );
    }
    return (
      <>
        <Text data-check-text>Toasts sit in the bottom-end corner.</Text>
        <Toaster />
      </>
    );
  },
  Spinner: () => (
    <>
      <div className="row">
        {sizes.map((size) => (
          <Spinner key={size} size={size} data-check-text />
        ))}
        {sizes.map((size) => (
          <Spinner key={size} size={size} tone="accent" data-check-text />
        ))}
      </div>
      <div className="row" style={box}>
        <Spinner data-check-text />
        <Spinner tone="accent" data-check-text />
      </div>
    </>
  ),
  ProgressBar: () => (
    <>
      {(["accent", "success", "warning", "danger"] as const).map((intent) =>
        (["md", "sm"] as const).map((size) => (
          <ProgressBar key={intent + size} intent={intent} size={size} value={60} label={`${intent} ${size}`} showValue data-check-text />
        ))
      )}
      <ProgressBar label="Indeterminate" data-check-text />
      <div style={box}>
        <ProgressBar value={30} label="On a surface" showValue data-check-text />
      </div>
    </>
  ),
  Skeleton: () => (
    <>
      <Skeleton />
      <Skeleton lines={3} />
      <div className="row">
        <Skeleton shape="circle" />
        <Skeleton shape="rect" width={240} height={96} animated={false} />
      </div>
    </>
  ),
};
