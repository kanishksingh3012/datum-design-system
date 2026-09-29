import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { UNSAFE_PortalProvider } from "react-aria";
import { getLocalTimeZone, startOfMonth, today, type DateValue } from "@internationalized/date";
import {
  Accordion, AccordionItem, Alert, Avatar, AvatarGroup, Badge, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader,
  Checkbox, CheckboxGroup, Container, Field, Grid, Heading, Label, Link, ProgressBar, Radio, RadioGroup, Section, Select, Separator,
  Skeleton, Spinner, Stack, Switch, Text, TextField, Textarea, Toaster, toast, type SelectOption,
  Dialog, DialogBody, DialogFooter, DialogHeader, DropdownMenu, Sheet, Tooltip, type DropdownMenuItem,
  Breadcrumbs, BreadcrumbItem, Footer, Navbar, Pagination, Tabs, type NavbarLink, type TabItem,
  ContextMenu, HoverCard, InputOTP, NumberField, Popover, Slider, type ContextMenuItem,
  Combobox, TagInput, CommandPalette, DatePicker, DateRangePicker, type CommandPaletteItem,
  Carousel, ColorPicker, FileUpload, Resizable, ScrollArea, Sidebar, type CarouselSlide, type SidebarSection,
  AgentActivity, Citation, CodeBlock, Composer, FileDiff, Message, MessageList, MessageScroller, Reasoning, Source, Sources,
  Suggestion, SuggestionItem, ThinkingIndicator, TodoItem, TodoList, ToolCall, type DiffRow, type CodeLine,
  DataTable, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, type DataTableColumn,
} from "@datum-design/react";
import { AlignCenter, AlignLeft, AlignRight, Copy, FolderOpen, Home, Inbox, Mail, Pencil, Plus, Search, Settings, Star, Trash2 } from "lucide-react";

const intents = ["accent", "neutral", "danger"] as const;
const appearances = ["solid", "soft", "outline", "ghost"] as const;
const sizes = ["sm", "md", "lg"] as const;
const noop = () => {};
/** Sentence case for generated labels. */
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
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
const commands: CommandPaletteItem[] = [
  { id: "new", label: "New project", group: "Projects", icon: <Plus />, shortcut: "⌘N" },
  { id: "open", label: "Open recent", group: "Projects", icon: <FolderOpen />, description: "Datum gallery · edited today" },
  { id: "inbox", label: "Go to inbox", group: "Navigate", icon: <Inbox />, shortcut: "G I" },
  { id: "settings", label: "Settings", group: "Navigate", icon: <Settings />, shortcut: "⌘," },
  { id: "delete", label: "Delete project", group: "Projects", icon: <Trash2 />, disabled: true },
];
/** Opens a range calendar and presses a start day, then moves focus on, so the band is mid-selection. */
function MidRange({ first, steps }: { first: DateValue; steps: number }) {
  // React Aria commits a half-made range when focus leaves the calendar, so focusing each control
  // would end the selection: the controls are skipped here (measured in "complete range"); the text is still measured
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  // in a layout effect once the calendar is in, so the selection is made before the first paint
  useLayoutEffect(() => {
    const day = el?.querySelector<HTMLElement>(`[role="grid"] td:not([aria-disabled]) button[aria-label$=" ${first.day}, ${first.year}"]`);
    day?.click();
    for (let i = 0; i < steps; i++) day?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  }, [el, first, steps]);
  return (
    <div ref={setEl} data-check-skip="">
      {el ? (
        <UNSAFE_PortalProvider getContainer={() => el}>
          <DateRangePicker label="Trip" defaultOpen minValue={monthStart.add({ days: 1 })} isDateUnavailable={unavailable} style={narrow} />
        </UNSAFE_PortalProvider>
      ) : null}
    </div>
  );
}
// dates around today, so "today" is always in the month shown
const now = today(getLocalTimeZone());
const picked = now.day > 15 ? now.subtract({ days: 4 }) : now.add({ days: 4 });
const monthStart = startOfMonth(now);
// a five-night range inside the month, on the side of today that has room
const rangeStart = now.day > 15 ? picked.subtract({ days: 5 }) : picked;
const stay = { start: rangeStart, end: rangeStart.add({ days: 5 }) };
// every ninth day is unavailable, away from today and the picked dates
const unavailable = (d: DateValue) => d.month === now.month && d.day % 9 === 0 && Math.abs(d.day - now.day) > 8;
const cities: SelectOption[] = [
  { value: "nyc", label: "New York", group: "Americas" },
  { value: "tor", label: "Toronto", group: "Americas", description: "Eastern time" },
  { value: "par", label: "Paris", group: "Europe" },
  { value: "ber", label: "Berlin", group: "Europe", disabled: true },
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

const codeLines: CodeLine[] = [
  { tokens: [{ text: "// grows with its content", kind: "comment" }] },
  { tokens: [{ text: "export", kind: "keyword" }, { text: " " }, { text: "function", kind: "keyword" }, { text: " " }, { text: "Composer", kind: "function" }, { text: "({ label }) {", kind: "punctuation" }] },
  { tokens: [{ text: "  " }, { text: "return", kind: "keyword" }, { text: " <textarea aria-label={label} rows={" }, { text: "1", kind: "number" }, { text: "} />;" }] },
  { tokens: [{ text: "}", kind: "punctuation" }] },
  { tokens: [{ text: "const", kind: "keyword" }, { text: " hint = " }, { text: '"Enter sends, Shift+Enter adds a line"', kind: "string" }, { text: ";" }] },
];
const diffRows: DiffRow[] = [
  { kind: "hunk", content: "@@ -12,4 +12,5 @@ export function Composer" },
  { kind: "context", oldLine: 12, newLine: 12, content: "  const id = useId();" },
  { kind: "remove", oldLine: 13, content: "  const [value, setValue] = useState(\"\");" },
  { kind: "add", newLine: 13, content: "  const [draft, setDraft] = useControllableState(value, defaultValue, onValueChange);" },
  { kind: "add", newLine: 14, content: "  const canSend = !disabled && !thinking && draft.trim() !== \"\";" },
  { kind: "context", oldLine: 14, newLine: 15, content: "  return (" },
];

type Invoice = { id: string; client: string; status: string; amount: number };
const invoices: Invoice[] = [
  { id: "INV-104", client: "Acme Inc.", status: "Paid", amount: 1200 },
  { id: "INV-105", client: "Globex", status: "Overdue", amount: 860.5 },
  { id: "INV-106", client: "Initech", status: "Draft", amount: 4300 },
  { id: "INV-107", client: "Umbrella Corporation International", status: "Paid", amount: 99 },
];
const invoiceColumns: DataTableColumn<Invoice>[] = [
  { key: "id", label: "Invoice", sortable: true },
  { key: "client", label: "Client", sortable: true, rowHeader: true },
  { key: "status", label: "Status", render: (r) => <Badge intent={r.status === "Overdue" ? "danger" : r.status === "Paid" ? "success" : "neutral"} appearance="soft" size="sm">{r.status}</Badge> },
  { key: "amount", label: "Amount", sortable: true, align: "end", render: (r) => `$${r.amount.toFixed(2)}` },
];
const InvoiceTable = ({ rows = invoices, ...props }: Partial<Parameters<typeof Table>[0]> & { rows?: Invoice[] }) => (
  <Table aria-label="Invoices" {...props}>
    <TableHeader>
      <TableColumn key="id" allowsSorting>Invoice</TableColumn>
      <TableColumn key="client" isRowHeader allowsSorting>Client</TableColumn>
      <TableColumn key="amount" align="end" allowsSorting>Amount</TableColumn>
    </TableHeader>
    <TableBody items={rows}>
      {(r) => (
        <TableRow key={r.id}>
          <TableCell>{r.id}</TableCell>
          <TableCell>{r.client}</TableCell>
          <TableCell>{`$${r.amount.toFixed(2)}`}</TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);
/** A fixture with states: the checker loads each variant on its own page. */
const states = (variants: string[], render: (variant: string) => ReactNode, deep = false) =>
  Object.assign(({ variant = 0 }: { variant?: number }) => <InFixture deep={deep}>{render(variants[variant])}</InFixture>, { variants });

const dialogContent = (danger = false) => (
  <>
    <DialogHeader data-check-text="deep" description={danger ? "This affects everyone on the team." : "Changes apply to everyone on the team."}>{danger ? "Delete project?" : "Edit project"}</DialogHeader>
    <DialogBody data-check-text="deep">
      <Text>{danger ? "This removes the project and its history. You can’t undo this." : "Rename the project or move it to another team."} <Link href="#">Learn more</Link></Text>
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

const contextItems: ContextMenuItem[] = [
  { label: "Copy", icon: <Copy />, shortcut: "⌘C" },
  { label: "Rename", icon: <Pencil /> },
  { label: "Paste", disabled: true },
  { type: "separator" },
  { label: "Delete", intent: "danger", icon: <Trash2 />, shortcut: "⌫" },
];
const popoverBody = (
  <>
    <Text>Only show results from the last 30 days.</Text>
    <TextField label="Keyword" defaultValue="design" size="sm" />
    <div className="row">
      <Button size="sm" intent="neutral" appearance="ghost">Reset</Button>
      <Button size="sm">Apply</Button>
    </div>
  </>
);

function SegmentedFields() {
  const [period, setPeriod] = useState("Monthly");
  const [seats, setSeats] = useState<string | null>(null);
  const segment = (value: string, current: string | null, set: (v: string) => void) => (
    <Button key={value} pressed={current === value} onPressedChange={() => set(value)}>{value}</Button>
  );
  return (
    <>
      <Field label="Billing period" helpText="Change it any time." required data-check-text="deep" style={narrow}>
        {(control) => (
          <ButtonGroup attached aria-labelledby={control["aria-labelledby"]} aria-describedby={control["aria-describedby"]}>
            {["Monthly", "Yearly"].map((v) => segment(v, period, setPeriod))}
          </ButtonGroup>
        )}
      </Field>
      <Field label="Seats" errorText={seats ? undefined : "Choose at least one seat."} data-check-text="deep" style={narrow}>
        {(control) => (
          <ButtonGroup attached aria-labelledby={control["aria-labelledby"]} aria-describedby={control["aria-describedby"]}>
            {["1", "5", "10", "25"].map((v) => segment(v, seats, setSeats))}
          </ButtonGroup>
        )}
      </Field>
    </>
  );
}

const sidebarSections: SidebarSection[] = [
  { links: [
    { label: "Home", href: "/", icon: <Home /> },
    { label: "Inbox", href: "/inbox", icon: <Inbox />, badge: 12 },
    { label: "Search", href: "/search", icon: <Search /> },
  ] },
  { title: "Projects", links: [
    { label: "Datum", href: "/p/datum", icon: <FolderOpen />, badge: "New" },
    { label: "Website", href: "/p/website", icon: <FolderOpen /> },
  ] },
  { title: "Account", links: [{ label: "Settings", href: "/settings", icon: <Settings /> }] },
];
const sidebar = (props: Partial<Parameters<typeof Sidebar>[0]> = {}) => (
  <Sidebar
    sections={sidebarSections}
    activeHref="/inbox"
    label="Workspace"
    header={<Text variant="label">Acme Inc.</Text>}
    footer={<div className="row"><Avatar name="Ada Lovelace" size="sm" /><Text variant="body-sm">Ada Lovelace</Text></div>}
    style={{ height: 560 }}
    {...props}
  />
);
const lines = (n: number, prefix: string) =>
  Array.from({ length: n }, (_, i) => <Text key={i} style={{ whiteSpace: "nowrap" }}>{`${prefix} ${i + 1}: a line long enough to need room in a narrow box.`}</Text>);
const panel = (text: string) => (
  <div style={{ ...box, height: "100%", boxSizing: "border-box", padding: "var(--space-default)" }}>
    <Text>{text}</Text>
  </div>
);
const slide = (title: string, tone: "surface" | "accent") => (
  <div style={{ padding: "var(--space-section)", minHeight: 160, background: tone === "accent" ? "var(--color-bg-accentSubtle)" : "var(--color-bg-surface)" }}>
    <Heading level={3} size="md">{title}</Heading>
    <Text tone="secondary">A slide with a heading, a line of text and <Link href="#slide">a link</Link>.</Text>
  </div>
);
const slides: CarouselSlide[] = [
  { label: "Launch", content: slide("Datum 2 is out", "accent") },
  { label: "Themes", content: slide("Two themes, four combos", "surface") },
  { label: "Forms", content: slide("Forms that read the same", "surface") },
];
const swatchColors = ["#FC6E20", "#355695", "#007440", "#D52F4A", "#F1C035", "#1B1B1B", "#FFFFFF"];
const demoFile = (name: string, size: number, type: string) => new File([new Uint8Array(size)], name, { type, lastModified: 0 });
/** Starts a file drag over the drop area, so its dragging state can be measured. */
function Dragging({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const zone = ref.current?.querySelector(`[data-drop-target], [data-size="md"], [data-size="sm"]:not(button)`);
    if (!zone) return;
    // a script-made DataTransfer can't allow any drop effect outside a real drag, so this stands in for one
    const dataTransfer = { types: ["Files"], items: [{ kind: "file", type: "image/png" }], files: [], effectAllowed: "copy", dropEffect: "none" };
    const event = new DragEvent("dragenter", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "dataTransfer", { value: dataTransfer });
    zone.dispatchEvent(event);
  }, []);
  return <div ref={ref}>{children}</div>;
}

type Fixture = ((props: { variant?: number }) => ReactNode) & { variants?: string[] };

// Every block in site/blocks, at desktop and mobile width (the checker renders "mobile…" variants at 390px).
const blockFixtures = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: ComponentType }>("../site/blocks/*.tsx", { eager: true })).map(([path, mod]) => {
    const Block = mod.default;
    return [path.slice(path.lastIndexOf("/") + 1, -4), states(["desktop", "mobile"], () => <Block />, true)];
  })
);

export const fixtures: Record<string, Fixture> = {
  ...blockFixtures,
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
              <Text variant="overline" tone="accent" data-check-text>{cap(`${tone} tone`)}</Text>
              <Heading data-check-text>A section heading</Heading>
              <Text tone="secondary" data-check-text>Secondary text on this band.</Text>
              <Stack direction="horizontal" gap="sm" align="center">
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
          <Heading key={`${tone}-${size}`} size={size} tone={tone} data-check-text>{cap(`${tone} ${size}`)}</Heading>
        ))
      )}
    </>
  ),
  Text: () => (
    <>
      {textVariants.map((variant) => (
        <Stack key={variant} direction="horizontal" gap="md" wrap>
          {textTones.map((tone) => (
            <Text key={tone} variant={variant} tone={tone} data-check-text>{cap(`${variant} ${tone}`)}</Text>
          ))}
        </Stack>
      ))}
      <div style={box}>
        {textTones.map((tone) => (
          <Text key={tone} variant="body-sm" tone={tone} data-check-text>{cap(`${tone} on surface`)}</Text>
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
                {cap(`${intent} ${appearance} ${size}`)}
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
                  {cap(`${tone} ${underline}`)}
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
                {cap(`${intent} ${appearance}`)}
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
            title={cap(`${intent} ${appearance}`)}
            description="Details appear under the title in the same color."
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
          title={cap(`${intent} full bleed`)}
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
        toast({ intent, title: cap(`${intent} toast`), description: "Your changes were saved.", action: { label: "Undo", onAction: noop }, duration: null })
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
  Field: () => <SegmentedFields />,
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
  Navbar: states(["layouts", "appearances", "mobile menu", "mobile menu open"], (v) =>
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
    ) : v === "mobile menu" ? (
      // the collapsed bar and its menu trigger only exist below the breakpoint — their one real coverage
      navbar({ activeHref: "/blog" })
    ) : (
      // an open Sheet traps focus, so it gets its own state; its contents are Sheet's coverage
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
  Popover: states(["closed", "open", "open titled"], (v) => (
    <div className="row">
      <Popover
        trigger={<Button intent="neutral" appearance="outline" data-check-skip={v === "closed" ? undefined : ""}>Filters</Button>}
        title={v === "open titled" ? "Filter results" : undefined}
        defaultOpen={v !== "closed"}
      >
        {popoverBody}
      </Popover>
    </div>
  ), true),
  HoverCard: states(["closed", "open"], (v) => (
    <div>
      <Text>
        Written by{" "}
        <HoverCard open={v === "open" ? true : undefined} trigger={<Link href="#ada">Ada Lovelace</Link>}>
          <div className="row">
            <Avatar name="Ada Lovelace" />
            <strong>Ada Lovelace</strong>
          </div>
          <span>Mathematician, and the first to publish an algorithm for a machine.</span>
          <Link href="#profile">View profile</Link>
        </HoverCard>
        , 1843.
      </Text>
    </div>
  ), true),
  ContextMenu: states(["closed", "open md", "open sm"], (v) => (
    <ContextMenu items={contextItems} defaultOpen={v !== "closed"} size={v === "open sm" ? "sm" : "md"}>
      <div style={{ ...box, width: 360, height: 280, border: "1px dashed var(--color-border-strong)", borderRadius: "var(--radius-card)" }}>
        <Text>Right-click anywhere in this box.</Text>
      </div>
    </ContextMenu>
  ), true),
  NumberField: () => (
    <>
      {sizes.map((size) => (
        <Deep key={size}><NumberField size={size} label={`Guests ${size}`} defaultValue={2} min={1} max={12} helpText="Up to 12." /></Deep>
      ))}
      <Deep><NumberField label="At the minimum" defaultValue={1} min={1} /></Deep>
      <Deep><NumberField label="Price" defaultValue={24} formatOptions={{ style: "currency", currency: "USD" }} step={0.5} /></Deep>
      <Deep><NumberField label="Width" defaultValue={320} hideSteppers /></Deep>
      <Deep><NumberField label="Quantity" defaultValue={40} required errorText="We only have 12 in stock." /></Deep>
      <Deep><NumberField label="Seats" defaultValue={8} readOnly /></Deep>
      <Deep><NumberField label="Disabled" defaultValue={3} disabled /></Deep>
      <div style={box}>
        <Deep><NumberField label="On a surface" defaultValue={5} /></Deep>
      </div>
    </>
  ),
  Slider: () => (
    <div data-check-text="deep" style={{ ...narrow, display: "grid", gap: "var(--space-section)" }}>
      {(["md", "sm"] as const).map((size) => (
        <Slider key={size} size={size} label={`Volume ${size}`} defaultValue={60} />
      ))}
      <Slider label="Price range" defaultValue={[20, 80]} formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />
      <Slider label="Opacity" defaultValue={0.4} min={0} max={1} step={0.05} formatOptions={{ style: "percent" }} />
      <Slider aria-label="Zoom" defaultValue={30} />
      <Slider label="Disabled" defaultValue={50} disabled />
      <div style={box}>
        <Slider label="On a surface" defaultValue={25} />
      </div>
    </div>
  ),
  InputOTP: () => (
    <>
      {sizes.map((size) => (
        <Deep key={size}><InputOTP size={size} label={`Code ${size}`} defaultValue="1234" helpText="Sent to +1 ••• 4417." /></Deep>
      ))}
      <Deep><InputOTP label="Empty" length={4} required /></Deep>
      <Deep><InputOTP label="Complete" length={4} defaultValue="9021" /></Deep>
      <Deep><InputOTP label="Expired" defaultValue="483" errorText="That code has expired." /></Deep>
      <Deep><InputOTP label="Read-only" length={4} defaultValue="77" readOnly /></Deep>
      <Deep><InputOTP label="Disabled" length={4} defaultValue="12" disabled /></Deep>
      <div style={box}>
        <Deep><InputOTP label="On a surface" length={4} defaultValue="5" /></Deep>
      </div>
    </>
  ),
  Sidebar: states(["layouts", "mobile menu", "mobile menu open"], (v) =>
    v === "layouts" ? (
      <div className="row" style={{ alignItems: "stretch" }}>
        {sidebar()}
        {sidebar({ size: "sm", header: undefined, footer: undefined, activeHref: "/p/datum" })}
      </div>
    ) : v === "mobile menu" ? (
      // the collapsed bar and its menu trigger only exist below the breakpoint — their one real coverage
      sidebar({ style: undefined })
    ) : (
      // an open Sheet traps focus, so it gets its own state; its contents are Sheet's coverage
      <div data-check-skip="">{sidebar({ style: undefined, defaultOpen: true })}</div>
    ), true),
  ScrollArea: () => {
    const frame = { background: "var(--color-bg-surface)", width: 280, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-card)" };
    return (
      <div data-check-text="deep" style={{ display: "grid", gap: "var(--space-section)" }}>
        <div className="row" style={{ alignItems: "flex-start" }}>
          <ScrollArea label="Vertical" maxHeight={200} style={frame}>{lines(12, "Row")}</ScrollArea>
          <ScrollArea label="Horizontal" orientation="horizontal" style={frame}>{lines(3, "Wide row")}</ScrollArea>
          <ScrollArea label="Both ways" orientation="both" maxHeight={200} style={frame}>{lines(12, "Cell")}</ScrollArea>
        </div>
        <div className="row" style={{ alignItems: "flex-start" }}>
          <ScrollArea label="Padding sm" padding="sm" maxHeight={160} style={frame}>{lines(8, "Small")}</ScrollArea>
          <ScrollArea label="Padding none" padding="none" maxHeight={160} style={frame}>{lines(8, "Flush")}</ScrollArea>
        </div>
      </div>
    );
  },
  Resizable: () => (
    <div data-check-text="deep" style={{ display: "grid", gap: "var(--space-section)", maxWidth: 720 }}>
      {(["horizontal", "vertical"] as const).map((orientation) => (
        <Resizable
          key={orientation}
          orientation={orientation}
          first={panel(`${cap(orientation)}: first panel`)}
          second={panel("Second panel")}
          defaultValue={35}
          style={{ height: 200, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-card)" }}
        />
      ))}
      <Resizable
        disabled
        first={panel("Disabled: first panel")}
        second={panel("Second panel")}
        style={{ height: 120, border: "1px solid var(--color-border-subtle)", borderRadius: "var(--radius-card)" }}
      />
    </div>
  ),
  Carousel: () => (
    <div data-check-text="deep" style={{ display: "grid", gap: "var(--space-section)", maxWidth: 560 }}>
      <Carousel label="Featured" slides={slides} />
      <Carousel label="Autoplay" slides={slides} autoplay={600000} defaultValue={1} />
      <Carousel label="Last slide, no loop" slides={slides} loop={false} defaultValue={2} />
    </div>
  ),
  ColorPicker: states(["closed", "open"], (v) =>
    v === "closed" ? (
      <>
        {sizes.map((size) => (
          <ColorPicker key={size} size={size} label={`Brand ${size}`} defaultValue="#FC6E20" helpText="Used for primary buttons." />
        ))}
        <ColorPicker label="Invalid" defaultValue="#F1C035" errorText="Too light for text on white." />
        <ColorPicker label="Read-only" defaultValue="#355695" readOnly />
        <ColorPicker label="Disabled" defaultValue="#007440" disabled />
        <div style={box}><ColorPicker label="On a surface" defaultValue="#D52F4A" /></div>
      </>
    ) : (
      // the trigger is measured closed; while the panel is open it holds focus
      <div data-check-skip=""><ColorPicker label="Brand" defaultValue="#FC6E20" swatches={swatchColors} defaultOpen /></div>
    ), true),
  FileUpload: states(["empty", "dragging", "has files", "error", "disabled"], (v) =>
    v === "dragging" ? (
      <Dragging><FileUpload label="Photos" multiple accept="image/*" hint="PNG or JPG, up to 5 MB." /></Dragging>
    ) : v === "has files" ? (
      <>
        <FileUpload label="Attachments" multiple defaultValue={[demoFile("brief.pdf", 248000, "application/pdf"), demoFile("moodboard-final-v3.png", 3400000, "image/png")]} helpText="Up to 10 files." />
        <FileUpload label="Resume" size="sm" defaultValue={[demoFile("ada-lovelace-cv.pdf", 92000, "application/pdf")]} />
      </>
    ) : v === "error" ? (
      <>
        <FileUpload label="Photos" multiple required errorText="“scan.tiff” isn’t an accepted file type." hint="PNG or JPG, up to 5 MB." />
        <FileUpload label="Resume" size="sm" errorText="Upload failed. Try again." />
      </>
    ) : v === "disabled" ? (
      <>
        <FileUpload label="Photos" multiple disabled hint="PNG or JPG, up to 5 MB." />
        <FileUpload label="Resume" size="sm" disabled defaultValue={[demoFile("ada-lovelace-cv.pdf", 92000, "application/pdf")]} />
      </>
    ) : (
      <>
        <FileUpload label="Photos" multiple accept="image/*" hint="PNG or JPG, up to 5 MB." helpText="They stay private until you share them." />
        <FileUpload label="Resume" size="sm" accept=".pdf" hint="PDF only." />
        <div style={box}><FileUpload label="On a surface" size="sm" /></div>
      </>
    ), true),

  // ---------------------------------------------------------------- AI
  Message: states(["user and assistant", "streaming"], (v) => (
    <div style={{ maxWidth: 640 }}>
      <MessageList>
        <Message author="system" name="System">Conversation started today</Message>
        <Message author="user" name="Ada" avatar={<Avatar name="Ada Lovelace" size="sm" />} metadata="2:41 PM">How do I pin a chat to the bottom?</Message>
        <Message
          author="assistant"
          name="Datum"
          metadata="2:41 PM"
          streaming={v === "streaming"}
          actions={<><Button intent="neutral" appearance="ghost" size="sm" iconOnly label="Copy"><Copy /></Button><Button intent="neutral" appearance="ghost" size="sm">Retry</Button></>}
        >
          Wrap the transcript in a MessageScroller: it follows new content until the reader scrolls up.
        </Message>
        <Message author="assistant" name="Datum" grouped>It shows a jump button while they read back.</Message>
      </MessageList>
    </div>
  ), true),
  MessageScroller: states(["pinned", "scrolled up"], (v) => (
    <MessageScroller maxHeight={240} defaultPinned={v === "pinned"} style={{ maxWidth: 520, border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-card)" }}>
      <MessageList>
        {Array.from({ length: 8 }, (_, i) => (
          <Message key={i} author={i % 2 ? "assistant" : "user"} name={i % 2 ? "Datum" : "Ada"}>Message number {i + 1} in a long conversation.</Message>
        ))}
      </MessageList>
    </MessageScroller>
  ), true),
  Composer: states(["empty", "draft", "thinking", "thinking with stop", "disabled"], (v) => (
    <div style={{ maxWidth: 520, display: "grid", gap: 16 }}>
      <Composer
        label="Message"
        defaultValue={v === "empty" || v === "disabled" ? "" : "Summarise this thread in three bullet points"}
        thinking={v.startsWith("thinking")}
        onStop={v === "thinking with stop" ? noop : undefined}
        disabled={v === "disabled"}
        onSubmit={noop}
      />
      <div style={box}><Composer label="On a surface" defaultValue="Draft" onSubmit={noop} /></div>
    </div>
  ), true),
  Suggestion: () => (
    <Stack gap="md">
      <Suggestion label="Suggested prompts">
        <SuggestionItem>Summarise this page</SuggestionItem>
        <SuggestionItem prefix={<Search />}>Find related docs</SuggestionItem>
        <SuggestionItem>Draft a reply</SuggestionItem>
      </Suggestion>
      <div style={box}><Suggestion label="On a surface"><SuggestionItem>Explain like I’m new</SuggestionItem></Suggestion></div>
    </Stack>
  ),
  Reasoning: states(["closed", "open", "streaming"], (v) => (
    <div style={{ maxWidth: 520 }}>
      <Reasoning title="Thought for 12 seconds" streaming={v === "streaming"} defaultOpen={v === "open"}>
        The user wants the chat to stay at the bottom. A scroll container can tell whether the reader is at the end.
      </Reasoning>
    </div>
  ), true),
  ThinkingIndicator: () => (
    <Stack gap="md">
      <ThinkingIndicator data-check-text="deep" />
      <div style={box}><ThinkingIndicator label="Searching the web" data-check-text="deep" /></div>
    </Stack>
  ),
  ToolCall: states(["pending", "running", "success", "error"], (v) => (
    <div style={{ maxWidth: 520 }}>
      <ToolCall
        name="search_web"
        status={v as "pending"}
        defaultOpen={v !== "pending"}
        input={'{ "query": "datum design system" }'}
        output={v === "success" ? "3 results: datum.dev, github.com/datum, npm" : undefined}
        error={v === "error" ? "Request timed out after 30s" : undefined}
      />
    </div>
  ), true),
  AgentActivity: () => (
    <div style={{ maxWidth: 520 }} data-check-text="deep">
      <AgentActivity
        items={[
          { kind: "reasoning", status: "success", label: "Planned the change", children: "Read the scroller, then the tests." },
          { kind: "search", status: "success", label: "Searched the docs" },
          { kind: "tool", status: "error", label: "run_tests", children: "2 failing: MessageScroller" },
          { kind: "trace", status: "running", label: "Fixing the scroller" },
          { kind: "tool", status: "pending", label: "npm run build" },
        ]}
      />
    </div>
  ),
  TodoList: () => (
    <div style={{ maxWidth: 520 }} data-check-text="deep">
      <TodoList title="Plan">
        <TodoItem status="done">Read DESIGN.md</TodoItem>
        <TodoItem status="active" metadata="packages/react/src">Rebuild the AI parts</TodoItem>
        <TodoItem status="error" metadata="Contrast 2.9:1 on hover">Pass the checker</TodoItem>
        <TodoItem>Commit and push</TodoItem>
      </TodoList>
    </div>
  ),
  Sources: () => (
    <div style={{ maxWidth: 520, display: "grid", gap: 16 }} data-check-text="deep">
      <Text>
        Datum ships two themes<Citation number={1} href="#source-1" /> and checks each in light and dark<Citation number={2} href="#source-2" />.
      </Text>
      <Sources>
        <Source number={1} title="Datum design guide" href="#" />
        <Source number={2} title="Checking contrast in four combinations" description="datum.dev · 4 min read" href="#" />
      </Sources>
    </div>
  ),
  CodeBlock: () => (
    <div style={{ maxWidth: 520, display: "grid", gap: 16 }} data-check-text="deep">
      <CodeBlock title="Composer.tsx" language="tsx" lines={codeLines} />
      <CodeBlock code={"npm install @datum-design/react @datum-design/styles --save && npm run check -- --all-the-flags"} lineNumbers={false} language="bash" />
    </div>
  ),
  FileDiff: states(["closed", "open", "streaming"], (v) => (
    <div style={{ maxWidth: 520 }}>
      <FileDiff path="src/Composer.tsx" rows={diffRows} defaultOpen={v === "open"} streaming={v === "streaming"} />
    </div>
  ), true),

  // ---------------------------------------------------------------- Data
  Table: states(["default", "sorted", "selected", "single select", "empty", "loading", "error", "narrow"], (v) => (
    <div style={{ maxWidth: v === "narrow" ? 320 : 640 }}>
      {v === "empty" ? (
        <InvoiceTable rows={[]} emptyState="No invoices yet." />
      ) : v === "loading" ? (
        <InvoiceTable rows={[]} loading />
      ) : v === "error" ? (
        <InvoiceTable rows={[]} error="Couldn’t load invoices. Try again." />
      ) : (
        <InvoiceTable
          defaultSortDescriptor={v === "sorted" ? { column: "amount", direction: "descending" } : undefined}
          selectionMode={v === "selected" ? "multiple" : v === "single select" ? "single" : "none"}
          defaultSelectedKeys={v === "selected" || v === "single select" ? new Set(["INV-105"]) : undefined}
          disabledKeys={v === "selected" ? ["INV-107"] : undefined}
        />
      )}
    </div>
  ), true),
  DataTable: states(["default", "searched", "selected", "paged", "loading"], (v) => (
    <div style={{ maxWidth: 720 }}>
      <DataTable
        label="Invoices"
        columns={invoiceColumns}
        rows={invoices}
        rowKey={(r) => r.id}
        searchable
        defaultSearch={v === "searched" ? "paid" : ""}
        selectionMode={v === "selected" ? "multiple" : "none"}
        defaultSelectedKeys={v === "selected" ? new Set(["INV-104", "INV-106"]) : undefined}
        defaultSortDescriptor={{ column: "amount", direction: "ascending" }}
        pageSize={v === "paged" ? 2 : undefined}
        defaultPage={v === "paged" ? 2 : undefined}
        loading={v === "loading"}
        toolbar={<Button intent="neutral" appearance="outline" size="sm">Export</Button>}
      />
    </div>
  ), true),
  Combobox: states(["closed", "open grouped", "filtered", "empty"], (v) =>
    v === "closed" ? (
      <div style={{ ...narrow, display: "grid", gap: "var(--space-default)" }}>
        {sizes.map((size) => (
          <Combobox key={size} size={size} label={`City ${size}`} options={cities} defaultValue="par" helpText="Start typing to filter." />
        ))}
        <Combobox label="Placeholder" options={cities} placeholder="Search cities" required />
        <Combobox label="Invalid" options={cities} errorText="Choose a city." />
        <Combobox label="Read-only" options={cities} defaultValue="tor" readOnly />
        <Combobox label="Disabled" options={cities} defaultValue="nyc" disabled />
        <div style={box}><Combobox label="On a surface" options={cities} /></div>
      </div>
    ) : (
      <div style={narrow}>
        <Combobox
          label="City"
          options={cities}
          defaultValue={v === "open grouped" ? "par" : undefined}
          defaultInputValue={v === "filtered" ? "o" : v === "empty" ? "Lisbon" : undefined}
          defaultOpen
          data-check-skip=""
        />
      </div>
    ), true),
  TagInput: states(["empty", "with tags", "at limit"], (v) => {
    const grid = { ...narrow, display: "grid", gap: "var(--space-default)" };
    if (v === "empty")
      return (
        <div style={grid}>
          <TagInput label="Topics" placeholder="Add a topic" helpText="Press Enter or comma to add." required />
          <TagInput label="Invalid" placeholder="Add a topic" errorText="Add at least one topic." />
          <div style={box}><TagInput label="On a surface" placeholder="Add a topic" /></div>
        </div>
      );
    if (v === "at limit")
      return (
        <div style={grid}>
          <TagInput label="Reviewers" defaultValue={["Ada", "Grace", "Alan"]} maxTags={3} helpText="Up to three." />
          <TagInput label="Keywords" defaultValue={["accessibility", "design tokens", "typography", "motion", "color"]} maxTags={5} />
        </div>
      );
    return (
      <div style={grid}>
        {sizes.map((size) => (
          <TagInput key={size} size={size} label={`Topics ${size}`} defaultValue={["react", "aria"]} placeholder="Add a topic" />
        ))}
        <TagInput label="Invalid" defaultValue={["react"]} errorText="Remove duplicates." />
        <TagInput label="Read-only" defaultValue={["react", "aria"]} readOnly />
        <TagInput label="Disabled" defaultValue={["react", "aria"]} disabled />
      </div>
    );
  }, true),
  CommandPalette: states(["closed", "open grouped", "filtered", "empty", "mobile menu open"], (v) =>
    v === "closed" ? (
      <div className="row">
        <CommandPalette items={commands} trigger={<Button intent="neutral" appearance="outline"><Search /> Search… ⌘K</Button>} />
      </div>
    ) : (
      <CommandPalette items={commands} defaultOpen defaultSearch={v === "filtered" ? "go" : v === "empty" ? "invoices" : undefined} />
    ), true),
  DatePicker: states(["closed", "calendar", "mobile menu calendar"], (v) =>
    v === "closed" ? (
      <div style={{ ...narrow, display: "grid", gap: "var(--space-default)" }}>
        {sizes.map((size) => (
          <DatePicker key={size} size={size} label={`Start ${size}`} defaultValue={picked} helpText="The first day of the project." />
        ))}
        <DatePicker label="Placeholder" required />
        <DatePicker label="Invalid" defaultValue={picked} errorText="Choose a weekday." />
        <DatePicker label="Read-only" defaultValue={picked} readOnly />
        <DatePicker label="Disabled" defaultValue={picked} disabled />
        <div style={box}><DatePicker label="On a surface" /></div>
      </div>
    ) : (
      <DatePicker
        label="Start"
        defaultValue={picked}
        minValue={monthStart.add({ days: 1 })}
        isDateUnavailable={unavailable}
        defaultOpen
        data-check-skip=""
        style={narrow}
      />
    ), true),
  DateRangePicker: states(["closed", "complete range", "mid-selection", "mobile menu range"], (v) =>
    v === "closed" ? (
      <div style={{ ...narrow, display: "grid", gap: "var(--space-default)" }}>
        {sizes.map((size) => (
          <DateRangePicker key={size} size={size} label={`Trip ${size}`} defaultValue={stay} helpText="Check-in to check-out." />
        ))}
        <DateRangePicker label="Placeholder" required />
        <DateRangePicker label="Invalid" defaultValue={stay} errorText="Stays are at most 14 nights." />
        <DateRangePicker label="Read-only" defaultValue={stay} readOnly />
        <DateRangePicker label="Disabled" defaultValue={stay} disabled />
        <div style={box}><DateRangePicker label="On a surface" /></div>
      </div>
    ) : v === "mid-selection" ? (
      <MidRange first={rangeStart} steps={2} />
    ) : (
      <DateRangePicker
        label="Trip"
        defaultValue={stay}
        minValue={monthStart.add({ days: 1 })}
        isDateUnavailable={unavailable}
        defaultOpen
        data-check-skip=""
        style={narrow}
      />
    ), true),
};
