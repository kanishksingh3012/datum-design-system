import { useState, type ReactNode } from "react";
import { UNSAFE_PortalProvider } from "react-aria";
import {
  Accordion, AccordionItem, Alert, Avatar, AvatarGroup, Badge, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader,
  Checkbox, CheckboxGroup, Container, Field, Grid, Heading, Label, Link, ProgressBar, Radio, RadioGroup, Section, Select, Separator,
  Skeleton, Spinner, Stack, Switch, Text, TextField, Textarea, Toaster, toast, type SelectOption,
  Dialog, DialogBody, DialogFooter, DialogHeader, DropdownMenu, Sheet, Tooltip, type DropdownMenuItem,
  Breadcrumbs, BreadcrumbItem, Footer, Navbar, Pagination, Tabs, type NavbarLink, type TabItem,
} from "@datum-design/react";
import { AlignCenter, AlignLeft, AlignRight, Copy, Mail, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";

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
const narrow = { maxWidth: 360 };
/** Measures every piece of text inside (label, value, help, error, counter). */
const Deep = ({ children }: { children: ReactNode }) => <div data-check-text="deep" style={narrow}>{children}</div>;
const countries: SelectOption[] = [
  { value: "us", label: "United States", group: "Americas" },
  { value: "ca", label: "Canada", group: "Americas" },
  { value: "fr", label: "France", group: "Europe" },
];


const megaItems: DropdownMenuItem[] = [
  { type: "section", label: "Build", items: [
    { label: "Editor", href: "#editor", description: "Write and preview in one place" },
    { label: "Components", href: "#components", description: "Thirty parts, four themes" },
  ] },
  { type: "section", label: "Ship", items: [
    { label: "Deploy", href: "#deploy", description: "Push to go live" },
    { label: "Analytics", href: "#analytics" },
  ] },
];
const tabItems: TabItem[] = [
  { value: "overview", label: "Overview", icon: <Star />, content: <Text>The overview panel.</Text> },
  { value: "activity", label: "Activity" },
  { value: "settings", label: "Settings" },
  { value: "billing", label: "Billing", disabled: true },
];
const crumbs = ["Home", "Docs", "Components", "Navigation"].map((label) => (
  <BreadcrumbItem key={label} href="#">{label}</BreadcrumbItem>
));
const footerColumns = [
  { title: "Product", links: [{ label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }, { label: "Docs", href: "#" }] },
  { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }] },
];
const navLinks: NavbarLink[] = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs", badge: "New" },
  { label: "Resources", items: [{ label: "Blog", href: "/blog" }, { label: "Guides", href: "/guides" }] },
  { label: "Products", columns: [
    { title: "Build", items: [{ label: "Editor", href: "/editor", description: "Write and preview" }] },
    { title: "Ship", items: [{ label: "Deploy", href: "/deploy", description: "Push to go live" }] },
  ] },
];
const navbar = (props: Partial<Parameters<typeof Navbar>[0]> = {}) => (
  <Navbar
    position="static"
    links={navLinks}
    activeHref="/docs"
    logo={<a href="/">Datum</a>}
    search={<Button iconOnly label="Search" intent="neutral" appearance="ghost"><Search /></Button>}
    actions={<><Button intent="neutral" appearance="ghost">Sign in</Button><Button>Get started</Button></>}
    {...props}
  />
);

/** Every state the combo checker renders, keyed by component name. */
/** Renders overlays inside #fixture instead of <body>, so the checker finds them. */
function InFixture({ deep, children }: { deep?: boolean; children: ReactNode }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  return (
    <div ref={setEl} data-check-text={deep ? "deep" : undefined}>
      {el ? <UNSAFE_PortalProvider getContainer={() => el}>{children}</UNSAFE_PortalProvider> : null}
    </div>
  );
}
/** A fixture with states: the checker loads each variant on its own page. */
const states = (variants: string[], render: (variant: string) => ReactNode, deep = false) =>
  Object.assign(({ variant = 0 }: { variant?: number }) => <InFixture deep={deep}>{render(variants[variant])}</InFixture>, { variants });

const dialogContent = (danger = false) => (
  <>
    <DialogHeader data-check-text="deep" description="Changes apply to everyone on the team.">{danger ? "Delete project?" : "Edit project"}</DialogHeader>
    <DialogBody data-check-text="deep">
      <Text>Body copy sits in text.primary on the raised surface. <Link href="#">A link</Link> in running text.</Text>
    </DialogBody>
    <DialogFooter>
      <Button intent="neutral" appearance="outline">Cancel</Button>
      <Button intent={danger ? "danger" : "accent"}>{danger ? "Delete" : "Save"}</Button>
    </DialogFooter>
  </>
);

function menuItems(): DropdownMenuItem[] {
  return [
    { label: "Edit", icon: <Pencil />, shortcut: "⌘E" },
    { label: "Duplicate", icon: <Copy />, shortcut: "⌘D" },
    { label: "Archive", disabled: true },
    { type: "separator" },
    { type: "checkbox", label: "Show grid", checked: true, onCheckedChange: noop },
    { type: "checkbox", label: "Show rulers", checked: false, onCheckedChange: noop },
    {
      type: "section",
      label: "Sort by",
      items: [
        { type: "radio", label: "Name", checked: true, onSelect: noop },
        { type: "radio", label: "Date", checked: false, onSelect: noop },
        { type: "radio", label: "Size", checked: false, onSelect: noop, disabled: true },
      ],
    },
    { type: "separator" },
    { label: "Delete", intent: "danger", icon: <Trash2 />, shortcut: "⌫" },
  ];
}

type Fixture = ((props: { variant?: number }) => ReactNode) & { variants?: string[] };

export const fixtures: Record<string, Fixture> = {
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
      {/* focus rings of nested controls on a fill take the fill's on-color */}
      {feedbackIntents.map((intent) => (
        <Alert
          key={`bleed-${intent}`}
          intent={intent}
          appearance="solid"
          fullBleed
          title={`${intent} full bleed`}
          action={<Link href="#" tone="inherit">Retry</Link>}
          data-check-text
        />
      ))}
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
  Label: () => (
    <div className="row">
      <Label htmlFor="check-label-a" data-check-text="deep">Plain label</Label>
      <Label htmlFor="check-label-b" required data-check-text="deep">Required label</Label>
    </div>
  ),
  Field: () => (
    <>
      <Field label="Billing period" helpText="Change it any time." required data-check-text="deep" style={narrow}>
        {(control) => (
          <ButtonGroup attached aria-labelledby={control["aria-labelledby"]} aria-describedby={control["aria-describedby"]}>
            <Button pressed>Monthly</Button>
            <Button pressed={false}>Yearly</Button>
          </ButtonGroup>
        )}
      </Field>
      <Field label="Seats" errorText="Choose at least one seat." data-check-text="deep" style={narrow}>
        {(control) => (
          <ButtonGroup attached aria-labelledby={control["aria-labelledby"]}>
            <Button pressed={false}>1</Button>
            <Button pressed={false}>5</Button>
          </ButtonGroup>
        )}
      </Field>
    </>
  ),
  TextField: () => (
    <>
      {sizes.map((size) => (
        <Deep key={size}><TextField size={size} label={`Name ${size}`} defaultValue="Ada Lovelace" helpText="As it appears on your card." /></Deep>
      ))}
      <Deep><TextField label="Search" placeholder="Search products" prefix={<Search />} clearable defaultValue="hats" /></Deep>
      <Deep><TextField label="Email" type="email" prefix={<Mail />} suffix="@datum.dev" required defaultValue="ada" /></Deep>
      <Deep><TextField label="Password" type="password" revealable defaultValue="hunter22" errorText="Use at least 12 characters." /></Deep>
      <Deep><TextField label="Account ID" readOnly defaultValue="acct_4417" /></Deep>
      <Deep><TextField label="Disabled" disabled defaultValue="Can't edit" /></Deep>
      <div style={box}>
        <Deep><TextField label="On a surface" defaultValue="Value" /></Deep>
      </div>
    </>
  ),
  Textarea: () => (
    <>
      {sizes.map((size) => (
        <Deep key={size}><Textarea size={size} label={`Message ${size}`} defaultValue="Hello there" helpText="Plain text only." maxLength={200} /></Deep>
      ))}
      <Deep><Textarea label="Bio" errorText="Tell us a little more." autoResize /></Deep>
      <Deep><Textarea label="Notes" readOnly defaultValue="Read-only notes" /></Deep>
      <div style={box}>
        <Deep><Textarea label="On a surface" rows={2} /></Deep>
      </div>
    </>
  ),
  Checkbox: () => (
    <>
      {(["md", "sm"] as const).map((size) => (
        <div key={size} className="row">
          <Checkbox size={size} label={`Unchecked ${size}`} description="A second line of detail." />
          <Checkbox size={size} label={`Checked ${size}`} defaultChecked />
          <Checkbox size={size} label={`Mixed ${size}`} defaultChecked="indeterminate" />
          <Checkbox size={size} label={`Invalid ${size}`} invalid />
        </div>
      ))}
      <CheckboxGroup label="Notify me about" helpText="Pick any." defaultValue={["mentions"]} orientation="horizontal" data-check-text="deep">
        <Checkbox value="mentions" label="Mentions" description="When someone @s you" />
        <Checkbox value="replies" label="Replies" />
        <Checkbox value="digest" label="Weekly digest" disabled />
      </CheckboxGroup>
      <CheckboxGroup label="Required" errorText="Pick at least one." data-check-text="deep">
        <Checkbox value="a" label="Option A" />
      </CheckboxGroup>
      <div className="row" style={box}>
        <Checkbox label="On a surface" />
        <Checkbox label="Checked on a surface" defaultChecked />
      </div>
    </>
  ),
  Radio: () => (
    <>
      {(["md", "sm"] as const).map((size) => (
        <RadioGroup key={size} size={size} label={`Delivery ${size}`} defaultValue="standard" orientation="horizontal" helpText="Arrives in 3–5 days." data-check-text="deep">
          <Radio value="standard" label="Standard" />
          <Radio value="express" label="Express" description="Next day" />
          <Radio value="pickup" label="Pickup" disabled />
        </RadioGroup>
      ))}
      <RadioGroup label="Plan" appearance="card" orientation="horizontal" defaultValue="pro" errorText="Plans change next cycle." data-check-text="deep">
        <Radio value="free" label="Free" description="For personal projects" />
        <Radio value="pro" label="Pro" description="For growing teams" />
      </RadioGroup>
      <div style={box}>
        <RadioGroup label="On a surface" defaultValue="a" orientation="horizontal">
          <Radio value="a" label="Selected" />
          <Radio value="b" label="Not selected" />
        </RadioGroup>
      </div>
    </>
  ),
  Switch: () => (
    <>
      {(["md", "sm"] as const).map((size) => (
        <div key={size} className="row">
          <Deep><Switch size={size} label={`Off ${size}`} description="Applies at once." /></Deep>
          <Switch size={size} label={`On ${size}`} defaultChecked />
        </div>
      ))}
      <Deep><Switch label="Label at the start" labelPosition="start" defaultChecked style={{ display: "flex" }} /></Deep>
      <div className="row" style={box}>
        <Switch label="Off on a surface" />
        <Switch label="On on a surface" defaultChecked />
      </div>
    </>
  ),
  Select: () => (
    <>
      {sizes.map((size) => (
        <Select key={size} size={size} label={`Country ${size}`} options={countries} defaultValue="fr" helpText="Where you're based." data-check-text="deep" style={narrow} />
      ))}
      <Select label="Placeholder" options={countries} required style={narrow} />
      <Select label="Invalid" options={countries} errorText="Choose a country." data-check-text="deep" style={narrow} />
      <Select label="Read-only" options={countries} defaultValue="ca" readOnly style={narrow} />
      <div style={box}>
        <Select label="On a surface" options={countries} style={narrow} />
      </div>
    </>
  ),
  Tabs: () => (
    <>
      {(["underline", "pill", "segmented"] as const).map((appearance) => (
        <div key={appearance} className="row" style={{ alignItems: "flex-start", gap: "var(--space-section)" }}>
          {(["md", "sm"] as const).map((size) => (
            <Tabs key={size} items={tabItems} appearance={appearance} size={size} aria-label={`${appearance} ${size}`} />
          ))}
          <Tabs items={tabItems.slice(1)} appearance={appearance} orientation="vertical" aria-label={`${appearance} vertical`} />
        </div>
      ))}
      <Tabs items={tabItems.slice(0, 3)} appearance="segmented" fullWidth aria-label="Full width" />
      <div style={box}>
        <Tabs items={tabItems.slice(1)} appearance="segmented" aria-label="On a surface" />
        <Tabs items={tabItems.slice(1)} appearance="pill" aria-label="Pill on a surface" />
        <Tabs items={tabItems.slice(1)} aria-label="Underline on a surface" />
      </div>
    </>
  ),
  Breadcrumbs: () => (
    <>
      {(["chevron", "slash"] as const).map((separator) =>
        (["md", "sm"] as const).map((size) => (
          <Breadcrumbs key={separator + size} separator={separator} size={size} data-check-text="deep">
            {crumbs}
            <BreadcrumbItem current>Tabs</BreadcrumbItem>
          </Breadcrumbs>
        ))
      )}
      <Breadcrumbs maxItems={3}>
        {crumbs}
        <BreadcrumbItem current>Tabs</BreadcrumbItem>
      </Breadcrumbs>
      <div style={box}>
        <Breadcrumbs data-check-text="deep">
          {crumbs}
          <BreadcrumbItem current>On a surface</BreadcrumbItem>
        </Breadcrumbs>
      </div>
    </>
  ),
  Pagination: () => (
    <>
      <Pagination pageCount={12} defaultValue={6} />
      <Pagination pageCount={12} defaultValue={1} size="sm" />
      <Pagination pageCount={20} defaultValue={10} siblings={2} getHref={(p) => `#page-${p}`} />
      <Pagination pageCount={12} defaultValue={3} compact data-check-text="deep" />
      <Pagination pageCount={12} defaultValue={3} compact size="sm" data-check-text="deep" />
      <div style={box}>
        <Pagination pageCount={5} defaultValue={2} />
      </div>
    </>
  ),
  Footer: () => (
    <div data-check-text="deep">
      {(["muted", "default"] as const).map((tone) => (
        <Footer key={tone} tone={tone} maxWidth={tone === "default" ? "lg" : undefined} columns={footerColumns} bottom={<><span>© 2026 Datum</span><Link href="#">Status</Link></>}>
          <strong>Datum</strong>
          <p>Components for building websites, in four themes.</p>
        </Footer>
      ))}
    </div>
  ),
  Navbar: states(["layouts", "appearances", "mobile menu"], (v) =>
    v === "layouts" ? (
      <>
        {navbar()}
        {navbar({ layout: "start", size: "compact" })}
        {navbar({ layout: "centered", bordered: false })}
      </>
    ) : v === "appearances" ? (
      <>
        {navbar({ appearance: "blur", announcement: <>Datum 2 is out. <Link href="#">Read the notes</Link></> })}
        {navbar({ appearance: "transparent" })}
        {navbar({ appearance: "inverse", layout: "start" })}
      </>
    ) : (
      // the bar behind the open Sheet is measured in the other states
      <div data-check-skip="">{navbar({ defaultOpen: true, activeHref: "/blog" })}</div>
    ), true),
  Dialog: states(["closed", "open", "alertdialog", "full"], (v) =>
    v === "closed" ? (
      <div className="row">
        <Dialog trigger={<Button>Edit project</Button>}>{dialogContent()}</Dialog>
        <Dialog trigger={<Button intent="danger" appearance="outline">Delete project</Button>} role="alertdialog">{dialogContent(true)}</Dialog>
      </div>
    ) : (
      <Dialog
        defaultOpen
        size={v === "full" ? "full" : "md"}
        role={v === "alertdialog" ? "alertdialog" : "dialog"}
        dismissible={v !== "alertdialog"}
      >
        {dialogContent(v === "alertdialog")}
      </Dialog>
    )
  ),
  Sheet: states(["closed", "right", "left", "top", "bottom"], (v) =>
    v === "closed" ? (
      <Sheet trigger={<Button intent="neutral" appearance="outline">Filters</Button>}>{dialogContent()}</Sheet>
    ) : (
      <Sheet defaultOpen side={v as "right"}>
        {dialogContent()}
      </Sheet>
    )
  ),
  DropdownMenu: states(["closed", "open md", "open sm", "open mega"], (v) => (
    <div className="row">
      {v === "open mega" ? (
        <DropdownMenu trigger={<Button data-check-skip="">Products</Button>} items={megaItems} columns={2} defaultOpen />
      ) : (
      <DropdownMenu
        trigger={<Button intent="neutral" appearance="outline" data-check-skip={v === "closed" ? undefined : ""}>Options</Button>}
        items={menuItems()}
        size={v === "open sm" ? "sm" : "md"}
        defaultOpen={v !== "closed"}
      />
      )}
    </div>
  ), true),
  Tooltip: states(["closed", "open"], (v) => (
    <div className="row" style={{ gap: 160, padding: "80px 160px" }}>
      {(["top", "right", "bottom", "left"] as const).map((placement) => (
        <Tooltip key={placement} content={`Tooltip on the ${placement}`} placement={placement} open={v === "open" ? true : undefined} data-check-text="">
          <Button intent="neutral" appearance="outline">{placement}</Button>
        </Tooltip>
      ))}
      <Tooltip content="Search the docs">
        <Button iconOnly label="Search" intent="neutral" appearance="ghost"><Search /></Button>
      </Tooltip>
    </div>
  )),
};
