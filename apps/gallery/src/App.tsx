import { useState } from "react";
import {
  Accordion, AccordionItem, Alert, Avatar, AvatarGroup, Badge, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, CardMedia,
  Checkbox, CheckboxGroup, Container, Field, Grid, Heading, Label, Link, ProgressBar, Radio, RadioGroup, Section, Select, Separator,
  Skeleton, Spinner, Stack, Switch, Text, TextField, Textarea, Toaster, toast,
  Dialog, DialogBody, DialogFooter, DialogHeader, DropdownMenu, Sheet, Tooltip, type DropdownMenuItem, type SheetSide,
  Breadcrumbs, BreadcrumbItem, Footer, Navbar, Pagination, Tabs, type NavbarLink, type NavbarLayout, type NavbarAppearance, type TabItem,
  ContextMenu, HoverCard, InputOTP, NumberField, Popover, Slider, type ContextMenuItem,
  type CheckedState, type SelectOption, type ToastIntent, type ToastPosition,
} from "@datum-design/react";
import { Mail, Search, Plus, Star, MoreHorizontal, ArrowRight, X, Trash2, Copy, Pencil, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from "lucide-react";

const intents = ["accent", "neutral", "danger"] as const;
const appearances = ["solid", "soft", "outline", "ghost"] as const;

const ranges = ["Day", "Week", "Month"];
const sections = ["Overview", "Activity", "Settings"];
const aligns = [["Left", AlignLeft], ["Center", AlignCenter], ["Right", AlignRight]] as const;

const buttonProps: [string, string, string, string][] = [
  ["intent", "accent | neutral | danger", "accent", "What the color means. neutral + solid is the ink button."],
  ["appearance", "solid | soft | outline | ghost", "solid", "How much fill."],
  ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."],
  ["prefix / suffix", "ReactNode", "—", "Icon or element before / after the label."],
  ["iconOnly", "boolean", "false", "Circular; requires label."],
  ["label", "string", "—", "Accessible name; required with iconOnly."],
  ["loading", "boolean", "false", "Spinner over the label, no size change; blocks clicks, keeps focus, sets aria-busy."],
  ["disabled", "boolean", "false", "Native disabled."],
  ["pressed / defaultPressed / onPressedChange", "boolean / boolean / (pressed) => void", "—", "Toggle mode via aria-pressed; on = the solid of its intent. pressed is controlled, defaultPressed uncontrolled."],
  ["floating", "boolean", "false", "FAB treatment with overlay shadow."],
  ["fullWidth", "boolean", "false", "Stretches to its container."],
  ["render", "(props) => ReactElement", "—", "Render as an anchor or router Link."],
];

const legacy: [string, string][] = [
  ["primary", "accent · solid"],
  ["secondary", "accent · soft"],
  ["tertiary", "neutral · soft"],
  ["outline", "neutral · outline"],
  ["text", "neutral · ghost"],
  ["danger", "danger · solid"],
  ["danger-soft", "danger · soft"],
  ["link", "dropped — use Link"],
];

type PropRow = [string, string, string, string];

const containerProps: PropRow[] = [
  ["size", "sm | md | lg | xl | full", "xl", "Max content width: 640 / 768 / 1024 / 1280px / none."],
  ["padded", "boolean", "true", "Adds the responsive page gutter (grid.margin, 16–64px) outside the max width."],
];
const stackProps: PropRow[] = [
  ["direction", "vertical | horizontal", "vertical", ""],
  ["gap", "none | xs | sm | md | lg | xl", "md", "0 / 4 / 8 / 16 / 24 / 32px from the space scale."],
  ["align", "start | center | end | stretch | baseline", "stretch", "Cross axis."],
  ["justify", "start | center | end | between", "start", "Main axis."],
  ["wrap", "boolean", "false", "Lets children wrap onto new lines."],
];
const gridProps: PropRow[] = [
  ["columns", "1–12 | { base, md, lg }", "1", "A number applies at every width; an object switches at 768 / 1024px, each step inheriting the one below."],
  ["minItemWidth", "number | string", "—", "Auto-fit: as many columns as fit, each at least this wide. Wins over columns."],
  ["gap", "none | xs | sm | md | lg | xl", "md", "Same scale as Stack."],
];
const sectionProps: PropRow[] = [
  ["spacing", "sm | md | lg", "md", "32 / 64 / 96px vertical padding."],
  ["tone", "default | muted | accent", "default", "bg.page / bg.surface / bg.accentSubtle."],
  ["as", "section | div | header | footer", "section", "The landmark element."],
];
const headingProps: PropRow[] = [
  ["level", "1–6", "2", "Semantic tag, h1–h6."],
  ["size", "display-lg | display-md | display-sm | xl | lg | md | sm", "from level", "Type role. Level 1 → xl, 2 → lg, 3 → md, 4–6 → sm."],
  ["tone", "primary | secondary | accent", "primary", ""],
];
const textProps: PropRow[] = [
  ["variant", "body-lg | body-md | body-sm | paragraph-lg | paragraph-md | label | caption | overline | numeric-lg | numeric-md | numeric-sm | code", "body-md", "One of the type roles. Numeric uses tabular figures; overline is uppercase."],
  ["tone", "primary | secondary | accent | danger | success | warning", "primary", "Two text colors; build hierarchy with the variant, not a third gray."],
  ["weight", "regular | medium | semibold", "from role", "Override only when the role's weight doesn't fit."],
  ["truncate", "boolean | number", "false", "true: one line with an ellipsis. A number: clamp to that many lines."],
  ["as", "p | span | div | label", "p", "htmlFor passes through for label."],
];

const headingSizes = ["display-lg", "display-md", "display-sm", "xl", "lg", "md", "sm"] as const;
const textVariants = [
  ["body-lg", "Interface text, large"],
  ["body-md", "Interface text, the default"],
  ["body-sm", "Interface text, small"],
  ["paragraph-lg", "Long-form reading, looser line height"],
  ["paragraph-md", "Long-form reading, looser line height"],
  ["label", "Form label"],
  ["caption", "Helper text under a field"],
  ["overline", "Category marker"],
  ["numeric-lg", "$12,480.00"],
  ["numeric-md", "1,024 / 2,048"],
  ["numeric-sm", "08:45:12"],
  ["code", "npm install @datum-design/react"],
] as const;
const textTones = ["primary", "secondary", "accent", "danger", "success", "warning"] as const;

const cardProps: PropRow[] = [
  ["appearance", "elevated | outline | soft", "elevated", "Surface shadow / border only / surface fill."],
  ["padding", "sm | md | lg", "md", "16 / 24 / 32px."],
  ["interactive", "boolean", "false", "Whole card is clickable: an <a> with href, a <button> without. Hover lift, press, focus ring."],
  ["href", "string", "—", "With interactive, makes the card a link."],
  ["render", "(props) => ReactElement", "—", "With interactive, render as a router Link."],
  ["slots", "CardMedia · CardHeader · CardBody · CardFooter", "—", "Media bleeds to the edges; the body grows; the footer sits at the bottom."],
];
const badgeIntents = ["accent", "neutral", "danger", "success", "warning", "info"] as const;
const badgeProps: PropRow[] = [
  ["intent", "accent | neutral | danger | success | warning | info", "neutral", "What the color means. neutral + solid is ink."],
  ["appearance", "solid | soft | outline", "soft", "How much fill."],
  ["size", "sm | md", "md", "20 / 24px tall."],
  ["dot", "boolean", "false", "Leading status dot in the text color; decorative."],
];
const avatarProps: PropRow[] = [
  ["size", "xs | sm | md | lg | xl", "md", "24 / 32 / 40 / 48 / 64px."],
  ["shape", "circle | square", "circle", "Square uses radius.subtle."],
  ["src / name", "string", "—", "Falls back to initials from name, then an icon. name is the accessible name."],
  ["status", "online | away | busy | offline", "—", "Presence dot; added to the accessible name."],
  ["AvatarGroup", "max, size, shape", "—", "Overlapping stack with \"+N\"."],
];
const separatorProps: PropRow[] = [
  ["orientation", "horizontal | vertical", "horizontal", "Vertical stretches to its row."],
  ["tone", "subtle | default", "subtle", "border.subtle / border.default."],
  ["label", "string", "—", "Text in the middle, e.g. \"or\"; also the accessible name."],
];
const accordionProps: PropRow[] = [
  ["type", "single | multiple", "single", "One item open at a time, or any number."],
  ["appearance", "plain | bordered | separated", "bordered", "No lines / one box / a card per item."],
  ["collapsible", "boolean", "true", "With single: allow closing the open item."],
  ["value / defaultValue / onValueChange", "string | string[]", "—", "Open items by their AccordionItem value."],
  ["disabled", "boolean", "false", "On Accordion or on one AccordionItem."],
  ["headingLevel", "2–6", "3", "The heading that wraps each trigger."],
  ["AccordionItem", "title, value, disabled", "—", "title is the trigger label."],
];
const alertIntents = ["info", "success", "warning", "danger", "neutral"] as const;
const alertProps: PropRow[] = [
  ["intent", "info | success | warning | danger | neutral", "info", "Picks the icon. danger is role=alert (interrupts); the rest are role=status."],
  ["appearance", "soft | outline | solid", "soft", "Tint / border only / one row in the intent's fill (neutral is ink)."],
  ["fullBleed", "boolean", "false", "Square ends, no side borders — only when it touches both edges of the viewport."],
  ["title / description", "ReactNode", "—", "Title in the label weight, description a step down (body-sm). Both text.primary."],
  ["action", "ReactNode", "—", "A Button or Link. Under the text; at the end of the row in a banner."],
  ["dismissible", "boolean", "false", "Adds a Dismiss button."],
  ["open / defaultOpen / onOpenChange", "boolean / boolean / (open) => void", "— / true / —", "Visibility. Dismiss calls onOpenChange(false); uncontrolled alerts hide themselves."],
];
const toastProps: PropRow[] = [
  ["toast(options)", "→ key", "—", "Adds a toast to the queue. toast.close(key) removes it."],
  ["intent", "neutral | success | danger | warning | info", "neutral", "Every intent but neutral shows its icon on the same raised surface."],
  ["title / description", "ReactNode", "—", "Name and description of the toast (aria-labelledby / describedby)."],
  ["action", "{ label, onAction }", "—", "One follow-up, e.g. Undo. Running it also closes the toast."],
  ["duration", "ms | null", "5000", "Pauses while the pointer or focus is on any toast. null stays until closed."],
  ["position", "top-center | top-end | bottom-center | bottom-end", "bottom-end", "On <Toaster>. The newest toast is nearest the edge."],
];
const spinnerProps: PropRow[] = [
  ["size", "sm | md | lg", "md", "16 / 20 / 24px."],
  ["tone", "current | accent", "current", "current inherits the text color; accent is text.accent."],
  ["label", "string", "\"Loading\"", "Screen-reader text in a role=status."],
];
const progressProps: PropRow[] = [
  ["value", "0–100", "—", "Omit for indeterminate: a sliding segment, no value announced."],
  ["size", "sm | md", "md", "4 / 8px track."],
  ["intent", "accent | success | warning | danger", "accent", "The fill uses the intent's text color, so it reaches 3:1 in every mode."],
  ["label", "string", "—", "Visible above the track; the accessible name. Without it, pass aria-label."],
  ["showValue", "boolean", "false", "Rounded percentage opposite the label (determinate only)."],
];
const skeletonProps: PropRow[] = [
  ["shape", "text | rect | circle", "text", "A text line / a block such as an image / an avatar."],
  ["lines", "number", "1", "Text only; the last of several lines is shorter."],
  ["animated", "boolean", "true", "Pulses the fill; always off under reduced motion."],
  ["width / height", "CSS length", "100% / 120px", "Width is also a circle's diameter (default 40px); height is for rect."],
];
const toastExamples: [ToastIntent, string, string][] = [
  ["neutral", "Link copied", "Anyone with the link can view."],
  ["success", "Invoice sent", "Ada will get it in a minute."],
  ["warning", "Storage almost full", "You've used 90% of your plan."],
  ["danger", "Upload failed", "The file is larger than 25 MB."],
  ["info", "New version available", "Reload to update."],
];
const people = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Katherine Johnson", "Edsger Dijkstra", "Barbara Liskov"];
const faq = [
  ["refund", "Can I get a refund?", "Yes, within 30 days of purchase, no questions asked."],
  ["seats", "How do seats work?", "Each person who signs in uses one seat. Remove someone and their seat frees up the same day."],
  ["cancel", "What happens when I cancel?", "Your workspace stays readable for 90 days, so you can export everything."],
] as const;

const fieldProps: PropRow[] = [
  ["label", "string", "— (required)", "Always visible — never replaced by a placeholder."],
  ["helpText", "string", "—", "Under the control, ui.caption in text.secondary. Replaced by errorText."],
  ["errorText", "string", "—", "Sets aria-invalid and data-invalid, draws border.danger, and describes the control."],
  ["required", "boolean", "false", "A * after the label (hidden from screen readers) and required on the control."],
  ["disabled", "boolean", "false", "Dims the whole field to 0.5 and disables the control."],
  ["readOnly", "boolean", "false", "Focusable and full contrast, but a dashed edge and no fill — never dimmed."],
  ["children", "element | (control) => ReactNode", "—", "Field only: the control. A function receives id and aria props to spread."],
];
const labelProps: PropRow[] = [
  ["required", "boolean", "false", "Adds the * marker."],
  ["as", "label | span", "label", "span names a group or widget through aria-labelledby."],
];
const textFieldProps: PropRow[] = [
  ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."],
  ["type", "text | email | password | search | url | tel | number", "text", "The native input type."],
  ["prefix / suffix", "ReactNode", "—", "Icon or text inside the box, in text.secondary."],
  ["clearable", "boolean", "false", "A Clear button while there is a value; focus returns to the input."],
  ["revealable", "boolean", "false", "Show / hide for type=password (aria-pressed)."],
  ["value / defaultValue / onValueChange", "string / string / (value) => void", "— / \"\" / —", "Controlled or uncontrolled; Clear calls onValueChange(\"\")."],
  ["…Field props", "—", "—", "label, helpText, errorText, required, disabled, readOnly."],
];
const textareaProps: PropRow[] = [
  ["size", "sm | md | lg", "md", "Type size and padding, matching TextField."],
  ["rows", "number", "3", "Visible lines (the starting height with autoResize)."],
  ["autoResize", "boolean", "false", "Grows with its content; no resize handle."],
  ["maxLength", "number", "—", "Caps the length and shows n/max under the field, read with the description."],
  ["value / defaultValue / onValueChange", "string / string / (value) => void", "— / \"\" / —", "Controlled or uncontrolled."],
  ["…Field props", "—", "—", "label, helpText, errorText, required, disabled, readOnly."],
];
const checkboxProps: PropRow[] = [
  ["size", "sm | md", "md", "16 / 20px box; the label steps body-sm / body-md."],
  ["checked / defaultChecked / onCheckedChange", "true | false | \"indeterminate\"", "— / false / —", "A press always lands on true or false."],
  ["label / description", "ReactNode", "—", "The description is a second line in text.secondary, read as the description, not the name."],
  ["invalid / required / disabled", "boolean", "false", "Standalone checkbox states."],
  ["CheckboxGroup", "orientation, size, value / defaultValue / onValueChange (string[]), …Field props", "vertical", "A labelled group; each Checkbox needs a value."],
];
const radioProps: PropRow[] = [
  ["size", "sm | md", "md", "On RadioGroup (or one Radio)."],
  ["orientation", "vertical | horizontal", "vertical", "On RadioGroup. Arrow keys move the selection either way."],
  ["appearance", "default | card", "default", "card = large selectable tiles (e.g. pricing plans); children add content under the description."],
  ["value / defaultValue / onValueChange", "string", "—", "On RadioGroup."],
  ["…Field props", "—", "—", "On RadioGroup: label, helpText, errorText, required, disabled, readOnly."],
  ["Radio", "value, label, description, disabled", "—", "Must be inside a RadioGroup."],
];
const switchProps: PropRow[] = [
  ["size", "sm | md", "md", "32 × 20 / 40 × 24px track."],
  ["labelPosition", "start | end", "end", "start puts the label first and the switch at the end of the row."],
  ["description", "ReactNode", "—", "A second line under the label."],
  ["checked / defaultChecked / onCheckedChange", "boolean", "— / false / —", "Applies at once — no Save step."],
  ["disabled", "boolean", "false", ""],
];
const selectProps: PropRow[] = [
  ["size", "sm | md | lg", "md", "32 / 40 / 48px trigger; +4px on touch screens."],
  ["options", "{ value, label, description?, disabled?, group? }[]", "—", "Options sharing a group are listed under its heading, with a divider between groups."],
  ["placeholder", "string", "\"Select…\"", "Shown in text.secondary while nothing is selected."],
  ["value / defaultValue / onValueChange", "string | null", "— / null / —", "The selected option's value."],
  ["open / defaultOpen / onOpenChange", "boolean", "— / false / —", "Whether the list is open."],
  ["name", "string", "—", "Submitted through a hidden native select."],
  ["…Field props", "—", "—", "label, helpText, errorText, required, disabled, readOnly (never opens)."],
];
const countries: SelectOption[] = [
  { value: "us", label: "United States", group: "Americas" },
  { value: "ca", label: "Canada", group: "Americas" },
  { value: "br", label: "Brazil", group: "Americas" },
  { value: "fr", label: "France", group: "Europe" },
  { value: "de", label: "Germany", group: "Europe" },
  { value: "ru", label: "Russia", group: "Europe", disabled: true },
];
const roles: SelectOption[] = [
  { value: "viewer", label: "Viewer", description: "Can read and comment" },
  { value: "editor", label: "Editor", description: "Can change content" },
  { value: "admin", label: "Admin", description: "Can manage members and billing" },
];
const openStateRows: PropRow[] = [
  ["open", "boolean", "—", "Controlled open state. Pair with onOpenChange."],
  ["defaultOpen", "boolean", "false", "Uncontrolled starting state."],
  ["onOpenChange", "(open) => void", "—", "Called on every open and close, from any cause."],
];
const dialogProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "Element that opens it, usually a Button. Optional: without one, drive open yourself. Focus returns to it on close."],
  ...openStateRows,
  ["size", "sm | md | lg | full", "md", "400 / 560 / 720px wide, or the whole viewport (square corners, like any full-bleed band)."],
  ["role", "dialog | alertdialog", "dialog", "alertdialog for destructive confirmations."],
  ["dismissible", "boolean", "true", "Escape, a click on the scrim, and DialogHeader's close button."],
  ["children", "slots | (close) => ReactNode", "—", "DialogHeader (title + description), DialogBody, DialogFooter."],
];
const sheetProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "As Dialog."],
  ...openStateRows,
  ["side", "top | right | bottom | left", "right", "The edge it slides in from. The edge facing the page is rounded; the viewport edges are square."],
  ["size", "sm | md | lg", "md", "320 / 420 / 560px — width from the sides, height from the top or bottom. Always leaves a strip of scrim."],
  ["children", "slots | (close) => ReactNode", "—", "The same slots as Dialog. Always dismissible."],
];
const menuProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "Required. The element that opens the menu, usually a Button."],
  ["items", "DropdownMenuItem[]", "—", "Actions, checkbox and radio items, separators and labelled sections."],
  ["placement", "bottom-start | bottom-end | top-start | top-end", "bottom-start", "Flips when there is no room."],
  ["size", "sm | md", "md", "32 / 40px items; both grow to 44px on touch screens."],
  ...openStateRows,
];
const tooltipProps: PropRow[] = [
  ["content", "string", "—", "Plain text only. A tooltip is never interactive."],
  ["children", "ReactElement", "—", "The focusable element it describes."],
  ["placement", "top | right | bottom | left", "top", "Flips when there is no room."],
  ["delay", "number (ms)", "500", "Hover delay. Keyboard focus shows it at once."],
  ...openStateRows,
];
const popoverProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "Required. The element that opens it, usually a Button."],
  ["title", "ReactNode", "—", "A heading that also names the dialog. Without one, the trigger's text names it (or pass aria-label)."],
  ["placement", "top | top-start | top-end | bottom | bottom-start | bottom-end | left | right", "bottom", "Flips when there is no room."],
  ...openStateRows,
];
const hoverCardProps: PropRow[] = [
  ["trigger", "ReactElement", "—", "Required. A focusable element it previews, usually a Link."],
  ["placement", "top | right | bottom | left", "bottom", "Flips when there is no room."],
  ["openDelay / closeDelay", "number (ms)", "500 / 300", "The close delay is time to move onto the card, which keeps it open."],
  ...openStateRows,
];
const contextMenuProps: PropRow[] = [
  ["children", "ReactNode", "—", "The region that opens the menu when right-clicked."],
  ["items", "ContextMenuItem[]", "—", "The same item kinds as DropdownMenu: actions, links, checkboxes, radios, separators, sections."],
  ["size", "sm | md", "md", "32 / 40px items; both grow to 44px on touch screens."],
  ["menuLabel", "string", "Context menu", "Names the menu for assistive tech."],
  ["disabled", "boolean", "false", "Leaves the browser's own context menu in place."],
  ...openStateRows,
];
const numberFieldProps: PropRow[] = [
  ["label / helpText / errorText", "string", "—", "As every field: wired by useField."],
  ["value / defaultValue / onValueChange", "number / number / (value) => void", "NaN (empty)", "Committed on blur, Enter, a step or a stepper press. NaN means empty."],
  ["min / max / step", "number", "— / — / 1", "Typed values are clamped and snapped on commit."],
  ["formatOptions", "Intl.NumberFormatOptions", "—", "Currency, percent, units, decimals — shown and parsed."],
  ["size", "sm | md | lg", "md", "32 / 40 / 48px; +4px on touch screens."],
  ["hideSteppers", "boolean", "false", "Drops − and +; arrow keys still step."],
  ["required / disabled / readOnly", "boolean", "false", "Read-only hides the steppers and draws a dashed edge."],
];
const sliderProps: PropRow[] = [
  ["label", "string", "—", "Names the slider; or pass aria-label for none."],
  ["value / defaultValue / onValueChange", "number | number[]", "min", "Two numbers make a range with two thumbs."],
  ["onValueCommit", "(value) => void", "—", "Once a drag or key press ends — for heavy work."],
  ["min / max / step", "number", "0 / 100 / 1", ""],
  ["formatOptions", "Intl.NumberFormatOptions", "—", "How the value is shown and announced."],
  ["showValue", "boolean", "true with a label", "The value beside the label."],
  ["size", "sm | md", "md", "4 / 6px rail, 16 / 20px thumb; a 44px hit area on touch."],
  ["disabled", "boolean", "false", ""],
];
const otpProps: PropRow[] = [
  ["label / helpText / errorText", "string", "—", "As every field; the cells form a group named by the label."],
  ["length", "number", "6", "Number of digits."],
  ["value / defaultValue / onValueChange", "string", "\"\"", "The code so far."],
  ["onComplete", "(code) => void", "—", "Once every digit is filled."],
  ["size", "sm | md | lg", "md", "36 / 44 / 52px round cells; never under 44px on touch."],
  ["name", "string", "—", "Submits the code as one value."],
  ["required / disabled / readOnly", "boolean", "false", ""],
];
const contextItems: ContextMenuItem[] = [
  { label: "Copy", icon: <Copy />, shortcut: "⌘C" },
  { label: "Rename", icon: <Pencil /> },
  { type: "separator" },
  { label: "Delete", intent: "danger", icon: <Trash2 />, shortcut: "⌫" },
];
const tabsProps: PropRow[] = [
  ["items", "{ value, label, icon, disabled, content }[]", "—", "content becomes the tab panel, wired with aria-controls; leave it out to render the view yourself."],
  ["value / defaultValue / onValueChange", "string / string / (value) => void", "first enabled tab", "The selected tab."],
  ["appearance", "underline | pill | segmented", "underline", "An accent bar on a hairline / an ink pill / a raised thumb on a track."],
  ["size", "sm | md", "md", "32 / 40px; +4px on touch screens."],
  ["orientation", "horizontal | vertical", "horizontal", "Arrow keys follow the orientation."],
  ["fullWidth", "boolean", "false", "Tabs share the width of the row."],
];
const breadcrumbsProps: PropRow[] = [
  ["separator", "chevron | slash", "chevron", "Drawn between items, hidden from screen readers."],
  ["size", "sm | md", "md", "body-sm / body-md."],
  ["maxItems", "number", "—", "Collapses the middle into a … button that shows the rest."],
  ["BreadcrumbItem current", "boolean", "false", "The current page: plain text with aria-current=\"page\"."],
];
const paginationProps: PropRow[] = [
  ["pageCount", "number", "—", "How many pages there are."],
  ["value / defaultValue / onValueChange", "number / number / (page) => void", "1", "The current page."],
  ["size", "sm | md", "md", "32 / 40px Buttons; +4px on touch screens."],
  ["siblings", "number", "1", "Page numbers either side of the current one."],
  ["compact", "boolean", "false", "\"Page 3 of 12\" with arrows only."],
  ["getHref", "(page) => string", "—", "Renders pages as links, so they can be crawled and opened in a new tab."],
];
const footerProps: PropRow[] = [
  ["columns", "{ title, links: { label, href }[] }[]", "—", "One column per group; they wrap on narrow screens."],
  ["bottom", "ReactNode", "—", "Legal, copyright, social."],
  ["tone", "default | muted", "muted", "muted sits on bg.surface; default on the page with a hairline above."],
  ["maxWidth", "Container size", "xl", "Match the Navbar's maxWidth so both line up with the page."],
  ["children", "ReactNode", "—", "The lead column: a logo and a line about the site."],
];
const navbarProps: PropRow[] = [
  ["layout", "standard | start | centered", "standard", "Logo left, links center / logo and links left / logo in the middle."],
  ["appearance", "solid | blur | transparent | inverse", "solid", "transparent turns solid on scroll; inverse is an ink band."],
  ["position", "static | sticky | fixed", "sticky", ""],
  ["hideOnScroll", "boolean", "false", "Slides away scrolling down, returns scrolling up or on focus."],
  ["size", "compact | default", "default", "56 / 72px tall."],
  ["bordered", "boolean", "true", "Hairline under the bar."],
  ["links", "{ label, href, icon, badge, active, items, columns }[]", "—", "items opens a dropdown; columns opens a mega menu with descriptions."],
  ["activeHref", "string", "—", "Marks the current page (and the menu holding it) with aria-current."],
  ["logo / search / actions / announcement", "ReactNode", "—", "announcement is a thin bar above the navbar."],
  ["mobileBreakpoint", "sm | md | lg", "md", "Below 640 / 768 / 1024px the links move into a Sheet with accordion groups."],
  ["maxWidth", "Container size", "xl", "Keeps the bar aligned with page content."],
  ["open / defaultOpen / onOpenChange", "boolean / boolean / (open) => void", "—", "The mobile menu."],
];
const tabItems: TabItem[] = [
  { value: "overview", label: "Overview", content: <p className="lead">Overview: the numbers that matter this week.</p> },
  { value: "activity", label: "Activity", content: <p className="lead">Activity: every change, newest first.</p> },
  { value: "settings", label: "Settings", content: <p className="lead">Settings: names, members and billing.</p> },
  { value: "archive", label: "Archive", disabled: true },
];
const plainTabs = tabItems.map(({ content: _content, ...item }) => item);
const navLinks: NavbarLink[] = [
  { label: "Product", href: "#product" },
  { label: "Docs", href: "#docs", badge: "New" },
  { label: "Resources", items: [{ label: "Blog", href: "#blog" }, { label: "Guides", href: "#guides" }, { label: "Changelog", href: "#changelog" }] },
  {
    label: "Solutions",
    columns: [
      { title: "By team", items: [{ label: "Design", href: "#design", description: "Tokens, themes and a gallery" }, { label: "Engineering", href: "#eng", description: "React components on React Aria" }] },
      { title: "By site", items: [{ label: "Marketing", href: "#marketing", description: "Heroes, pricing, footers" }, { label: "Docs", href: "#docs-sites", description: "Navigation that scales" }] },
    ],
  },
];
const navbarLayouts: NavbarLayout[] = ["standard", "start", "centered"];
const navbarAppearances: NavbarAppearance[] = ["solid", "blur", "transparent", "inverse"];
const DemoNavbar = (props: Partial<Parameters<typeof Navbar>[0]>) => (
  <Navbar
    position="static"
    links={navLinks}
    activeHref="#docs"
    maxWidth="full"
    logo={<a href="#navbar">Datum</a>}
    actions={<><Button intent="neutral" appearance="ghost" size="sm">Sign in</Button><Button size="sm">Get started</Button></>}
    {...props}
  />
);
const footerColumns = [
  { title: "Product", links: [{ label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }, { label: "Docs", href: "#" }] },
  { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }] },
];
const sheetSides: SheetSide[] = ["right", "left", "top", "bottom"];
const moreIcon = <MoreHorizontal />;

function MenuDemo({ size = "md" as const }: { size?: "sm" | "md" }) {
  const [grid, setGrid] = useState(true);
  const [rulers, setRulers] = useState(false);
  const [sort, setSort] = useState("name");
  const items: DropdownMenuItem[] = [
    { label: "Edit", shortcut: "⌘E" },
    { label: "Duplicate", shortcut: "⌘D" },
    { label: "Archive", disabled: true },
    { type: "separator" },
    { type: "checkbox", label: "Show grid", checked: grid, onCheckedChange: setGrid },
    { type: "checkbox", label: "Show rulers", checked: rulers, onCheckedChange: setRulers },
    {
      type: "section",
      label: "Sort by",
      items: ["name", "date", "size"].map((k) => ({ type: "radio" as const, id: k, label: k[0].toUpperCase() + k.slice(1), checked: sort === k, onSelect: () => setSort(k) })),
    },
    { type: "separator" },
    { label: "Delete", intent: "danger", icon: <Trash2 />, shortcut: "⌫" },
  ];
  return <DropdownMenu size={size} trigger={<Button intent="neutral" appearance="outline" suffix={moreIcon}>{size === "sm" ? "Small" : "Options"}</Button>} items={items} />;
}

const toppingOptions = [["cheese", "Cheese"], ["olives", "Olives"], ["basil", "Basil"]] as const;

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <table className="props-table">
      <thead>
        <tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr>
      </thead>
      <tbody>
        {rows.map(([prop, values, def, note]) => (
          <tr key={prop}>
            <th scope="row"><code>{prop}</code></th>
            <td><code>{values}</code></td>
            <td><code>{def}</code></td>
            <td>{note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Usage({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="usage-grid">
      <div>
        <h3>Do</h3>
        <ul>{dos.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
      <div>
        <h3>Don't</h3>
        <ul>{donts.map((d) => <li key={d}>{d}</li>)}</ul>
      </div>
    </div>
  );
}

const Cell = ({ children }: { children: string }) => <div className="demo-cell">{children}</div>;

export function App() {
  const [pressed, setPressed] = useState(false);
  const [range, setRange] = useState("Week");
  const [period, setPeriod] = useState("Monthly");
  const [align, setAlign] = useState("Left");
  const [section, setSection] = useState("Overview");
  const [toastPosition, setToastPosition] = useState<ToastPosition>("bottom-end");
  const [bannerOpen, setBannerOpen] = useState(true);
  const [progress, setProgress] = useState(40);
  const [toppings, setToppings] = useState<string[]>(["cheese"]);
  const allToppings: CheckedState = toppings.length === toppingOptions.length ? true : toppings.length ? "indeterminate" : false;
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "orange");
  const [mode, setMode] = useState(() =>
    matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

  function switchTheme(next: string) {
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }

  function switchMode(next: string) {
    document.documentElement.style.colorScheme = next;
    setMode(next);
  }

  return (
    <div className="doc">
      <div className="switches">
        <div className="theme-switch" role="group" aria-label="Theme">
          {["orange", "navy"].map((t) => (
            <button key={t} type="button" aria-pressed={theme === t} onClick={() => switchTheme(t)}>
              {t}
            </button>
          ))}
        </div>
        <div className="theme-switch" role="group" aria-label="Mode">
          {["light", "dark"].map((m) => (
            <button key={m} type="button" aria-pressed={mode === m} onClick={() => switchMode(m)}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <nav className="doc-nav">
        <a href="#button">Button</a>
        <a href="#icon-only">Icon-only</a>
        <a href="#toggle">Toggle</a>
        <a href="#floating">Floating (FAB)</a>
        <a href="#button-group">Button Group</a>
        <a href="#link">Link</a>
        <a href="#container">Container</a>
        <a href="#stack">Stack</a>
        <a href="#grid">Grid</a>
        <a href="#section">Section</a>
        <a href="#heading">Heading</a>
        <a href="#text">Text</a>
        <a href="#card">Card</a>
        <a href="#badge">Badge</a>
        <a href="#avatar">Avatar</a>
        <a href="#separator">Separator</a>
        <a href="#accordion">Accordion</a>
        <a href="#alert">Alert</a>
        <a href="#toast">Toast</a>
        <a href="#spinner">Spinner</a>
        <a href="#progress-bar">Progress Bar</a>
        <a href="#skeleton">Skeleton</a>
        <a href="#field">Field + Label</a>
        <a href="#text-field">Text Field</a>
        <a href="#textarea">Textarea</a>
        <a href="#checkbox">Checkbox</a>
        <a href="#radio">Radio</a>
        <a href="#switch">Switch</a>
        <a href="#select">Select</a>
        <a href="#number-field">Number Field</a>
        <a href="#slider">Slider</a>
        <a href="#input-otp">Input OTP</a>
        <a href="#dialog">Dialog</a>
        <a href="#sheet">Sheet</a>
        <a href="#dropdown-menu">Dropdown Menu</a>
        <a href="#tooltip">Tooltip</a>
        <a href="#popover">Popover</a>
        <a href="#hover-card">Hover Card</a>
        <a href="#context-menu">Context Menu</a>
        <a href="#tabs">Tabs</a>
        <a href="#breadcrumbs">Breadcrumbs</a>
        <a href="#pagination">Pagination</a>
        <a href="#footer">Footer</a>
        <a href="#navbar">Navbar</a>
      </nav>
      <Toaster position={toastPosition} />

      {/* ============ BUTTON ============ */}
      <section className="component-doc" id="button">
        <h1>Button</h1>
        <p className="dek">
          The core action. Three props decide how it looks: <span className="prop-values">intent</span> is what the color
          means, <span className="prop-values">appearance</span> is how much fill, and <span className="prop-values">size</span>{" "}
          is how tall. Always a pill. Icon-only, toggle and floating are modes of the same component.
        </p>

        <div className="example-box">
          <Button>Get started</Button>
          <Button intent="neutral" appearance="outline">Learn more</Button>
        </div>

        <div className="doc-section">
          <h2>Intent × appearance</h2>
          <p className="lead">
            Twelve combinations, all checked for contrast in orange and navy, light and dark. Neutral + solid is the{" "}
            <b>ink</b> button (<b>bg.inverse</b> / <b>text.onInverse</b>).
          </p>
          <div className="matrix" role="table" aria-label="Intent by appearance">
            <div role="row" className="matrix-row">
              <span role="columnheader" />
              {appearances.map((a) => (
                <span role="columnheader" key={a} className="matrix-head">{a}</span>
              ))}
            </div>
            {intents.map((intent) => (
              <div role="row" className="matrix-row" key={intent}>
                <span role="rowheader" className="matrix-head">{intent}</span>
                {appearances.map((appearance) => (
                  <span role="cell" key={appearance}>
                    <Button intent={intent} appearance={appearance}>
                      {intent === "danger" ? "Delete" : "Button"}
                    </Button>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">32, 40 and 48px tall with a mouse or trackpad; each grows by 4px on touch screens, so md meets the 44px target.</p>
          <div className="sample-box">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Prefix and suffix</h2>
          <div className="sample-box">
            <Button intent="neutral" appearance="soft" prefix={<Search />}>Search</Button>
            <Button suffix={<ArrowRight />}>Continue</Button>
            <Button intent="danger" appearance="outline" prefix={<Trash2 />}>Delete</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>States</h2>
          <p className="lead">
            Default, hover (the fill changes to its hover token), focus (a <b>border.focus</b> ring — press Tab to see it), pressed, disabled and loading. Loading swaps the
            prefix for a spinner and blocks clicks but keeps focus, so a submit button doesn't drop the keyboard user.
          </p>
          <div className="sample-box">
            <Button disabled>Disabled</Button>
            <Button intent="neutral" appearance="outline" disabled>Disabled</Button>
            <Button loading>Saving</Button>
            <Button intent="neutral" appearance="soft" loading>Loading</Button>
            <Button intent="neutral" appearance="outline" pressed={false} onPressedChange={() => {}}>Not pressed</Button>
            <Button intent="neutral" appearance="outline" pressed onPressedChange={() => {}}>Pressed</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Full width</h2>
          <div className="sample-box stack">
            <Button fullWidth size="lg">Create account</Button>
            <Button fullWidth intent="neutral" appearance="outline" size="lg">Sign in</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Render as a link</h2>
          <p className="lead">Use <b>render</b> when the action navigates, so it is a real anchor (or your router's Link).</p>
          <div className="sample-box">
            <Button appearance="soft" suffix={<ArrowRight />} render={(props) => <a href="#link" {...props} />}>
              Read the docs
            </Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <table className="props-table">
            <thead>
              <tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr>
            </thead>
            <tbody>
              {buttonProps.map(([prop, values, def, note]) => (
                <tr key={prop}>
                  <th scope="row"><code>{prop}</code></th>
                  <td><code>{values}</code></td>
                  <td><code>{def}</code></td>
                  <td>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <div className="usage-grid">
            <div>
              <h3>Do</h3>
              <ul>
                <li>Use one solid accent (or danger) button per view region.</li>
                <li>Pair a solid with a soft, outline or ghost button for secondary actions.</li>
                <li>Keep size consistent within a region.</li>
              </ul>
            </div>
            <div>
              <h3>Don't</h3>
              <ul>
                <li>Put two solid accent buttons side by side.</li>
                <li>Rely on color alone for danger — say what gets deleted.</li>
                <li>Use Button for navigation without <span className="prop-values">render</span>; use Link in running text.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Migrating from variant</h2>
          <div className="sample-box column" style={{ padding: 0, border: "none", background: "none", gap: 0 }}>
            {legacy.map(([from, to]) => (
              <div className="variant-row" key={from}>
                <span className="name">{from}</span>
                <span className="desc">{to}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ICON-ONLY ============ */}
      <section className="component-doc" id="icon-only">
        <h1>Icon-only</h1>
        <p className="dek">Same Button, <span className="prop-values">iconOnly</span> set — no separate Icon Button component. Always requires <span className="prop-values">label</span>, since there's no visible text to fall back on.</p>

        <div className="example-box">
          <Button iconOnly label="Search" intent="neutral" appearance="ghost"><Search /></Button>
        </div>

        <div className="doc-section">
          <h2>Appearances &amp; sizes</h2>
          <div className="sample-box">
            <Button iconOnly label="More" intent="neutral" appearance="ghost" size="sm"><MoreHorizontal /></Button>
            <Button iconOnly label="More" intent="neutral" appearance="outline"><MoreHorizontal /></Button>
            <Button iconOnly label="Add" intent="neutral"><Plus /></Button>
            <Button iconOnly label="Next" size="lg"><ArrowRight /></Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Common use: dismiss controls</h2>
          <p className="lead">A neutral, ghost, sm, icon-only Button with an X glyph covers toasts, modals, and dialogs.</p>
          <div className="sample-box">
            <Button iconOnly label="Close" intent="neutral" appearance="ghost" size="sm"><X /></Button>
          </div>
        </div>
      </section>

      {/* ============ TOGGLE ============ */}
      <section className="component-doc" id="toggle">
        <h1>Toggle</h1>
        <p className="dek">Same Button, with <span className="prop-values">pressed</span> or <span className="prop-values">defaultPressed</span> — a persistent on/off state exposed via aria-pressed. When on, it takes the solid treatment of its own intent: neutral turns ink, accent turns accent.</p>

        <div className="example-box">
          <Button pressed={pressed} onPressedChange={setPressed} intent="neutral" appearance="outline" prefix={<Star />}>
            Favorite
          </Button>
        </div>

        <div className="doc-section">
          <h2>Off / on</h2>
          <div className="sample-box">
            <Button intent="neutral" appearance="outline" pressed={false} onPressedChange={() => {}}>Off</Button>
            <Button intent="neutral" appearance="outline" pressed onPressedChange={() => {}}>On</Button>
            <Button appearance="soft" pressed={false} onPressedChange={() => {}}>Off</Button>
            <Button appearance="soft" pressed onPressedChange={() => {}}>On</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Controlled or uncontrolled</h2>
          <p className="lead">Like every piece of state in Datum, it comes as a trio. <b>pressed</b> + <b>onPressedChange</b>: you hold the state (the Favorite button above). <b>defaultPressed</b>: the button holds it and starts where you say; <b>onPressedChange</b> still reports each change. These formatting toggles are uncontrolled — Bold starts on.</p>
          <div className="sample-box">
            <Button iconOnly label="Bold" intent="neutral" appearance="ghost" defaultPressed><Bold /></Button>
            <Button iconOnly label="Italic" intent="neutral" appearance="ghost" defaultPressed={false}><Italic /></Button>
            <Button iconOnly label="Underline" intent="neutral" appearance="ghost" defaultPressed={false}><Underline /></Button>
          </div>
        </div>
      </section>

      {/* ============ FLOATING (FAB) ============ */}
      <section className="component-doc" id="floating">
        <h1>Floating (FAB)</h1>
        <p className="dek">Same Button, <span className="prop-values">floating</span> set — the single most important action on a screen, floats above content and stays reachable while scrolling.</p>

        <div className="example-box">
          <Button floating iconOnly label="New project"><Plus /></Button>
        </div>

        <div className="doc-section">
          <h2>Icon-only vs. extended</h2>
          <div className="sample-box">
            <Button floating iconOnly label="New project"><Plus /></Button>
            <Button floating prefix={<Plus />}>New project</Button>
            <Button floating intent="neutral" prefix={<Plus />}>New project</Button>
          </div>
        </div>
      </section>

      {/* ============ BUTTON GROUP ============ */}
      <section className="component-doc" id="button-group">
        <h1>Button Group</h1>
        <p className="dek">Related actions as one unit. Spaced by default. <span className="prop-values">attached</span> joins them into one track, where the pressed segment is a raised thumb: a view switcher. Either way the group hugs its content, and vertical groups are as wide as their widest button.</p>

        <div className="example-box">
          <ButtonGroup attached aria-label="Range">
            {ranges.map((r) => (
              <Button key={r} pressed={range === r} onPressedChange={() => setRange(r)}>{r}</Button>
            ))}
          </ButtonGroup>
        </div>

        <div className="doc-section">
          <h2>Attached</h2>
          <p className="lead">One track, no lines between segments. Give each Button <b>pressed</b>; the pressed one becomes the thumb. Works with text or icon-only segments, in every size.</p>
          <div className="sample-box">
            <ButtonGroup attached size="sm" aria-label="Range, small">
              {ranges.map((r) => (
                <Button key={r} pressed={range === r} onPressedChange={() => setRange(r)}>{r}</Button>
              ))}
            </ButtonGroup>
            <ButtonGroup attached aria-label="Alignment">
              {aligns.map(([name, Icon]) => (
                <Button key={name} iconOnly label={name} pressed={align === name} onPressedChange={() => setAlign(name)}><Icon /></Button>
              ))}
            </ButtonGroup>
          </div>
        </div>

        <div className="doc-section">
          <h2>Vertical</h2>
          <p className="lead">A tall track uses the 20px card radius, since a tall box is never a pill. Its segments use 20px minus the 4px inset, so the thumb's corners run parallel to the track's. Items share the widest item's width.</p>
          <div className="sample-box">
            <ButtonGroup attached orientation="vertical" aria-label="Section">
              {sections.map((x) => (
                <Button key={x} pressed={section === x} onPressedChange={() => setSection(x)}>{x}</Button>
              ))}
            </ButtonGroup>
            <ButtonGroup orientation="vertical" intent="neutral" appearance="outline" aria-label="Export">
              <Button>Export CSV</Button>
              <Button>Export PDF</Button>
              <Button>Share link</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className="doc-section">
          <h2>Spaced, with shared props</h2>
          <p className="lead"><b>size</b>, <b>intent</b> and <b>appearance</b> set on the group reach every Button inside it; a Button's own prop wins.</p>
          <div className="sample-box">
            <ButtonGroup intent="neutral" appearance="ghost" aria-label="Dialog actions">
              <Button>Cancel</Button>
              <Button intent="accent" appearance="solid">Save</Button>
            </ButtonGroup>
            <ButtonGroup size="sm" intent="neutral" appearance="outline" aria-label="Edit">
              <Button prefix={<Plus />}>Add</Button>
              <Button>Duplicate</Button>
              <Button intent="danger">Delete</Button>
            </ButtonGroup>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <ul>
            <li><b>orientation</b><span className="prop-values">horizontal | vertical — default horizontal</span></li>
            <li><b>attached</b><span className="prop-values">boolean — one track with a raised thumb vs spaced buttons</span></li>
            <li><b>size</b> / <b>intent</b> / <b>appearance</b><span className="prop-values">as Button — passed to every child; the child's own prop wins. In an attached group, intent and appearance give way to the track treatment.</span></li>
            <li><b>aria-label</b><span className="prop-values">name the group, e.g. "Date range"</span></li>
          </ul>
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <div className="usage-grid">
            <div>
              <h3>Do</h3>
              <ul>
                <li>Use attached for switching between views of the same content.</li>
                <li>Keep exactly one segment pressed in a view switcher.</li>
                <li>Use spaced groups for a set of separate actions.</li>
              </ul>
            </div>
            <div>
              <h3>Don't</h3>
              <ul>
                <li>Put more than about five segments in one track.</li>
                <li>Mix text and icon-only segments in one track.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LINK ============ */}
      <section className="component-doc" id="link">
        <h1>Link</h1>
        <p className="dek">Inline and standalone navigation — a real &lt;a&gt;, so keyboard and screen reader behavior come free. Use Link to go somewhere; use Button (with <span className="prop-values">render</span> if it must be an anchor) to do something.</p>

        <div className="example-box">
          <p style={{ margin: 0 }}>Read our <Link href="#link">privacy policy</Link> before continuing.</p>
        </div>

        <div className="doc-section">
          <h2>Tone</h2>
          <p className="lead"><b>accent</b> for most links, <b>neutral</b> for quieter ones (it turns accent on hover), <b>inherit</b> to take the surrounding text color, e.g. inside an alert.</p>
          <div className="sample-box">
            <Link href="#link">Accent</Link>
            <Link href="#link" tone="neutral">Neutral</Link>
            <span style={{ color: "var(--color-text-danger)" }}>Payment failed. <Link href="#link" tone="inherit">Update card</Link></span>
          </div>
        </div>

        <div className="doc-section">
          <h2>Underline</h2>
          <p className="lead">Links in running text keep <b>always</b>, so they aren't told apart by color alone. <b>hover</b> and <b>none</b> are for standalone links such as navigation and footers. Hover thickens the underline instead of dimming the text.</p>
          <div className="sample-box">
            <Link href="#link" underline="always">Always</Link>
            <Link href="#link" underline="hover">Hover only</Link>
            <Link href="#link" underline="none">No underline</Link>
          </div>
        </div>

        <div className="doc-section">
          <h2>External</h2>
          <p className="lead">Opens in a new tab with <b>rel="noopener noreferrer"</b>, adds an arrow, and tells screen readers "opens in a new tab".</p>
          <div className="sample-box">
            <Link href="https://www.w3.org/WAI/standards-guidelines/wcag/" external>WCAG guidelines</Link>
            <Link href="https://github.com" external tone="neutral" underline="hover">GitHub</Link>
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">Defaults to <b>inherit</b>, matching the surrounding text. <b>sm</b> and <b>md</b> set the body-sm / body-md roles for standalone links.</p>
          <div className="sample-box">
            <Link href="#link" size="sm" underline="hover">Small link</Link>
            <Link href="#link" size="md" underline="hover">Medium link</Link>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <ul>
            <li><b>tone</b><span className="prop-values">accent | neutral | inherit — default accent</span></li>
            <li><b>underline</b><span className="prop-values">always | hover | none — default always</span></li>
            <li><b>external</b><span className="prop-values">boolean — new tab, safe rel, arrow icon, screen reader hint</span></li>
            <li><b>size</b><span className="prop-values">inherit | sm | md — default inherit</span></li>
            <li><b>…anchor attributes</b><span className="prop-values">href, target, rel and the rest are passed through; explicit target/rel win over external</span></li>
          </ul>
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <div className="usage-grid">
            <div>
              <h3>Do</h3>
              <ul>
                <li>Write link text that makes sense on its own ("Read the pricing guide").</li>
                <li>Keep the underline on links inside paragraphs.</li>
                <li>Mark links that leave the site with external.</li>
              </ul>
            </div>
            <div>
              <h3>Don't</h3>
              <ul>
                <li>Use "click here" or a bare URL as link text.</li>
                <li>Use a Link for an action that doesn't navigate — use Button.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* ============ CONTAINER ============ */}
      <section className="component-doc" id="container">
        <h1>Container</h1>
        <p className="dek">Centers content at a readable max width and adds the page gutter. Put one inside every Section; nest a smaller one for text that shouldn't run the full width.</p>

        <div className="example-box demo-frame">
          <Container size="sm" className="demo-outline">
            <Text variant="caption" tone="secondary">size="sm" · 640px + gutter</Text>
          </Container>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead"><b>sm</b> 640, <b>md</b> 768, <b>lg</b> 1024, <b>xl</b> 1280 (the default, <b>grid.container</b>) and <b>full</b> for no limit, shown here at half scale in a 1400px page (it scrolls sideways on a narrow screen). The width is the content width; the gutter sits outside it.</p>
          <div className="sample-box demo-frame demo-scroll">
            <div className="demo-zoom">
              {(["sm", "md", "lg", "xl", "full"] as const).map((size) => (
                <Container key={size} size={size} padded={false} className="demo-outline">
                  <Text variant="body-lg" tone="secondary">{`size="${size}"`}</Text>
                </Container>
              ))}
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Gutter</h2>
          <p className="lead"><b>padded</b> (on by default) adds <b>grid.margin</b> on both sides: 16px on a phone, growing to 64px on a wide screen. Turn it off when the parent already has padding.</p>
          <div className="sample-box stack demo-frame">
            <Container size="full" className="demo-outline"><Text variant="caption" tone="secondary">padded</Text></Container>
            <Container size="full" padded={false} className="demo-outline"><Text variant="caption" tone="secondary">padded={"{false}"}</Text></Container>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={containerProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use one Container per Section for the page width.", "Use sm or md for long-form reading."]}
            donts={["Nest padded Containers — the gutter doubles.", "Set max-width by hand on page content."]}
          />
        </div>
      </section>

      {/* ============ STACK ============ */}
      <section className="component-doc" id="stack">
        <h1>Stack</h1>
        <p className="dek">A row or column of children with one consistent gap. Replaces margins between siblings, so spacing lives in one place and always comes from the space scale.</p>

        <div className="example-box">
          <Stack gap="sm" align="center">
            <Heading level={3}>Ready to start?</Heading>
            <Text tone="secondary">Set up your workspace in a few minutes.</Text>
            <Stack direction="horizontal" gap="sm">
              <Button>Get started</Button>
              <Button intent="neutral" appearance="outline">Talk to sales</Button>
            </Stack>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Gap</h2>
          <p className="lead"><b>none</b> 0, <b>xs</b> 4, <b>sm</b> 8, <b>md</b> 16 (default), <b>lg</b> 24, <b>xl</b> 32px.</p>
          <div className="sample-box stack">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((gap) => (
              <Stack key={gap} direction="horizontal" align="center">
                <Text variant="code" tone="secondary" className="demo-label">{gap}</Text>
                <Stack direction="horizontal" gap={gap}>
                  <Cell>A</Cell><Cell>B</Cell><Cell>C</Cell>
                </Stack>
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Align and justify</h2>
          <p className="lead"><b>align</b> works across the stack (default <b>stretch</b>; use <b>baseline</b> to line up text of different sizes). <b>justify</b> works along it; <b>between</b> pushes the first and last child to the ends.</p>
          <div className="sample-box stack">
            <Stack direction="horizontal" justify="between" align="baseline">
              <Heading level={3} size="md">Invoices</Heading>
              <Link href="#stack" underline="hover" size="sm">View all</Link>
            </Stack>
            <Stack direction="horizontal" justify="end" gap="sm">
              <Button intent="neutral" appearance="ghost">Cancel</Button>
              <Button>Save</Button>
            </Stack>
          </div>
        </div>

        <div className="doc-section">
          <h2>Wrap</h2>
          <p className="lead">With <b>wrap</b>, a horizontal stack flows onto new lines instead of overflowing — for tags and button rows on small screens.</p>
          <div className="sample-box" style={{ display: "block", maxWidth: 320 }}>
            <Stack direction="horizontal" gap="xs" wrap>
              {["Design", "Tokens", "React", "Accessibility", "Theming", "Docs"].map((t) => <Cell key={t}>{t}</Cell>)}
            </Stack>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={stackProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Space siblings with Stack instead of margins.", "Nest stacks: a vertical page stack of horizontal rows."]}
            donts={["Add margins to children inside a Stack.", "Use Stack for a two-dimensional layout — use Grid."]}
          />
        </div>
      </section>

      {/* ============ GRID ============ */}
      <section className="component-doc" id="grid">
        <h1>Grid</h1>
        <p className="dek">Equal columns that collapse on small screens. Give it a column count per breakpoint, or a minimum item width and let it fit as many as it can.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Grid columns={{ base: 1, md: 3 }}>
            <Cell>One</Cell><Cell>Two</Cell><Cell>Three</Cell>
          </Grid>
        </div>

        <div className="doc-section">
          <h2>Responsive columns</h2>
          <p className="lead">An object switches at the <b>md</b> (768px) and <b>lg</b> (1024px) breakpoints; each step inherits the one below it. A plain number applies at every width. Resize the window to see this one go 1 → 2 → 4.</p>
          <div className="sample-box" style={{ display: "block" }}>
            <Grid columns={{ base: 1, md: 2, lg: 4 }} gap="sm">
              {["1", "2", "3", "4", "5", "6", "7", "8"].map((n) => <Cell key={n}>{n}</Cell>)}
            </Grid>
          </div>
        </div>

        <div className="doc-section">
          <h2>Auto-fit</h2>
          <p className="lead"><b>minItemWidth</b> makes as many columns as fit, each at least that wide — no breakpoints needed. A single item never overflows a narrower container.</p>
          <div className="sample-box" style={{ display: "block" }}>
            <Grid minItemWidth={180} gap="sm">
              {["Starter", "Team", "Business", "Enterprise"].map((n) => <Cell key={n}>{n}</Cell>)}
            </Grid>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={gridProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Start at one column and add columns at md and lg.", "Use minItemWidth for card grids of unknown length."]}
            donts={["Use a fixed column count above 2 without a responsive object — it stays that wide on phones.", "Use Grid for a single row of buttons — use Stack."]}
          />
        </div>
      </section>

      {/* ============ SECTION ============ */}
      <section className="component-doc" id="section">
        <h1>Section</h1>
        <p className="dek">A full-width page band with consistent vertical rhythm. The page is a stack of Sections, each holding a Container.</p>

        <div className="example-box demo-bands">
          <Section tone="accent" spacing="sm">
            <Container size="sm">
              <Stack gap="sm" align="center">
                <Text variant="overline" tone="accent">New</Text>
                <Heading level={2} size="xl">Datum 1.0 is here</Heading>
                <Button>Read the release notes</Button>
              </Stack>
            </Container>
          </Section>
        </div>

        <div className="doc-section">
          <h2>Tone</h2>
          <p className="lead"><b>default</b> is <b>bg.page</b>, <b>muted</b> is <b>bg.surface</b>, <b>accent</b> is <b>bg.accentSubtle</b>. Alternate default and muted to separate bands; keep accent for one band per page.</p>
          <div className="sample-box stack demo-bands">
            {(["default", "muted", "accent"] as const).map((tone) => (
              <Section key={tone} tone={tone} spacing="sm">
                <Container size="full">
                  <Stack gap="xs">
                    <Heading level={3} size="md">{`tone="${tone}"`}</Heading>
                    <Text tone="secondary">Text and controls are checked for contrast on every tone.</Text>
                  </Stack>
                </Container>
              </Section>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Spacing</h2>
          <p className="lead"><b>sm</b> 32, <b>md</b> 64 (default), <b>lg</b> 96px above and below. Use lg for the hero, md for most bands.</p>
          <div className="sample-box stack demo-bands">
            {(["sm", "md", "lg"] as const).map((spacing) => (
              <Section key={spacing} tone="muted" spacing={spacing} className="demo-rule">
                <Container size="full"><Text variant="code" tone="secondary">{`spacing="${spacing}"`}</Text></Container>
              </Section>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={sectionProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Give each Section a heading, or an aria-label, so it is a named region.", "Use as=\"header\" / \"footer\" for the page header and footer bands."]}
            donts={["Put content straight into a Section without a Container.", "Stack two accent bands."]}
          />
        </div>
      </section>

      {/* ============ HEADING ============ */}
      <section className="component-doc" id="heading">
        <h1>Heading</h1>
        <p className="dek">Titles in the display and heading type roles. <span className="prop-values">level</span> is the HTML tag, for the document outline; <span className="prop-values">size</span> is how it looks. Pick them separately.</p>

        <div className="example-box">
          <Stack gap="xs" align="center">
            <Heading level={1} size="display-md">Build faster</Heading>
            <Heading level={2} size="md" tone="secondary">A design system for the web</Heading>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">Three display sizes for hero statements (one per view) and four heading sizes for page, section, subsection and card titles. Barlow throughout.</p>
          <div className="sample-box stack">
            {headingSizes.map((size) => (
              <Stack key={size} direction="horizontal" gap="md" align="baseline">
                <Text variant="code" tone="secondary" className="demo-label">{size}</Text>
                <Heading level={3} size={size}>Pricing plans</Heading>
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Level and size</h2>
          <p className="lead">Without <b>size</b>, the level decides: 1 → xl, 2 → lg, 3 → md, 4–6 → sm. Override the size, not the level, when a heading needs to look bigger or smaller — the outline must not skip levels.</p>
          <div className="sample-box stack">
            <Heading level={1} size="display-sm">level 1, size display-sm</Heading>
            <Heading level={2} size="sm">level 2, size sm</Heading>
          </div>
        </div>

        <div className="doc-section">
          <h2>Tone</h2>
          <div className="sample-box">
            <Heading level={3} size="md">Primary</Heading>
            <Heading level={3} size="md" tone="secondary">Secondary</Heading>
            <Heading level={3} size="md" tone="accent">Accent</Heading>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={headingProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use one level 1 per page.", "Choose the level for the outline and the size for the look."]}
            donts={["Skip levels to get a smaller heading — change size.", "Use a display size more than once per view."]}
          />
        </div>
      </section>

      {/* ============ TEXT ============ */}
      <section className="component-doc" id="text">
        <h1>Text</h1>
        <p className="dek">Every non-heading text style, picked by purpose rather than size. Resets margins, so space it with Stack.</p>

        <div className="example-box">
          <Stack gap="xs">
            <Text variant="overline" tone="secondary">Monthly revenue</Text>
            <Text variant="numeric-lg">$48,210.00</Text>
            <Text variant="caption" tone="success">+12.4% from last month</Text>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Variants</h2>
          <p className="lead"><b>body</b> for interface text, <b>paragraph</b> for long-form reading (line height 1.7), <b>label</b>, <b>caption</b> and <b>overline</b> for UI text, <b>numeric</b> for figures (IBM Plex Mono, tabular so columns line up) and <b>code</b>.</p>
          <div className="sample-box stack">
            {textVariants.map(([variant, sample]) => (
              <Stack key={variant} direction="horizontal" gap="md" align="baseline">
                <Text variant="code" tone="secondary" className="demo-label">{variant}</Text>
                <Text variant={variant}>{sample}</Text>
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Tone</h2>
          <p className="lead">Two text colors, <b>primary</b> and <b>secondary</b>, plus accent and the state tones. All pass 4.5:1 on <b>bg.page</b> and <b>bg.surface</b> in every theme and mode. There is no third gray: for less important text, step down the variant (body-sm, caption, overline) instead. State tones say what happened; don't use them for decoration.</p>
          <div className="sample-box">
            {textTones.map((tone) => <Text key={tone} as="span" tone={tone}>{tone}</Text>)}
          </div>
        </div>

        <div className="doc-section">
          <h2>Weight</h2>
          <p className="lead">Each variant brings its own weight. Override with <b>regular</b>, <b>medium</b> or <b>semibold</b> only when needed, e.g. to emphasise a total.</p>
          <div className="sample-box">
            <Text as="span" weight="regular">Regular</Text>
            <Text as="span" weight="medium">Medium</Text>
            <Text as="span" weight="semibold">Semibold</Text>
          </div>
        </div>

        <div className="doc-section">
          <h2>Truncate</h2>
          <p className="lead"><b>true</b> cuts one line with an ellipsis; a number clamps to that many lines. Put the full text in a tooltip or detail view when it matters.</p>
          <div className="sample-box" style={{ display: "block", maxWidth: 320 }}>
            <Stack gap="sm">
            <Text truncate>Quarterly planning — design system rollout across marketing and product</Text>
            <Text truncate={2} tone="secondary">A description that runs on for a while, clamped to two lines so that cards in a grid stay the same height.</Text>
            </Stack>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={textProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Pick the variant by purpose: figures use numeric, reading uses paragraph.", "Use as=\"span\" inside other text, as=\"label\" with htmlFor for a form label."]}
            donts={["Pick a variant for its size — use the one that matches the job.", "Use tone alone to say something went wrong — say it in words too."]}
          />
        </div>
      </section>

      {/* ============ CARD ============ */}
      <section className="component-doc" id="card">
        <h1>Card</h1>
        <p className="dek">A container for one piece of grouped content: a plan, an article, a person. Compose it from four optional slots — <span className="prop-values">CardMedia</span>, <span className="prop-values">CardHeader</span>, <span className="prop-values">CardBody</span>, <span className="prop-values">CardFooter</span>.</p>

        <div className="example-box">
          <Card style={{ width: 300 }}>
            <CardMedia><div className="demo-media" /></CardMedia>
            <CardHeader>
              <Heading level={3} size="sm">Team plan</Heading>
              <Badge intent="accent">Popular</Badge>
            </CardHeader>
            <CardBody>
              <Text tone="secondary">Shared workspaces, roles and an audit log for up to 50 people.</Text>
            </CardBody>
            <CardFooter>
              <Button size="sm">Start trial</Button>
              <Button size="sm" intent="neutral" appearance="ghost">Compare</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="doc-section">
          <h2>Appearance</h2>
          <p className="lead"><b>elevated</b> lifts off the page with the surface shadow. <b>outline</b> is a border and no fill, for dense grids. <b>soft</b> is the surface fill alone, for cards on a busy page. All use <b>radius.card</b> (20px).</p>
          <div className="sample-box demo-on-page">
            {(["elevated", "outline", "soft"] as const).map((appearance) => (
              <Card key={appearance} appearance={appearance} style={{ width: 200 }}>
                <Heading level={3} size="sm">{appearance}</Heading>
                <Text variant="body-sm" tone="secondary">Card content</Text>
              </Card>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Padding</h2>
          <p className="lead"><b>sm</b> 16, <b>md</b> 24, <b>lg</b> 32px. Media in the first or last slot bleeds to the edges whatever the padding.</p>
          <div className="sample-box">
            {(["sm", "md", "lg"] as const).map((padding) => (
              <Card key={padding} appearance="outline" padding={padding}>
                <Text variant="code" tone="secondary">{padding}</Text>
              </Card>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Interactive</h2>
          <p className="lead">The whole card is one target: an <b>&lt;a&gt;</b> with <b>href</b>, a <b>&lt;button&gt;</b> without, or your router link via <b>render</b>. It lifts 2px and takes the raised shadow on hover, scales to 0.98 on press, and shows the focus ring from the keyboard. A clickable outline card uses <b>border.strong</b> so its edge reaches 3:1. Put no other controls inside.</p>
          <div className="sample-box demo-on-page">
            {(["elevated", "outline", "soft"] as const).map((appearance) => (
              <Card key={appearance} appearance={appearance} interactive href="#card" style={{ width: 200 }}>
                <Heading level={3} size="sm">Read the guide</Heading>
                <Text variant="body-sm" tone="secondary">{`${appearance}, links to #card`}</Text>
              </Card>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={cardProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Give each card a heading in CardHeader, at the right level for the page.", "Make the whole card interactive when it leads to one place."]}
            donts={["Nest cards inside cards.", "Put buttons or links inside an interactive card — use a static card with a footer instead."]}
          />
        </div>
      </section>

      {/* ============ BADGE ============ */}
      <section className="component-doc" id="badge">
        <h1>Badge</h1>
        <p className="dek">A short, non-interactive label for a status or a category. Same intent and appearance vocabulary as Button, always a pill.</p>

        <div className="example-box">
          <Badge intent="success" dot>Live</Badge>
          <Badge intent="warning">Beta</Badge>
          <Badge intent="accent" appearance="solid">New</Badge>
          <Badge appearance="outline">v2.4.0</Badge>
        </div>

        <div className="doc-section">
          <h2>Intent × appearance</h2>
          <p className="lead"><b>soft</b> is the default: a tint of the intent with its text color. <b>solid</b> is for the one badge that must stand out; neutral solid is ink. <b>outline</b> is the quietest. Every combination passes 4.5:1 in all four theme and mode combinations.</p>
          <div className="sample-box stack">
            {(["soft", "solid", "outline"] as const).map((appearance) => (
              <Stack key={appearance} direction="horizontal" gap="sm" align="center" wrap>
                <Text variant="code" tone="secondary" className="demo-label">{appearance}</Text>
                {badgeIntents.map((intent) => (
                  <Badge key={intent} intent={intent} appearance={appearance}>{intent}</Badge>
                ))}
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Size and dot</h2>
          <p className="lead"><b>md</b> is 24px tall, <b>sm</b> 20px. <b>dot</b> adds a leading dot in the text color; it is decorative, so the words still say the status.</p>
          <div className="sample-box">
            <Badge intent="success" dot>Operational</Badge>
            <Badge intent="danger" dot>Outage</Badge>
            <Badge intent="success" dot size="sm">Operational</Badge>
            <Badge intent="danger" dot size="sm">Outage</Badge>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={badgeProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Keep it to one or two words.", "Use the state intents for states and accent for brand highlights like \"New\"."]}
            donts={["Make a badge clickable — use a Button or a Link.", "Rely on color alone: \"Failed\" says what red means."]}
          />
        </div>
      </section>

      {/* ============ AVATAR ============ */}
      <section className="component-doc" id="avatar">
        <h1>Avatar</h1>
        <p className="dek">A person or an entity. Shows the image, falls back to initials from <span className="prop-values">name</span> when the image is missing or fails, then to an icon.</p>

        <div className="example-box">
          <Stack direction="horizontal" gap="md" align="center">
            <Avatar size="xl" name="Ada Lovelace" status="online" />
            <AvatarGroup max={3} aria-label="Project members">
              {people.map((name) => <Avatar key={name} name={name} />)}
            </AvatarGroup>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead"><b>xs</b> 24, <b>sm</b> 32, <b>md</b> 40, <b>lg</b> 48, <b>xl</b> 64px. The initials step up a type role with each size.</p>
          <div className="sample-box">
            {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => <Avatar key={size} size={size} name="Grace Hopper" />)}
          </div>
        </div>

        <div className="doc-section">
          <h2>Shape and fallback</h2>
          <p className="lead"><b>circle</b> for people, <b>square</b> (<b>radius.subtle</b>) for teams, companies and projects. Initials use the accent tint; with no name the avatar shows an icon and is hidden from screen readers.</p>
          <div className="sample-box">
            <Avatar size="lg" name="Ada Lovelace" />
            <Avatar size="lg" shape="square" name="Datum" />
            <Avatar size="lg" name="Broken image" src="/missing.jpg" />
            <Avatar size="lg" />
          </div>
        </div>

        <div className="doc-section">
          <h2>Status</h2>
          <p className="lead">A presence dot, ringed in the page color. The status is added to the accessible name, e.g. "Ada Lovelace, busy".</p>
          <div className="sample-box">
            {(["online", "away", "busy", "offline"] as const).map((status) => (
              <Stack key={status} gap="xs" align="center">
                <Avatar size="lg" name="Ada Lovelace" status={status} />
                <Text variant="caption" tone="secondary">{status}</Text>
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>AvatarGroup</h2>
          <p className="lead">An overlapping stack. <b>max</b> collapses the rest into a neutral "+N" (read as "N more"); <b>size</b> and <b>shape</b> pass down to every avatar. Give the group an <b>aria-label</b>.</p>
          <div className="sample-box stack">
            {(["sm", "md", "lg"] as const).map((size) => (
              <AvatarGroup key={size} size={size} max={4} aria-label="Reviewers">
                {people.map((name) => <Avatar key={name} name={name} />)}
              </AvatarGroup>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={avatarProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Always pass the real name, even with an image — it is the accessible name and the fallback.", "Use square for anything that isn't a person."]}
            donts={["Use a generic name like \"avatar\" or \"user\".", "Show status without a way to read it elsewhere when it matters."]}
          />
        </div>
      </section>

      {/* ============ SEPARATOR ============ */}
      <section className="component-doc" id="separator">
        <h1>Separator</h1>
        <p className="dek">A thin line between groups of content. Decorative weight: prefer space, and reach for a line only when space alone doesn't separate.</p>

        <div className="example-box">
          <Stack gap="md" style={{ width: 320 }}>
            <Button intent="neutral" appearance="outline" fullWidth>Continue with Google</Button>
            <Separator label="or" />
            <Button fullWidth>Continue with email</Button>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Tone</h2>
          <p className="lead"><b>subtle</b> (<b>border.subtle</b>) is the default; <b>default</b> (<b>border.default</b>) is for lines that must hold up on a surface. Neither is a control boundary, so neither has a contrast minimum.</p>
          <div className="sample-box stack">
            <Separator />
            <Separator tone="default" />
          </div>
        </div>

        <div className="doc-section">
          <h2>Orientation and label</h2>
          <p className="lead"><b>vertical</b> stretches to the height of its row. A <b>label</b> sits in the middle in <b>body-sm</b>, secondary, and becomes the separator's accessible name.</p>
          <div className="sample-box">
            <Stack direction="horizontal" gap="md" align="center" style={{ height: 32 }}>
              <Text as="span">Docs</Text>
              <Separator orientation="vertical" />
              <Text as="span">Pricing</Text>
              <Separator orientation="vertical" />
              <Text as="span">Blog</Text>
            </Stack>
            <Separator label="Continue with" style={{ flex: 1 }} />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={separatorProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use it between groups, not between every item.", "Keep labels to a word or two."]}
            donts={["Use it as a page-section border — use Section tones.", "Stack a separator against a card or box edge."]}
          />
        </div>
      </section>

      {/* ============ ACCORDION ============ */}
      <section className="component-doc" id="accordion">
        <h1>Accordion</h1>
        <p className="dek">Collapsible sections for FAQs and details. Behaviour comes from React Aria: each trigger is a button inside a heading, linked to its panel, and closed panels are still found by the browser's find-in-page.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Accordion defaultValue="refund" style={{ maxWidth: 560, margin: "0 auto" }}>
            {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
          </Accordion>
        </div>

        <div className="doc-section">
          <h2>Appearance</h2>
          <p className="lead"><b>plain</b> is rows with no lines — only the rounded hover fill. <b>bordered</b> is one box with <b>radius.card</b>, only its outer corners rounded. <b>separated</b> is a surface card per item. Hover tints the trigger toward the text color; the chevron turns in <b>motion.normal</b>. The panel height is not animated, so the page below never slides.</p>
          <div className="sample-box demo-on-page stack">
            {(["plain", "bordered", "separated"] as const).map((appearance) => (
              <Stack key={appearance} gap="xs" style={{ width: "100%", maxWidth: 560 }}>
                <Text variant="code" tone="secondary">{appearance}</Text>
                <Accordion appearance={appearance}>
                  {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
                </Accordion>
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Type and collapsible</h2>
          <p className="lead"><b>single</b> keeps one item open. With <b>collapsible</b> false the open item can't be closed, only replaced — its trigger stays focusable and is marked <b>aria-disabled</b>. <b>multiple</b> lets any number stay open.</p>
          <div className="sample-box demo-on-page stack">
            <Stack gap="xs" style={{ width: "100%", maxWidth: 560 }}>
              <Text variant="code" tone="secondary">single, collapsible=false</Text>
              <Accordion collapsible={false} defaultValue="refund">
                {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
              </Accordion>
            </Stack>
            <Stack gap="xs" style={{ width: "100%", maxWidth: 560 }}>
              <Text variant="code" tone="secondary">multiple</Text>
              <Accordion type="multiple" appearance="separated" defaultValue={["refund", "seats"]}>
                {faq.map(([value, q, a]) => <AccordionItem key={value} value={value} title={q}>{a}</AccordionItem>)}
                <AccordionItem value="sso" title="Is SSO available? (disabled)" disabled>On the Enterprise plan.</AccordionItem>
              </Accordion>
            </Stack>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={accordionProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Set headingLevel so triggers fit the page outline.", "Write titles as the question or topic, so they scan."]}
            donts={["Hide content everyone needs — critical information belongs on the page.", "Nest accordions."]}
          />
        </div>
      </section>

      {/* ============ ALERT ============ */}
      <section className="component-doc" id="alert">
        <h1>Alert</h1>
        <p className="dek">An inline message that stays on the page until the problem is solved or someone dismisses it. The icon follows <span className="prop-values">intent</span>; <span className="prop-values">appearance</span> decides how loud it is.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Alert
            intent="warning"
            title="Your trial ends in 3 days"
            description="Add a payment method to keep your projects and history."
            action={<Button size="sm" intent="neutral" appearance="outline">Add payment method</Button>}
            dismissible
            style={{ maxWidth: 560, margin: "0 auto" }}
          />
        </div>

        <div className="doc-section">
          <h2>Intent × appearance</h2>
          <p className="lead"><b>soft</b> is the default: a tint of the intent, the icon in its text color, the words in <b>text.primary</b>. <b>outline</b> keeps whatever is behind it and draws the intent's border. Hierarchy comes from the type role, not a lighter gray: the title uses the label weight, the description steps down to <b>body-sm</b>.</p>
          <div className="sample-box demo-on-page stack">
            {(["soft", "outline"] as const).map((appearance) => (
              <Stack key={appearance} gap="sm" style={{ width: "100%" }}>
                <Text variant="code" tone="secondary">{appearance}</Text>
                {alertIntents.map((intent) => (
                  <Alert key={intent} intent={intent} appearance={appearance} title={`${intent[0].toUpperCase()}${intent.slice(1)} message`} description="A sentence of detail under the title." />
                ))}
              </Stack>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Solid banner</h2>
          <p className="lead"><b>solid</b> is the intent's fill with its <b>text.on*</b> color, in one row. Neutral solid is ink. Across the top of a page it is a banner: <b>fullBleed</b> squares its ends, because it touches both edges of the viewport and its corners are the viewport's. Inside it, every focus ring uses the fill's on-color instead of <b>border.focus</b>; use <b>Link tone="inherit"</b> for the action.</p>
          <div className="sample-box stack">
            {alertIntents.map((intent) => (
              <div key={intent} style={{ borderRadius: "var(--radius-card)", overflow: "hidden", border: "1px solid var(--color-border-subtle)" }}>
                <Alert intent={intent} appearance="solid" fullBleed title={`Scheduled maintenance on Sunday, 02:00–04:00 UTC (${intent})`} action={<Link href="#alert" tone="inherit">Details</Link>} dismissible />
                <div style={{ height: 48, background: "var(--color-bg-page)" }} />
              </div>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Solid, not full bleed</h2>
          <p className="lead">Anywhere that isn't edge to edge — in a card, a column, a dialog — a solid alert keeps <b>radius.card</b>, like everything else in Datum. Only <b>fullBleed</b> takes the corners off.</p>
          <div className="sample-box demo-on-page">
            <Card style={{ width: "100%", maxWidth: 480 }}>
              <CardHeader><Heading level={3} size="sm">Billing</Heading></CardHeader>
              <CardBody>
                <Stack gap="md">
                  <Alert intent="danger" appearance="solid" title="Your last payment failed" action={<Link href="#alert" tone="inherit">Update card</Link>} />
                  <Text variant="body-sm" tone="secondary">Pro plan · renews on 1 October</Text>
                </Stack>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="doc-section">
          <h2>Dismissing</h2>
          <p className="lead"><b>dismissible</b> adds a Dismiss button. Uncontrolled, the alert hides itself; controlled with <b>open</b>, it calls <b>onOpenChange(false)</b> and waits for you.</p>
          <div className="sample-box demo-on-page stack">
            {bannerOpen ? (
              <Alert intent="success" title="Profile updated" description="Changes are visible to your team." dismissible open={bannerOpen} onOpenChange={setBannerOpen} />
            ) : (
              <div><Button size="sm" intent="neutral" appearance="outline" onClick={() => setBannerOpen(true)}>Show the alert again</Button></div>
            )}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={alertProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Say what happened and what to do next.", "Keep danger for problems that block the task — it interrupts screen readers.", "Use one solid banner per page, at the top."]}
            donts={["Use an alert for confirmation of an action the person just took — that's a Toast.", "Stack several alerts; merge them into one."]}
          />
        </div>
      </section>

      {/* ============ TOAST ============ */}
      <section className="component-doc" id="toast">
        <h1>Toast</h1>
        <p className="dek">A brief, non-blocking notification about something that just happened. Call <span className="prop-values">toast()</span> from anywhere; one <span className="prop-values">&lt;Toaster /&gt;</span> near the app root shows the stack. Behaviour comes from React Aria: the stack is a landmark (reachable with F6), each toast is announced, and timers pause while the pointer or keyboard focus is on any toast.</p>

        <div className="example-box">
          <Button onClick={() => toast({ intent: "success", title: "Invoice sent", description: "Ada will get it in a minute." })}>Send invoice</Button>
          <Button intent="neutral" appearance="outline" onClick={() => toast({ title: "Message archived", action: { label: "Undo", onAction: () => toast({ title: "Message restored" }) } })}>Archive with undo</Button>
        </div>

        <div className="doc-section">
          <h2>Intent</h2>
          <p className="lead">Every toast is the same raised surface (<b>bg.surfaceRaised</b>, <b>elevation.overlay</b>, <b>radius.card</b>) with <b>text.primary</b>; the intent shows as the icon in its text color. <b>neutral</b> has no icon. Each closes after 5 seconds unless <b>duration</b> says otherwise.</p>
          <div className="sample-box">
            {toastExamples.map(([intent, title, description]) => (
              <Button key={intent} size="sm" intent="neutral" appearance="outline" onClick={() => toast({ intent, title, description })}>{intent}</Button>
            ))}
            <Button size="sm" intent="neutral" appearance="outline" onClick={() => toast({ intent: "danger", title: "Sync paused", description: "Stays until you close it.", duration: null })}>duration: null</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Position</h2>
          <p className="lead">Set on the Toaster. The newest toast sits nearest the edge and slides in from it (<b>motion.normal</b>; no movement under reduced motion). Up to five are visible; the rest wait their turn.</p>
          <div className="sample-box">
            <ButtonGroup attached size="sm" intent="neutral">
              {(["top-center", "top-end", "bottom-center", "bottom-end"] as const).map((p) => (
                <Button key={p} pressed={toastPosition === p} onPressedChange={() => setToastPosition(p)}>{p}</Button>
              ))}
            </ButtonGroup>
            <Button size="sm" onClick={() => toast({ title: `Now at ${toastPosition}` })}>Show a toast</Button>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={toastProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Confirm what just happened in a few words.", "Offer Undo for destructive actions instead of a confirmation dialog.", "Use duration: null when the toast carries something the person must act on."]}
            donts={["Put the only copy of important information in a toast — it goes away.", "Fire several at once for one action."]}
          />
        </div>
      </section>

      {/* ============ SPINNER ============ */}
      <section className="component-doc" id="spinner">
        <h1>Spinner</h1>
        <p className="dek">Indeterminate loading, on its own. The same ring as a loading Button: drawn in the text color, so it reaches 3:1 wherever that text reaches 4.5:1. It is a <span className="prop-values">role=status</span> with a visually hidden label.</p>

        <div className="example-box">
          <Spinner size="lg" tone="accent" />
        </div>

        <div className="doc-section">
          <h2>Size and tone</h2>
          <p className="lead"><b>sm</b>, <b>md</b>, <b>lg</b> are 16, 20 and 24px. <b>current</b> inherits the color around it; <b>accent</b> uses <b>text.accent</b>. One turn every <b>motion.slow</b>; four times slower under reduced motion, since it is the only sign that something is happening.</p>
          <div className="sample-box">
            {(["sm", "md", "lg"] as const).map((size) => <Spinner key={size} size={size} />)}
            {(["sm", "md", "lg"] as const).map((size) => <Spinner key={size} size={size} tone="accent" />)}
            <Text as="span" variant="body-sm" tone="secondary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Spinner size="sm" label="Saving" /> Saving…
            </Text>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={spinnerProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Give a specific label: \"Loading invoices\" beats \"Loading\".", "Use Button's loading prop for a button, not a Spinner inside it."]}
            donts={["Use a spinner when you know how far along it is — that's a ProgressBar.", "Show several spinners for one wait; use Skeletons for the layout instead."]}
          />
        </div>
      </section>

      {/* ============ PROGRESS BAR ============ */}
      <section className="component-doc" id="progress-bar">
        <h1>Progress Bar</h1>
        <p className="dek">How far along a task is. Give it a <span className="prop-values">value</span> for determinate progress, or leave it out while the total is unknown.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Stack gap="md" style={{ maxWidth: 420, margin: "0 auto" }}>
            <ProgressBar value={progress} label="Uploading report.pdf" showValue />
            <Stack direction="horizontal" gap="sm">
              <Button size="sm" intent="neutral" appearance="outline" onClick={() => setProgress((p) => Math.max(0, p - 20))}>−20</Button>
              <Button size="sm" intent="neutral" appearance="outline" onClick={() => setProgress((p) => Math.min(100, p + 20))}>+20</Button>
            </Stack>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Intent and size</h2>
          <p className="lead">The fill uses the intent's <b>text</b> color rather than its fill color, so even warning reaches 3:1 against the <b>bg.tertiary</b> track in every mode. <b>md</b> is an 8px track, <b>sm</b> 4px. The fill slides with <b>transform</b> (<b>motion.normal</b>), never width.</p>
          <div className="sample-box stack">
            {(["accent", "success", "warning", "danger"] as const).map((intent, i) => (
              <ProgressBar key={intent} intent={intent} value={25 + i * 20} label={intent} showValue size={i % 2 ? "sm" : "md"} />
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Indeterminate</h2>
          <p className="lead">Without <b>value</b>, a segment slides across and no value is announced. Under reduced motion it keeps sliding, much slower — like the spinner, it is the only sign of progress.</p>
          <div className="sample-box stack">
            <ProgressBar label="Preparing your export" />
            <ProgressBar size="sm" aria-label="Loading" />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={progressProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Label what is progressing.", "Switch from indeterminate to a value as soon as you know the total."]}
            donts={["Use it for a score or a quota — it's for progress over time.", "Let the value move backwards."]}
          />
        </div>
      </section>

      {/* ============ SKELETON ============ */}
      <section className="component-doc" id="skeleton">
        <h1>Skeleton</h1>
        <p className="dek">A placeholder in the shape of the content that is on its way, so the layout doesn't jump when it arrives. Skeletons are hidden from assistive tech; mark the loading region with <span className="prop-values">aria-busy</span>.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Stack direction="horizontal" gap="md" align="start" style={{ maxWidth: 420, margin: "0 auto" }} aria-busy="true">
            <Skeleton shape="circle" />
            <Stack gap="sm" style={{ flex: 1 }}>
              <Skeleton width="40%" />
              <Skeleton lines={3} />
            </Stack>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>Shape</h2>
          <p className="lead"><b>text</b> draws one bar per line, spaced like body text, with a shorter last line. <b>rect</b> is a block with <b>radius.card</b>, for images and media. <b>circle</b> is an avatar. The fill is <b>bg.tertiary</b>, so it shows on the page and on surfaces. It pulses by fading the fill toward the text color; <b>animated</b> turns that off, and reduced motion always does.</p>
          <div className="sample-box demo-on-page">
            <Card style={{ width: 280 }}>
              <CardBody>
                <Stack gap="md">
                  <Skeleton shape="rect" height={140} />
                  <Stack direction="horizontal" gap="sm" align="center">
                    <Skeleton shape="circle" width={32} />
                    <Skeleton width="50%" />
                  </Stack>
                  <Skeleton lines={2} animated={false} />
                </Stack>
              </CardBody>
            </Card>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={skeletonProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Match the real layout closely, so nothing moves when content arrives.", "Set aria-busy on the region that is loading."]}
            donts={["Use a skeleton for a wait under a few hundred milliseconds.", "Mix skeletons and spinners for the same content."]}
          />
        </div>
      </section>
      {/* ============ FIELD + LABEL ============ */}
      <section className="component-doc" id="field">
        <h1>Field + Label</h1>
        <p className="dek">One wrapper that wires a <span className="prop-values">label</span>, help text and error text to any control, so every form field reads and behaves the same. TextField, Textarea and Select are built on it and take the same props; wrap your own control in <span className="prop-values">Field</span> to get them too.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Field label="Billing period" helpText="You can change it at any time." required style={{ maxWidth: 360, margin: "0 auto" }}>
            {(control) => (
              <ButtonGroup attached aria-labelledby={control["aria-labelledby"]} aria-describedby={control["aria-describedby"]} style={{ alignSelf: "flex-start" }}>
                {["Monthly", "Yearly"].map((p) => (
                  <Button key={p} pressed={period === p} onPressedChange={() => setPeriod(p)}>{p}</Button>
                ))}
              </ButtonGroup>
            )}
          </Field>
        </div>

        <div className="doc-section">
          <h2>Anatomy</h2>
          <p className="lead">The label is <b>ui.label</b> in <b>text.primary</b>, 8px above the control. Help text steps down to <b>ui.caption</b> in <b>text.secondary</b> — hierarchy from the type role, not a third gray. <b>errorText</b> takes the help text's place in <b>text.danger</b> with an icon, so the state never rests on color alone, and the control is marked <b>aria-invalid</b> and described by it. The * of <b>required</b> is hidden from screen readers; the control's own <b>required</b> is what they announce.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              <TextField label="Help text" helpText="Shown under the control." />
              <TextField label="Error text" helpText="Replaced by the error." errorText="Enter a valid email." defaultValue="ada@" />
              <TextField label="Required" required helpText="The * is not read aloud." />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Disabled and read-only</h2>
          <p className="lead"><b>disabled</b> dims the whole field and takes the control out of the tab order. <b>readOnly</b> is for values people need to read or copy but not change: it stays at full contrast and focusable, and swaps the fill and lift for a dashed edge so it never looks disabled.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              <TextField label="Editable" defaultValue="acct_4417" />
              <TextField label="Read-only" readOnly defaultValue="acct_4417" helpText="Select and copy it." />
              <TextField label="Disabled" disabled defaultValue="acct_4417" />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Label on its own</h2>
          <p className="lead">When you lay a form out yourself, <b>Label</b> is the same label: <b>required</b> adds the marker, <b>as="span"</b> names a group through <b>aria-labelledby</b>.</p>
          <div className="sample-box demo-on-page">
            <Label>Plain label</Label>
            <Label required>Required label</Label>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={fieldProps} />
          <h3>Label</h3>
          <PropsTable rows={labelProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Keep every label visible and short — a noun, not a sentence.", "Say how to fix an error, not just that something is wrong.", "Use readOnly for values people may copy; disabled for ones that don't apply right now."]}
            donts={["Use a placeholder as the label — it disappears as soon as someone types.", "Show help and error text at the same time; the error replaces the help."]}
          />
        </div>
      </section>

      {/* ============ TEXT FIELD ============ */}
      <section className="component-doc" id="text-field">
        <h1>Text Field</h1>
        <p className="dek">A single-line input. A pill like every other single-line control, on <span className="prop-values">bg.surfaceRaised</span> with a <span className="prop-values">border.strong</span> edge that reaches 3:1 on the page and on surfaces.</p>

        <div className="example-box" style={{ display: "block" }}>
          <TextField label="Work email" type="email" prefix={<Mail />} placeholder="you@company.com" helpText="We'll send the invite here." className="demo-center" />
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">32, 40 and 48px, like Button, so a field and its submit button line up. Each grows by 4px on touch screens, and sm keeps a 44px hit area.</p>
          <div className="sample-box demo-on-page" style={{ alignItems: "flex-end" }}>
            {(["sm", "md", "lg"] as const).map((size) => (
              <div key={size} style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <TextField size={size} label={`Size ${size}`} placeholder="Email address" className="demo-w200" />
                <Button size={size}>Join</Button>
              </div>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Prefix, suffix, clear and reveal</h2>
          <p className="lead"><b>prefix</b> and <b>suffix</b> hold an icon or text inside the box; pressing them puts the caret in the input. <b>clearable</b> shows a Clear button once there is a value. <b>revealable</b> adds Show password (a toggle, <b>aria-pressed</b>). Both are real buttons in the tab order, with a 44px hit area on touch.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              <TextField label="Search" type="search" prefix={<Search />} placeholder="Search products" clearable defaultValue="Wool hats" />
              <TextField label="Price" type="number" prefix="$" suffix="USD" defaultValue="49" />
              <TextField label="Password" type="password" revealable defaultValue="correct horse" />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>States</h2>
          <p className="lead">Hover steps the edge 40% toward the text color. Keyboard focus puts the 2px <b>border.focus</b> ring round the whole box, prefix and all. Invalid uses <b>border.danger</b>.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              <TextField label="Default" placeholder="Placeholder" />
              <TextField label="Filled" defaultValue="Ada Lovelace" />
              <TextField label="Invalid" defaultValue="ada@" errorText="Enter a valid email." />
              <TextField label="Read-only" readOnly defaultValue="Ada Lovelace" />
              <TextField label="Disabled" disabled defaultValue="Ada Lovelace" />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={textFieldProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Pick the type that matches the data, so phones show the right keyboard.", "Size the field to the length of the answer you expect.", "Make search fields clearable."]}
            donts={["Put the label inside as a prefix.", "Use a TextField for more than one line — that's a Textarea."]}
          />
        </div>
      </section>

      {/* ============ TEXTAREA ============ */}
      <section className="component-doc" id="textarea">
        <h1>Textarea</h1>
        <p className="dek">Multi-line input. The same box as TextField, but with <span className="prop-values">radius.card</span> — a tall box is never a pill.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Textarea label="Message" placeholder="How can we help?" helpText="Plain text; links are fine." maxLength={280} className="demo-center" />
        </div>

        <div className="doc-section">
          <h2>Length and growth</h2>
          <p className="lead"><b>maxLength</b> caps the input and shows a count under the field, in tabular figures so it doesn't jitter; the count is part of the description. <b>autoResize</b> grows the box with its content instead of scrolling — its height isn't animated, so the page below doesn't slide.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              <Textarea label="Bio" maxLength={160} defaultValue="Designer and occasional typesetter." helpText="Shown on your profile." />
              <Textarea label="Notes" autoResize rows={2} placeholder="Keep typing — I grow." />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes and states</h2>
          <p className="lead">sm, md and lg match TextField's type size and padding. Invalid, read-only and disabled look the same as every other field.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              {(["sm", "md", "lg"] as const).map((size) => <Textarea key={size} size={size} label={`Size ${size}`} rows={2} placeholder="Placeholder" />)}
              <Textarea label="Invalid" rows={2} errorText="Tell us a little more." />
              <Textarea label="Read-only" rows={2} readOnly defaultValue="Signed off by legal." />
              <Textarea label="Disabled" rows={2} disabled defaultValue="Locked" />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={textareaProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Set rows to the length of answer you expect.", "Show the count when there's a hard limit."]}
            donts={["Use autoResize in a layout with a fixed height.", "Cut text off silently — use maxLength so the limit is visible."]}
          />
        </div>
      </section>

      {/* ============ CHECKBOX ============ */}
      <section className="component-doc" id="checkbox">
        <h1>Checkbox</h1>
        <p className="dek">A binary choice, or a mixed one for a parent of partly checked children. A native checkbox under a drawn box with <span className="prop-values">radius.subtle</span> — never round, so it never reads as a radio.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Stack gap="xs" style={{ maxWidth: 320, margin: "0 auto" }}>
            <Checkbox label="All toppings" checked={allToppings} onCheckedChange={(on) => setToppings(on ? toppingOptions.map(([v]) => v) : [])} />
            <CheckboxGroup label="Toppings" value={toppings} onValueChange={setToppings} style={{ paddingInlineStart: 28 }}>
              {toppingOptions.map(([value, label]) => <Checkbox key={value} value={value} label={label} />)}
            </CheckboxGroup>
          </Stack>
        </div>

        <div className="doc-section">
          <h2>States</h2>
          <p className="lead">On is the <b>bg.accent</b> fill with a <b>text.onAccent</b> mark and a <b>border.accent</b> edge — the fill alone falls under 3:1 on a surface in orange dark, the edge doesn't. Hover adds a soft halo in the text color; keyboard focus rings the box. <b>"indeterminate"</b> shows a dash and is announced as mixed; pressing it checks it.</p>
          <div className="sample-box demo-on-page column">
            {(["md", "sm"] as const).map((size) => (
              <div key={size} style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                <Checkbox size={size} label={`Unchecked (${size})`} />
                <Checkbox size={size} label="Checked" defaultChecked />
                <Checkbox size={size} label="Indeterminate" defaultChecked="indeterminate" />
                <Checkbox size={size} label="Invalid" invalid />
                <Checkbox size={size} label="Disabled" disabled defaultChecked />
              </div>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Description and groups</h2>
          <p className="lead"><b>description</b> is a second line, one type step down in <b>text.secondary</b>; it describes the checkbox without becoming part of its name. <b>CheckboxGroup</b> takes the Field props and an array value; <b>errorText</b> marks every box in it.</p>
          <div className="sample-box demo-on-page" style={{ alignItems: "flex-start", gap: 48 }}>
            <CheckboxGroup label="Email me about" helpText="You can unsubscribe from any email." defaultValue={["mentions"]}>
              <Checkbox value="mentions" label="Mentions" description="When someone @mentions you" />
              <Checkbox value="replies" label="Replies" description="On threads you started" />
              <Checkbox value="digest" label="Weekly digest" />
            </CheckboxGroup>
            <CheckboxGroup label="Agreements" required errorText="Accept the terms to continue." orientation="horizontal">
              <Checkbox value="terms" label="Terms" />
              <Checkbox value="privacy" label="Privacy policy" />
            </CheckboxGroup>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={checkboxProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use for choices that are applied later, with a Save or Submit.", "Write labels as the positive statement: “Email me”, not “Don't email me”."]}
            donts={["Use a checkbox for a setting that applies at once — that's a Switch.", "Use checkboxes for one choice out of several — that's a RadioGroup."]}
          />
        </div>
      </section>

      {/* ============ RADIO ============ */}
      <section className="component-doc" id="radio">
        <h1>Radio</h1>
        <p className="dek">One choice from a small set. <span className="prop-values">RadioGroup</span> holds the value and the Field props; each <span className="prop-values">Radio</span> is a native radio, so Tab enters and leaves the group and the arrow keys move the selection.</p>

        <div className="example-box" style={{ display: "block" }}>
          <RadioGroup label="Delivery" defaultValue="standard" style={{ maxWidth: 320, margin: "0 auto" }}>
            <Radio value="standard" label="Standard" description="3–5 working days · Free" />
            <Radio value="express" label="Express" description="Next working day · $9" />
            <Radio value="pickup" label="Pick up in store" disabled />
          </RadioGroup>
        </div>

        <div className="doc-section">
          <h2>Card</h2>
          <p className="lead"><b>appearance="card"</b> turns each option into a tile for choices that need room, like pricing plans. The tile's edge is <b>border.strong</b> (it's a control, so it reaches 3:1); selected takes the <b>border.accent</b> edge on the <b>bg.accentSubtle</b> tint, and the focus ring goes round the whole tile. Children add content under the description.</p>
          <div className="sample-box demo-on-page">
            <RadioGroup label="Plan" appearance="card" orientation="horizontal" defaultValue="pro" style={{ width: "100%" }}>
              <Radio value="free" label="Free" description="For personal projects"><Text variant="numeric-md" style={{ marginTop: 8 }}>$0</Text></Radio>
              <Radio value="pro" label="Pro" description="For growing teams"><Text variant="numeric-md" style={{ marginTop: 8 }}>$12</Text></Radio>
              <Radio value="enterprise" label="Enterprise" description="SSO and audit logs"><Text variant="numeric-md" style={{ marginTop: 8 }}>Custom</Text></Radio>
            </RadioGroup>
          </div>
        </div>

        <div className="doc-section">
          <h2>Orientation, size and states</h2>
          <p className="lead">Horizontal groups wrap. sm steps the circle to 16px and the label to <b>body-sm</b>. <b>errorText</b> marks every circle with <b>border.danger</b>.</p>
          <div className="sample-box demo-on-page column">
            <RadioGroup label="Size" orientation="horizontal" size="sm" defaultValue="m">
              {["XS", "S", "M", "L", "XL"].map((s) => <Radio key={s} value={s.toLowerCase()} label={s} />)}
            </RadioGroup>
            <RadioGroup label="Contact method" orientation="horizontal" required errorText="Choose how we should reach you.">
              <Radio value="email" label="Email" />
              <Radio value="phone" label="Phone" />
            </RadioGroup>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={radioProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use for 2–6 options that people should see side by side.", "Preselect the safest or most common option when there is one."]}
            donts={["Use a radio group for more than about six options — use a Select.", "Use a single radio on its own; it can't be unchecked."]}
          />
        </div>
      </section>

      {/* ============ SWITCH ============ */}
      <section className="component-doc" id="switch">
        <h1>Switch</h1>
        <p className="dek">An on/off setting that applies at once. A native checkbox with <span className="prop-values">role="switch"</span>; the thumb slides in <span className="prop-values">motion.normal</span> and simply jumps under reduced motion.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Card style={{ maxWidth: 420, margin: "0 auto" }}>
            <CardBody>
              <Stack gap="sm">
                <Switch label="Email notifications" description="A summary of activity each morning." labelPosition="start" defaultChecked style={{ display: "flex" }} />
                <Separator />
                <Switch label="Show my status" labelPosition="start" style={{ display: "flex" }} />
              </Stack>
            </CardBody>
          </Card>
        </div>

        <div className="doc-section">
          <h2>States and sizes</h2>
          <p className="lead">A filled track with a white thumb that slides across: ink (<b>bg.inverse</b>) when off, the accent fill when on. Hover steps each to its own hover token. sm is a 32 × 20 track.</p>
          <div className="sample-box demo-on-page column">
            {(["md", "sm"] as const).map((size) => (
              <div key={size} style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                <Switch size={size} label={`Off (${size})`} />
                <Switch size={size} label="On" defaultChecked />
                <Switch size={size} label="Disabled" disabled />
                <Switch size={size} label="Disabled on" disabled defaultChecked />
              </div>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Label position</h2>
          <p className="lead"><b>end</b> (the default) reads like a checkbox. <b>start</b> puts the label first and pushes the switch to the end of the row — the settings-list layout.</p>
          <div className="sample-box demo-on-page column">
            <Switch label="Label at the end" defaultChecked />
            <Switch label="Label at the start" labelPosition="start" defaultChecked style={{ display: "flex", width: 320 }} />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={switchProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use for settings that take effect immediately.", "Label the setting, not the state: “Notifications”, not “On”."]}
            donts={["Put a switch in a form that needs a Submit — use a Checkbox.", "Change other parts of the form when it flips, without saying so."]}
          />
        </div>
      </section>

      {/* ============ SELECT ============ */}
      <section className="component-doc" id="select">
        <h1>Select</h1>
        <p className="dek">Choose one option from a list. The trigger is the field box as a button; the list is a React Aria listbox on an overlay surface, with arrow keys, Home/End, type-ahead and Escape. A hidden native select submits the value with a form.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Select label="Country" options={countries} helpText="Where your business is registered." style={{ maxWidth: 320, margin: "0 auto" }} />
        </div>

        <div className="doc-section">
          <h2>Groups and descriptions</h2>
          <p className="lead">Options that share a <b>group</b> are listed under its heading (<b>ui.overline</b>), with a divider between groups. A <b>description</b> is a second line in <b>text.secondary</b>; two-line options take the card radius instead of a pill. The selected option has an accent check; keyboard focus adds an inset ring.</p>
          <div className="sample-box demo-on-page" style={{ alignItems: "flex-start" }}>
            <Select label="Country" options={countries} defaultValue="fr" style={{ width: 260 }} />
            <Select label="Role" options={roles} defaultValue="editor" style={{ width: 260 }} />
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes and states</h2>
          <p className="lead">The same 32 / 40 / 48px as TextField and Button. <b>readOnly</b> keeps the trigger focusable but never opens it.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              {(["sm", "md", "lg"] as const).map((size) => <Select key={size} size={size} label={`Size ${size}`} options={roles} />)}
              <Select label="Invalid" options={roles} required errorText="Choose a role." />
              <Select label="Read-only" options={roles} readOnly defaultValue="admin" />
              <Select label="Disabled" options={roles} disabled defaultValue="viewer" />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={selectProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use for 7 or more options, or when space is tight.", "Order options in a way people expect — alphabetical, or most used first."]}
            donts={["Use a Select for 2–5 options people should compare — use a RadioGroup.", "Make people scroll a long list to find one item — a searchable list is a Combobox."]}
          />
        </div>
      </section>

      {/* ============ NUMBER FIELD ============ */}
      <section className="component-doc" id="number-field">
        <h1>Number Field</h1>
        <p className="dek">A number with − and + steppers nested in the pill's ends, on React Aria's <span className="prop-values">useNumberField</span>. Typing is limited to what the format allows; the value is clamped and snapped on commit; arrow keys, Page Up / Down, Home and End step it.</p>

        <div className="example-box" style={{ display: "block" }}>
          <NumberField label="Guests" defaultValue={2} min={1} max={12} helpText="Up to 12." style={{ maxWidth: 220, margin: "0 auto" }} />
        </div>

        <div className="doc-section">
          <h2>Formats</h2>
          <p className="lead"><b>formatOptions</b> shows and parses currency, percent and units. The value is tabular, so it doesn't shift as it steps.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              <NumberField label="Price" defaultValue={24} step={0.5} formatOptions={{ style: "currency", currency: "USD" }} />
              <NumberField label="Discount" defaultValue={0.15} step={0.05} min={0} max={1} formatOptions={{ style: "percent" }} />
              <NumberField label="Width" defaultValue={120} hideSteppers formatOptions={{ style: "unit", unit: "centimeter" }} />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes and states</h2>
          <p className="lead">The same 32 / 40 / 48px as TextField. A stepper dims at <b>min</b> or <b>max</b>; <b>readOnly</b> hides them.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              {(["sm", "md", "lg"] as const).map((size) => <NumberField key={size} size={size} label={`Size ${size}`} defaultValue={1} min={1} />)}
              <NumberField label="Invalid" defaultValue={40} errorText="We only have 12 in stock." />
              <NumberField label="Read-only" defaultValue={8} readOnly />
              <NumberField label="Disabled" defaultValue={3} disabled />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={numberFieldProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use for counts and amounts people adjust by small steps.", "Set min and max so the steppers stop where the value must."]}
            donts={["Use for numbers that aren't quantities — phone numbers, card numbers, codes. Use a TextField (or InputOTP).", "Hide the steppers on a quantity people usually nudge by one."]}
          />
        </div>
      </section>

      {/* ============ SLIDER ============ */}
      <section className="component-doc" id="slider">
        <h1>Slider</h1>
        <p className="dek">Picks a number, or a range, by dragging along a track, on React Aria's <span className="prop-values">useSlider</span> and <span className="prop-values">useSliderThumb</span>. Each thumb is a native range input: arrow keys, Page Up / Down, Home and End work, and the formatted value is announced. The fill is <b>text.accent</b>, like ProgressBar.</p>

        <div className="example-box" style={{ display: "block" }}>
          <Slider label="Volume" defaultValue={60} style={{ maxWidth: 320, margin: "0 auto" }} />
        </div>

        <div className="doc-section">
          <h2>Ranges and formats</h2>
          <p className="lead">Two values make a range with two thumbs, named Minimum and Maximum. <b>formatOptions</b> formats the value shown beside the label and the one announced.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              <Slider label="Price range" defaultValue={[20, 80]} formatOptions={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />
              <Slider label="Opacity" defaultValue={0.4} min={0} max={1} step={0.05} formatOptions={{ style: "percent" }} />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes and states</h2>
          <p className="lead">A 6px (md) or 4px (sm) rail. The thumb is a raised knob drawn like a field; its hit area is 44px on touch screens either way.</p>
          <div className="sample-box demo-on-page">
            <div className="form-grid">
              <Slider label="Size md" defaultValue={40} />
              <Slider label="Size sm" size="sm" defaultValue={40} />
              <Slider label="Disabled" defaultValue={50} disabled />
            </div>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={sliderProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use where the relative position matters more than the exact number — volume, opacity, a price range.", "Show the value when people need to know it."]}
            donts={["Use for an exact value people will type — use a NumberField.", "Run heavy work on every move — use onValueCommit."]}
          />
        </div>
      </section>

      {/* ============ INPUT OTP ============ */}
      <section className="component-doc" id="input-otp">
        <h1>Input OTP</h1>
        <p className="dek">A one-time code as a row of round cells. Typing moves forward, Backspace back, arrow keys move freely and a paste fills every cell. The first cell offers <span className="prop-values">autocomplete="one-time-code"</span>, so phones can fill it from a text message. One cell is in the tab order at a time.</p>

        <div className="example-box" style={{ display: "block" }}>
          <InputOTP label="Verification code" helpText="Sent to +1 ••• 4417." style={{ width: "fit-content", margin: "0 auto" }} />
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">36 / 44 / 52px cells. A cell is a single-line control, so it takes <b>radius.control</b> — as wide as it is tall, the pill is a circle. Cells are never under 44px on touch screens.</p>
          <div className="sample-box demo-on-page" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            {(["sm", "md", "lg"] as const).map((size) => <InputOTP key={size} size={size} length={4} label={`Size ${size}`} defaultValue="12" />)}
          </div>
        </div>

        <div className="doc-section">
          <h2>States</h2>
          <div className="sample-box demo-on-page" style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <InputOTP label="Invalid" defaultValue="483" errorText="That code has expired." />
            <InputOTP label="Read-only" length={4} defaultValue="7702" readOnly />
            <InputOTP label="Disabled" length={4} disabled />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={otpProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Say where the code was sent in the help text.", "Submit on onComplete, and keep a way to resend."]}
            donts={["Use for passwords or anything longer than a short code.", "Clear the cells on an error — let people fix one digit."]}
          />
        </div>
      </section>

      {/* ============ DIALOG ============ */}
      <section className="component-doc" id="dialog">
        <h1>Dialog</h1>
        <p className="dek">
          A focused task that blocks the page. Built on React Aria's hooks: focus moves in and is trapped, the page behind is
          hidden from assistive tech and can't scroll, Escape closes it, and focus returns to whatever opened it. The title in{" "}
          <span className="prop-values">DialogHeader</span> is the accessible name; its description is linked too.
        </p>

        <div className="example-box">
          <Dialog trigger={<Button>Edit project</Button>}>
            {(close) => (
              <>
                <DialogHeader description="Changes apply to everyone on the team.">Edit project</DialogHeader>
                <DialogBody>
                  <TextField label="Project name" defaultValue="Datum" />
                </DialogBody>
                <DialogFooter>
                  <Button intent="neutral" appearance="outline" onClick={close}>Cancel</Button>
                  <Button onClick={close}>Save</Button>
                </DialogFooter>
              </>
            )}
          </Dialog>
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">400, 560 and 720px wide, or the full viewport. Every size keeps <b>radius.card</b> except full, whose corners are the viewport's.</p>
          <div className="sample-box">
            {(["sm", "md", "lg", "full"] as const).map((size) => (
              <Dialog key={size} size={size} trigger={<Button intent="neutral" appearance="outline">{size}</Button>}>
                {(close) => (
                  <>
                    <DialogHeader>Size {size}</DialogHeader>
                    <DialogBody>The body scrolls on its own when the dialog reaches the viewport height.</DialogBody>
                    <DialogFooter><Button onClick={close}>Done</Button></DialogFooter>
                  </>
                )}
              </Dialog>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Destructive confirmation</h2>
          <p className="lead"><b>role="alertdialog"</b> with <b>dismissible=false</b>: no close button, Escape and the scrim do nothing, so the choice is explicit.</p>
          <div className="sample-box">
            <Dialog role="alertdialog" dismissible={false} size="sm" trigger={<Button intent="danger" appearance="outline">Delete project</Button>}>
              {(close) => (
                <>
                  <DialogHeader description="This removes every file. It can't be undone.">Delete project?</DialogHeader>
                  <DialogFooter>
                    <Button intent="neutral" appearance="outline" onClick={close}>Cancel</Button>
                    <Button intent="danger" onClick={close}>Delete</Button>
                  </DialogFooter>
                </>
              )}
            </Dialog>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={dialogProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use for a short task that must finish or be cancelled before going on.", "Put the primary action last in the footer.", "Use alertdialog for destructive confirmations."]}
            donts={["Stack dialogs on dialogs.", "Use a dialog for information that could sit on the page — use an Alert.", "Use one for long forms or browsing — use a Sheet or a page."]}
          />
        </div>
      </section>

      {/* ============ SHEET ============ */}
      <section className="component-doc" id="sheet">
        <h1>Sheet</h1>
        <p className="dek">
          A panel that slides in from an edge — filters, settings, mobile navigation. It is a modal dialog with the same slots as
          Dialog: focus is trapped and returns on close, and Escape, the scrim and the close button all dismiss it.
        </p>

        <div className="example-box">
          <Sheet trigger={<Button intent="neutral" appearance="outline">Filters</Button>}>
            {(close) => (
              <>
                <DialogHeader description="Narrow the list.">Filters</DialogHeader>
                <DialogBody>
                  <Stack gap="sm">
                    <Checkbox label="Open issues" defaultChecked />
                    <Checkbox label="Assigned to me" />
                  </Stack>
                </DialogBody>
                <DialogFooter><Button onClick={close}>Apply</Button></DialogFooter>
              </>
            )}
          </Sheet>
        </div>

        <div className="doc-section">
          <h2>Sides</h2>
          <p className="lead">Flush with its edge; only the edge facing the page is rounded. It moves in by transform, and appears in place under reduced motion.</p>
          <div className="sample-box">
            {sheetSides.map((side) => (
              <Sheet key={side} side={side} trigger={<Button intent="neutral" appearance="outline">{side}</Button>}>
                <DialogHeader>From the {side}</DialogHeader>
                <DialogBody>320, 420 or 560px deep, always leaving a strip of scrim to tap.</DialogBody>
              </Sheet>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={sheetProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use for secondary tasks that relate to the page behind — filters, details, settings.", "Use side=\"bottom\" for mobile actions within thumb reach."]}
            donts={["Use for a confirmation — use a Dialog.", "Put primary navigation in a sheet on desktop, where it can stay on the page."]}
          />
        </div>
      </section>

      {/* ============ DROPDOWN MENU ============ */}
      <section className="component-doc" id="dropdown-menu">
        <h1>Dropdown Menu</h1>
        <p className="dek">
          Actions behind a trigger, on React Aria's menu hooks: arrow keys, Home/End, type-ahead, Escape, and focus back to the
          trigger. Checkbox and radio items are <span className="prop-values">menuitemcheckbox</span> and{" "}
          <span className="prop-values">menuitemradio</span>; a checkbox toggles in place, everything else closes the menu.
        </p>

        <div className="example-box">
          <MenuDemo />
        </div>

        <div className="doc-section">
          <h2>Sizes</h2>
          <p className="lead">32 and 40px items — pills, like every single-line control — on a <b>radius.card</b> surface. Both grow to 44px on touch screens.</p>
          <div className="sample-box">
            <MenuDemo size="sm" />
            <MenuDemo size="md" />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={menuProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Group related items with separators or labelled sections.", "Put destructive actions last, with intent=\"danger\".", "Show shortcuts you have actually bound."]}
            donts={["Use a menu to pick a form value — use a Select.", "Hide the only way to do a common action in a menu."]}
          />
        </div>
      </section>

      {/* ============ TOOLTIP ============ */}
      <section className="component-doc" id="tooltip">
        <h1>Tooltip</h1>
        <p className="dek">
          A short hint on hover (after 500ms) or keyboard focus (at once), linked with <span className="prop-values">aria-describedby</span>.
          Escape hides it. Ink on <b>radius.card</b>. It adds to the trigger's accessible name — an icon-only Button still needs its{" "}
          <span className="prop-values">label</span>.
        </p>

        <div className="example-box">
          <Tooltip content="Search the docs">
            <Button iconOnly label="Search" intent="neutral" appearance="ghost"><Search /></Button>
          </Tooltip>
          <Tooltip content="Add a member">
            <Button iconOnly label="Add" intent="neutral" appearance="outline"><Plus /></Button>
          </Tooltip>
        </div>

        <div className="doc-section">
          <h2>Placement</h2>
          <p className="lead">The preferred side; it flips when there is no room.</p>
          <div className="sample-box">
            {(["top", "right", "bottom", "left"] as const).map((placement) => (
              <Tooltip key={placement} content={`On the ${placement}`} placement={placement}>
                <Button intent="neutral" appearance="outline">{placement}</Button>
              </Tooltip>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={tooltipProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Name icon-only controls.", "Keep it to a few words, as plain text."]}
            donts={["Put links, buttons or anything interactive in a tooltip.", "Hide information people need — touch screens have no hover.", "Put one on a disabled control, which can't take focus."]}
          />
        </div>
      </section>

      {/* ============ POPOVER ============ */}
      <section className="component-doc" id="popover">
        <h1>Popover</h1>
        <p className="dek">Rich, interactive content anchored to a trigger — a small form, filters, details. A dialog on React Aria's <span className="prop-values">useOverlayTrigger</span>, <span className="prop-values">usePopover</span> and <span className="prop-values">useDialog</span>: focus moves in on open and back to the trigger on close; Escape or a click outside closes it. The menus' surface: <b>radius.card</b>, <b>elevation.overlay</b>.</p>

        <div className="example-box">
          <Popover trigger={<Button intent="neutral" appearance="outline">Filters</Button>} title="Filter results">
            <Text variant="body-sm">Only show results from the last 30 days.</Text>
            <TextField label="Keyword" size="sm" defaultValue="design" />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-compact)" }}>
              <Button size="sm" intent="neutral" appearance="ghost">Reset</Button>
              <Button size="sm">Apply</Button>
            </div>
          </Popover>
        </div>

        <div className="doc-section">
          <h2>Placement</h2>
          <p className="lead">The preferred side; it flips when there is no room.</p>
          <div className="sample-box">
            {(["top", "right", "bottom", "left"] as const).map((placement) => (
              <Popover key={placement} placement={placement} trigger={<Button intent="neutral" appearance="outline">{placement}</Button>}>
                <Text variant="body-sm">Opens on the {placement}.</Text>
              </Popover>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={popoverProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Keep it to one small task, with its own actions.", "Give it a title when the trigger's text doesn't say what's inside."]}
            donts={["Use for a list of actions — use a DropdownMenu.", "Put a long flow in it — use a Dialog or a Sheet."]}
          />
        </div>
      </section>

      {/* ============ HOVER CARD ============ */}
      <section className="component-doc" id="hover-card">
        <h1>Hover Card</h1>
        <p className="dek">A preview on hover (after 500ms) or keyboard focus — a profile, a page summary. It stays open while the pointer is on the trigger or the card; Escape closes it. Unlike a Tooltip it can hold links, but it is supplementary: never the one way to reach something.</p>

        <div className="example-box">
          <Text>
            Written by{" "}
            <HoverCard trigger={<Link href="#hover-card">Ada Lovelace</Link>}>
              <div style={{ display: "flex", gap: "var(--space-compact)", alignItems: "center" }}>
                <Avatar name="Ada Lovelace" />
                <strong>Ada Lovelace</strong>
              </div>
              <span>Mathematician, and the first to publish an algorithm for a machine.</span>
              <Link href="#hover-card">View profile</Link>
            </HoverCard>
            , 1843.
          </Text>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={hoverCardProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Preview what the link leads to.", "Keep the same content reachable by following the trigger."]}
            donts={["Put the only way to an action in it — touch screens have no hover.", "Use for a short hint on a control — use a Tooltip."]}
          />
        </div>
      </section>

      {/* ============ CONTEXT MENU ============ */}
      <section className="component-doc" id="context-menu">
        <h1>Context Menu</h1>
        <p className="dek">DropdownMenu's menu, opened by right-click at the pointer or by Shift+F10 from anything focused inside the region. macOS has no keyboard equivalent, so every action must also be reachable another way.</p>

        <div className="example-box" style={{ display: "block" }}>
          <ContextMenu items={contextItems}>
            <div className="demo-cell" style={{ height: 160, display: "grid", placeItems: "center", border: "1px dashed var(--color-border-strong)", borderRadius: "var(--radius-card)" }}>
              Right-click anywhere here
            </div>
          </ContextMenu>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={contextMenuProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Mirror actions that also live in a visible menu or toolbar.", "Keep the order and wording of the matching DropdownMenu."]}
            donts={["Hide an action only here — people rarely look for it.", "Replace the browser's menu on text people will want to copy."]}
          />
        </div>
      </section>

      {/* ============ TABS ============ */}
      <section className="component-doc" id="tabs">
        <h1>Tabs</h1>
        <p className="dek">
          Switch between views in the same place, on React Aria's tab hooks: arrow keys move and select, Home and End jump, disabled
          tabs are skipped. Give an item <span className="prop-values">content</span> and it becomes the tab panel.
        </p>

        <div className="example-box">
          <Tabs items={tabItems} aria-label="Project" style={{ width: "100%" }} />
        </div>

        <div className="doc-section">
          <h2>Appearances</h2>
          <p className="lead"><b>underline</b> for page sections, <b>pill</b> (ink when selected, like a pressed Button) for filters, <b>segmented</b> (a raised thumb on a track) for switching a view in place.</p>
          <div className="sample-box column">
            {(["underline", "pill", "segmented"] as const).map((appearance) => (
              <Tabs key={appearance} items={plainTabs} appearance={appearance} aria-label={appearance} />
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Sizes and width</h2>
          <p className="lead">32 and 40px, growing to 36 and 44px on touch screens. <b>fullWidth</b> shares the row.</p>
          <div className="sample-box column">
            <Tabs items={plainTabs} appearance="segmented" size="sm" aria-label="Small" />
            <Tabs items={plainTabs.slice(0, 3)} appearance="segmented" fullWidth aria-label="Full width" style={{ width: "100%" }} />
          </div>
        </div>

        <div className="doc-section">
          <h2>Vertical</h2>
          <p className="lead">The list stands beside the panel; up and down arrows move.</p>
          <div className="sample-box">
            <Tabs items={tabItems} orientation="vertical" aria-label="Vertical" />
            <Tabs items={tabItems} appearance="pill" orientation="vertical" aria-label="Vertical pill" />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={tabsProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Keep labels to a word or two.", "Use segmented for two to four views of the same thing."]}
            donts={["Use tabs to move between pages — use the Navbar or links.", "Use tabs for steps in a sequence."]}
          />
        </div>
      </section>

      {/* ============ BREADCRUMBS ============ */}
      <section className="component-doc" id="breadcrumbs">
        <h1>Breadcrumbs</h1>
        <p className="dek">
          Where you are in a hierarchy: a labelled <span className="prop-values">nav</span> with an ordered list. Links are{" "}
          <b>text.secondary</b> and step up to primary on hover; the current page is text with{" "}
          <span className="prop-values">aria-current="page"</span>.
        </p>

        <div className="example-box">
          <Breadcrumbs>
            <BreadcrumbItem href="#breadcrumbs">Home</BreadcrumbItem>
            <BreadcrumbItem href="#breadcrumbs">Docs</BreadcrumbItem>
            <BreadcrumbItem href="#breadcrumbs">Components</BreadcrumbItem>
            <BreadcrumbItem current>Breadcrumbs</BreadcrumbItem>
          </Breadcrumbs>
        </div>

        <div className="doc-section">
          <h2>Separators and sizes</h2>
          <p className="lead">A chevron or a slash, hidden from screen readers; body-md or body-sm.</p>
          <div className="sample-box column">
            {(["chevron", "slash"] as const).map((separator) => (
              <Breadcrumbs key={separator} separator={separator} size="sm">
                <BreadcrumbItem href="#breadcrumbs">Home</BreadcrumbItem>
                <BreadcrumbItem href="#breadcrumbs">Docs</BreadcrumbItem>
                <BreadcrumbItem current>{separator}</BreadcrumbItem>
              </Breadcrumbs>
            ))}
          </div>
        </div>

        <div className="doc-section">
          <h2>Collapsed</h2>
          <p className="lead">With <b>maxItems</b>, the middle folds into a … button; the first item and the last ones stay.</p>
          <div className="sample-box">
            <Breadcrumbs maxItems={3}>
              {["Home", "Docs", "Components", "Navigation"].map((x) => <BreadcrumbItem key={x} href="#breadcrumbs">{x}</BreadcrumbItem>)}
              <BreadcrumbItem current>Breadcrumbs</BreadcrumbItem>
            </Breadcrumbs>
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={breadcrumbsProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Start at the site's root.", "End with the current page, not a link to it."]}
            donts={["Use breadcrumbs for a flat site.", "Use them as a history of pages visited."]}
          />
        </div>
      </section>

      {/* ============ PAGINATION ============ */}
      <section className="component-doc" id="pagination">
        <h1>Pagination</h1>
        <p className="dek">
          Move through pages of results. Built from Buttons, so pages inherit their hover, press, focus and touch rules. The current
          page is ink with <span className="prop-values">aria-current="page"</span>; the first and last pages always show.
        </p>

        <div className="example-box">
          <Pagination pageCount={12} defaultValue={6} />
        </div>

        <div className="doc-section">
          <h2>Siblings</h2>
          <p className="lead">How many pages either side of the current one. The list keeps its length as you move, so the arrows don't jump.</p>
          <div className="sample-box column">
            <Pagination pageCount={20} defaultValue={10} siblings={2} />
          </div>
        </div>

        <div className="doc-section">
          <h2>Compact and small</h2>
          <p className="lead">"Page 3 of 12" between the arrows for tight spaces; 32px buttons with size sm.</p>
          <div className="sample-box column">
            <Pagination pageCount={12} defaultValue={3} compact />
            <Pagination pageCount={12} defaultValue={3} size="sm" />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={paginationProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Use getHref on websites, so every page has a URL.", "Put it under the results it pages through."]}
            donts={["Paginate a list short enough to show whole.", "Use it for steps in a form."]}
          />
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <section className="component-doc" id="footer">
        <h1>Footer</h1>
        <p className="dek">
          The site footer: a lead column, groups of links (a heading and a named list each, in a Footer{" "}
          <span className="prop-values">nav</span>) and a bottom row for legal and social.
        </p>

        <div className="example-box" style={{ display: "block", padding: 0, overflow: "hidden" }}>
          <Footer columns={footerColumns} bottom={<><span>© 2026 Datum</span><Link href="#footer">Status</Link></>}>
            <strong style={{ color: "var(--color-text-primary)" }}>Datum</strong>
            <p>Components for building websites, in orange and navy.</p>
          </Footer>
        </div>

        <div className="doc-section">
          <h2>Tones</h2>
          <p className="lead"><b>muted</b> (the default) sits on bg.surface; <b>default</b> stays on the page with a hairline above.</p>
          <div className="sample-box stack" style={{ padding: 0, overflow: "hidden" }}>
            <Footer tone="default" bottom={<span>© 2026 Datum</span>} columns={footerColumns.slice(0, 2)} />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={footerProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Keep columns to five links or so.", "Repeat the important links from the Navbar."]}
            donts={["Put a third text color in the footer — step down a type role instead.", "Hide the only path to a page in the footer."]}
          />
        </div>
      </section>

      {/* ============ NAVBAR ============ */}
      <section className="component-doc" id="navbar">
        <h1>Navbar</h1>
        <p className="dek">
          One site header for every website layout. Built from Container, Button, DropdownMenu and Sheet, so it inherits their keyboard
          and focus behavior. A link can open a dropdown or a mega menu; below the breakpoint, links move into a Sheet with accordion
          groups. Replaces Header, Nav and NavigationMenu.
        </p>

        <div className="example-box" style={{ display: "block", padding: 0 }}>
          <DemoNavbar announcement={<>Datum 2 is out. <Link href="#navbar">Read the notes</Link></>} />
        </div>

        <div className="doc-section">
          <h2>Layouts</h2>
          <p className="lead"><b>standard</b>: logo left, links center, actions right · <b>start</b>: logo and links left · <b>centered</b>: logo in the middle.</p>
          <div className="sample-box stack">
            {navbarLayouts.map((layout) => <DemoNavbar key={layout} layout={layout} size="compact" />)}
          </div>
        </div>

        <div className="doc-section">
          <h2>Appearances</h2>
          <p className="lead"><b>solid</b> and <b>blur</b> (translucent, blurring the page behind) for most sites; <b>transparent</b> sits over a hero and turns solid once the page scrolls; <b>inverse</b> is an ink band that re-points the text and focus tokens, so the Buttons inside follow.</p>
          <div className="sample-box stack">
            {navbarAppearances.map((appearance) => <DemoNavbar key={appearance} appearance={appearance} size="compact" layout="start" />)}
          </div>
        </div>

        <div className="doc-section">
          <h2>Menus</h2>
          <p className="lead">Give a link <b>items</b> for a dropdown (Resources), or <b>columns</b> for a mega menu with descriptions (Solutions). Both are React Aria menus of real links: arrow keys, typeahead, Escape.</p>
        </div>

        <div className="doc-section">
          <h2>Mobile</h2>
          <p className="lead">Below <b>mobileBreakpoint</b> (640 / 768 / 1024px) the links fold into a Sheet: plain links as rows, menus as accordions, with the one holding the current page open. Narrow the window to see it.</p>
          <div className="sample-box">
            <DemoNavbar mobileBreakpoint="lg" style={{ width: "100%" }} />
          </div>
        </div>

        <div className="doc-section">
          <h2>Properties</h2>
          <PropsTable rows={navbarProps} />
        </div>

        <div className="doc-section">
          <h2>Usage guidelines</h2>
          <Usage
            dos={["Keep five to seven top-level links.", "Use one accent action; the rest ghost.", "Set maxWidth to match the page's Container."]}
            donts={["Use transparent where the hero behind it can't hold the text's contrast.", "Nest menus inside menus.", "Use hideOnScroll on a short page."]}
          />
        </div>
      </section>
    </div>
  );
}
