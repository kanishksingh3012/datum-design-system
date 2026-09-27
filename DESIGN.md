---
name: Datum
description: A React component library for building websites — two themes (orange, navy) on one token pipeline, accessibility verified in light and dark
colors:
  orange-brand: "#FC6E20"
  orange-accent: "#B34210"
  orange-on-accent: "#FFFFFF"
  orange-accent-subtle: "#FFE7D0"
  orange-accent-text: "#B34210"
  orange-page: "#FDF9F6"
  orange-ink: "#1B1B1B"
  orange-surface-dark: "#323232"
  navy-accent: "#355695"
  navy-on-accent: "#FFFFFF"
  navy-accent-subtle: "#E2ECFD"
  navy-accent-text: "#355695"
  navy-page: "#F8F9FA"
  navy-ink: "#343A40"
  navy-border: "#CED4DA"
  danger: "#D52F4A"
  warning: "#F1C035"
  success: "#007440"
typography:
  display:
    fontFamily: "Barlow, Helvetica Neue, Arial, sans-serif"
    fontWeight: 800
  body:
    fontFamily: "Instrument Sans, Helvetica Neue, Arial, sans-serif"
    fontWeight: 400
  mono:
    fontFamily: "IBM Plex Mono, SF Mono, Menlo, Consolas, monospace"
rounded:
  control: "999px"
  card: "20px"
  subtle: "7.5px"
  pill: "999px"
spacing:
  compact: "8px"
  tight: "12px"
  default: "16px"
  section: "32px"
---

# Design System: Datum

## Overview

Datum is a design system and React UI library for building websites. It ships **two themes as a set** — **orange** (warm, high-energy) and **navy** (restrained, institutional) — that share one base of typography, spacing, radius, and motion and differ only in color and shadow tint. A product picks one with `data-theme="orange"` or `data-theme="navy"`; both support light and dark mode.

**Key characteristics**
- One accent per theme carries the whole emphasis ladder: solid fill (primary), tint (secondary), text color (link). No unrelated colors for "less important."
- State colors (danger, warning, success, info) are held well away from each theme's brand hue, so a status never reads as branding.
- Pill-first shape language: no sharp corners anywhere. Single-line controls are full pills; surfaces get a generous 20px radius.
- Shadows only where something is genuinely lifted; most controls are flat.
- Every text and border pairing is measured against WCAG AA in both themes and both modes before it ships.

## Token architecture

```
primitives.json      raw ramps (orange, stone, navy, slate, crimson, yellow, emerald, azure, cyan), sizes, weights, shadows
base.json            shared: fonts, 20 type roles, spacing, radius, icons, grid, motion
themes/orange.json   color + elevation for orange
themes/navy.json     color + elevation for navy
contract.json        175 required tokens — the build fails if a theme misses one
dist/*.css           orange.css, navy.css, themes.css (both)
```

Components only ever reference semantic tokens (`--color-bg-accent`, `--type-body-md-size`, `--elevation-overlay`) — never a primitive or a hex value.

## Colors

### Orange theme
- **Brand** — orange ramp, anchored at `#FC6E20` (orange-500). Primary buttons carry **white** text in both themes, and white on orange-500 is only 2.84:1. So the accent fill is orange-700 `#B34210` (white 5.67:1) in light and dark mode. Hover and active go darker (orange-800, orange-900) so the label keeps its contrast. Bright orange-500 remains the brand color for tints, focus and illustration.
- **Accent subtle** — `#FFE7D0` (orange-100). It shares the brand's hue family, so it is a tint of the brand, not a neutral: secondary buttons, selected rows, soft highlights.
- **Neutral** — warm stone ramp (hue 66°), anchored to `#323232` and `#1B1B1B`, which are also the dark-mode surface and page.
- **States** — danger is crimson (not red, too close to orange), warning is golden yellow (not amber, same reason), success emerald, info azure.

### Navy theme
- **Brand** — navy ramp. The accent fill is navy-700 `#355695` with white text (7.2:1), so it reads as blue next to the near-black ink button; navy-900 `#1F2E4A` was too close to ink. Hover goes lighter (navy-600, 5.0:1), active darker (navy-800). Links and selection use navy-700 / navy-600. In dark mode the fill is navy-300 with navy-950 text.
- **Neutral** — cool slate ramp (hue 248°), anchored to `#F8F9FA`, `#CED4DA`, `#343A40`.
- **States** — info is cyan (blue would read as brand), danger crimson, warning golden yellow, success emerald.

### Ink (inverse)
Each theme also has an ink fill for neutral solid buttons and dark bands: `bg.inverse` (near-black in light mode, near-white in dark), `bg.inverseHover`, and `text.onInverse`. Orange uses the stone ramp, navy the slate ramp.

### Rules for both
- A fill (`bg.accent`, `bg.danger`, …) is always paired with its `text.on*` token. **Never hardcode white on an accent** — use `text.onAccent`; its value is set per theme and mode for contrast.
- Colored text on the page uses `text.*` roles, which are chosen per mode for contrast.
- **Hierarchy comes from type roles (size, weight, case) and two text colors — never a third gray.** Text is `text.primary` or `text.secondary` (plus `text.disabled`); less important text steps down a role (`body-sm`, `ui.caption`, `ui.label`, `ui.overline`) rather than getting lighter.
- Borders on interactive controls (`border.strong`, `border.focus`) meet 3:1 against both the page and `bg.surface`; `border.subtle` and `border.default` are decorative and have no minimum.

## Typography

Three families, shared by both themes: **Barlow** (display, headings), **Instrument Sans** (reading and interface), **IBM Plex Mono** (numbers and code). Twenty roles, picked by purpose rather than size:

| Role | Steps | Use |
|---|---|---|
| display | lg 56 · md 48 · sm 40 | Hero statements, one per view |
| heading | xl 32 · lg 24 · md 20 · sm 18 | Page, section, subsection, card titles |
| body | lg 18 · md 16 · sm 14 | Interface running text |
| paragraph | lg 18 · md 16 | Long-form reading (looser line height, 1.7) |
| ui | label · caption · overline (12) | Form labels, helper text, category markers |
| numeric | lg 32 · md 20 · sm 14 | Figures, prices, stats — tabular by construction |
| code | md 14 · sm 12 | Inline and block code |

Each role defines family, size, weight, line height and tracking, e.g. `--type-heading-lg-size`.

## Elevation & depth

Four roles, named by where they apply:
- **field** — inputs, checkboxes, switch thumbs
- **surface** — cards, panels, alerts
- **raised** — high-commitment fills only (primary, danger, pressed, floating)
- **overlay** — menus, popovers, dialogs, toasts

Light-mode shadows are tinted with the theme's own neutral (warm brown for orange, slate-navy for navy). In dark mode every layer turns plain black at higher opacity plus a 1px inset highlight. Never a colored glow.

## Shapes & space

Datum is **pill-first**: nothing has a sharp corner.

| Token | Value | Use |
|---|---|---|
| `radius.control` | 999px (pill) | Every single-line control — buttons, text fields, selects, badges, tabs, pagination, menu and option items |
| `radius.card` | 20px | Anything that holds content or wraps — cards, alerts, toasts, menus, popovers, dialogs, sheets, textareas |
| `radius.subtle` | 7.5px | Small square elements that must stay square — checkboxes, code chips |
| `radius.pill` | 999px | The shape itself, when something must be round regardless of role |

One exception to pill-first: a band that runs **full bleed** — touching both edges of the viewport, like a page banner (`Alert fullBleed`) — has square ends, because its corners are the viewport's. The same band anywhere else (in a card, a column, a dialog) keeps `radius.card`.

Two rules keep this from breaking: a **checkbox is never round** (a round checkbox reads as a radio button), and a **tall or multi-line box is never a pill** (it becomes a stadium) — those use `radius.card`. Nested corners follow the outer radius minus the padding between them.

Radius is still one base (10px) times a ratio underneath (xs ×0.25 through 3xl ×3), so the whole system can be re-tuned from one value. Spacing runs on a 4px grid: compact 8, tight 12, default 16, section 32.

## Interaction rules

These come from Button and apply to **every** component. `npm run check` enforces the ones marked ✓.

| Rule | How |
|---|---|
| **Hover changes a token** ✓ | Hover swaps to a real hover token (`bg.accentHover`, `bg.dangerHover`, `bg.inverseHover`, `bg.accentSubtleHover`). Where no hover token exists, mix toward the text color with `color-mix()`, e.g. 8% `text.primary`. Never `filter: brightness()` or opacity tricks; the hover state must pass contrast like any other state. |
| **Press feedback** | `:active` scales the control to 0.98 (`motion.fast`). A toggle's on state is `aria-pressed="true"` and takes the solid treatment of its intent. Disabled and loading controls don't react. |
| **Focus rings on fills** ✓ | On a colored fill (a solid Alert, an ink band, an accent section), focus rings use that fill's on-color (`text.onAccent`, `text.onDanger`, `text.onInverse`, …) instead of `border.focus`, which can't reach 3:1 on every fill. The fill re-points the token for everything inside it — `--color-border-focus: <its on-color>` — so nested Buttons and Links follow without their own overrides. The checker measures every ring against what is painted behind it. |
| **Focus ring is keyboard-only** ✓ | `:focus-visible`, never `:focus`: a 2px `border.focus` outline with a 2px offset, measured at 3:1. A focused item in a group rises above its neighbors (`z-index: 1`) so the ring is never clipped. |
| **All timing from motion tokens** ✓ | `motion.fast` (120ms) for color, background, border, shadow and press. `motion.normal` (200ms) for movement and size, like the ButtonGroup thumb. `motion.slow` (320ms) for loops like the spinner. `motion.easing` for all of them. No raw `ms` or `s` values. Derived timings are allowed, e.g. `calc(var(--motion-slow) * 4)`. |
| **What may animate** | `background`, `color`, `border-color`, `box-shadow`, `text-decoration-color`, `transform`. Moving indicators such as the thumb may animate `width`/`height` only because they are absolutely positioned and can't push content. Never animate layout (margin, padding, the size of an element in the flow). |
| **Reduced motion** | Under `prefers-reduced-motion: reduce`, movement stops: no press scale, no sliding thumb, no text transitions. Color and background fades may stay. A spinner keeps turning, but slower, because it is the only sign of progress. |
| **Loading without layout shift** | The content stays in place with its text made transparent, so the size and the accessible name stay. A spinner in `text` color is centered on top and must reach 3:1 ✓. `aria-busy="true"`, and clicks are blocked via `aria-disabled`, but the control **keeps focus**. |
| **Disabled** | Native `disabled` (so it leaves the tab order), opacity 0.5, `cursor: not-allowed`, no hover or press. Exempt from contrast, as in WCAG. When a control renders as an anchor it uses `aria-disabled="true"` and `tabindex="-1"` instead. |
| **44px touch targets** ✓ | Under `pointer: coarse`, every control's hit area is at least 44 × 44 (`interaction.minTarget`). md grows to 44; smaller controls keep their look and extend an invisible `::after` hit area. Links in running text (`underline="always"`) are exempt, as in WCAG 2.5.8. |

## Component API conventions

These apply to every component, alongside the Interaction rules.

**State comes as a trio**: the current value (controlled), a default value (uncontrolled), and a change callback that receives the new value. Pass the first to own the state; pass the second to let the component hold it. The callback fires either way. Boolean state keeps its own name rather than a generic `value`:

| State | Current | Default | On change | Used by |
|---|---|---|---|---|
| Pressed (toggle) | `pressed` | `defaultPressed` | `onPressedChange(pressed)` | Button in toggle mode |
| Checked | `checked` | `defaultChecked` | `onCheckedChange(checked)` | Checkbox, Switch |
| Value | `value` | `defaultValue` | `onValueChange(value)` | Accordion, and anything else that holds a value (fields, selects, tabs, radio groups, sliders) |
| Open | `open` | `defaultOpen` | `onOpenChange(open)` | Anything that opens: menus, dialogs, popovers, sheets, tooltips |

| Rule | How |
|---|---|
| **Behavior** | Interactive behavior and state use the `react-aria` and `react-stately` hooks, as Accordion does (`useDisclosureGroupState` + `useDisclosure`) and Button's toggle does (`useToggleState`) — never `react-aria-components`. The markup, class names and data attributes stay Datum's own. |
| **Breaking changes** | A removed or renamed prop is recorded in the decision log below, with what replaces it. |

## Do's and don'ts

- **Do** pick a type role by purpose, not by the size you want.
- **Do** test every component in all four combinations: orange/navy × light/dark.
- **Do** reserve shadow for things that are genuinely lifted.
- **Don't** hardcode a hex value, a pixel font size, or white text on an accent.
- **Don't** give a checkbox or a multi-line box a pill radius.
- **Don't** reuse a brand hue for a state color.
- **Don't** add a third text gray — step down the type role instead.

## Decision log

- **2026-09-26** — Purple (`minimal`) retired. Datum ships orange and navy as a set, selected by `data-theme`.
- **2026-09-26** — Tokens split into `base.json` (shared) and per-theme files (color + elevation only).
- **2026-09-26** — Type moved from an 8-step scale to 20 semantic roles (display, heading, body, paragraph, ui, numeric, code). Components renamed onto them with identical values.
- **2026-09-26** — Fonts kept: Barlow, Instrument Sans, IBM Plex Mono.
- **2026-09-26** — Orange's warning moved to golden yellow and danger to crimson; navy's info moved to cyan — each to keep states off the brand hue.
- **2026-09-26** — Subtle tints in the new themes come from ramp steps, not `color-mix()`, so the reference cream `#FFE7D0` can be used exactly.
- **2026-09-26** — Phase 1 of the component library is ~30 components for website building; the remaining ~30 are wave 2.
- **2026-09-27** — Pill-first shape language: `radius.control` becomes a full pill, `radius.card` rises to 20px, new `radius.subtle` (7.5px) for checkboxes. Button has no shape option — pill is Datum's identity. Nine containers that used the control radius moved to the card radius.
- **2026-09-27** — Ink tokens added (`bg.inverse`, `bg.inverseHover`, `text.onInverse`) for neutral solid buttons.
- **2026-09-27** — Header, Nav and NavigationMenu merge into one versatile Navbar. Table and Slider stay in wave 2; page blocks come after the components. Component plan approved.
- **2026-09-27** — Button rebuilt to the plan (intent × appearance × size, pill only, ink for neutral solid). `npm run check` added: every registered component is rendered in all four combinations and fails on contrast or hardcoded colors.
- **2026-09-27** — Navy accent fill moved from navy-900 to navy-700 (hover navy-600, active navy-800) so it is distinct from the ink button in light mode.
- **2026-09-27** — ButtonGroup rebuilt: spaced by default; `attached` is one tinted track with a raised thumb that slides to the pressed segment (200ms; none under reduced motion), chosen over a split-pill design. Vertical tracks use `radius.card`, and their segments use `radius.card` minus the track inset so the corners stay concentric. `size`, `intent` and `appearance` pass down to child Buttons.
- **2026-09-27** — `border.strong` becomes mode-aware (navy: slate-600 / slate-400; orange: stone-500 / stone-400). It failed 3:1 on `bg.surface` in three of the four combinations.
- **2026-09-27** — Orange primary buttons use white text, like navy. The accent fill moves from orange-500 to orange-700 (hover orange-800, active orange-900) so white passes AA (5.67:1).
- **2026-09-27** — Link rebuilt to the plan: tone, underline, external, size. Links in running text keep the underline (WCAG 1.4.1); `decorationStyle` dropped.
- **2026-09-27** — Interaction rules written from Button and enforced by `npm run check` where they can be (filters, raw timings, `:focus`, spinner contrast, 44px touch targets). Button loading now overlays the spinner without changing size; small controls get a 44px touch hit area.
- **2026-09-27** — Layout and Typography built: Container, Stack, Grid, Section, Heading, Text. Gaps (0/4/8/16/24/32) and Section padding (32/64/96) are derived from the space tokens; Container uses `grid.container` and `grid.margin`. Heading size follows level unless overridden (1 xl, 2 lg, 3 md, 4–6 sm).
- **2026-09-27** — `npm run check` now also measures static text marked `data-check-text`. It found: orange light `border.strong` failing 3:1 on `bg.accentSubtle` (moved stone-500 → stone-600); dark `text.danger` and `text.success` failing 4.5:1 on `bg.surface` (400 → 300); `text.tertiary` failing on `bg.surface` in orange dark and both navy modes — it now shares `text.secondary`'s step there rather than adding off-ramp colors.
- **2026-09-27** — `text.tertiary` removed from both themes and the contract (it had become a copy of secondary). Datum uses two text colors, `text.primary` and `text.secondary`, plus `text.disabled`; hierarchy comes from type roles (size, weight, case), never a third gray. Text's `tone` drops `tertiary`.
- **2026-09-27** — Content built: Card, Badge, Avatar (+ AvatarGroup), Separator, Accordion. An interactive Card is an `<a>` or `<button>` that lifts 2px on hover; a clickable outline card uses `border.strong` so its edge reaches 3:1. Badge shares Button's intent and appearance vocabulary (neutral solid is ink). Square avatars use `radius.subtle`. React Aria enters as a dependency with Accordion (disclosure hooks); the panel height is not animated, only the chevron turns.
- **2026-09-27** — Component API conventions written: `value` / `defaultValue` / `onValueChange` for values, `open` / `defaultOpen` / `onOpenChange` for things that open, `react-aria` + `react-stately` hooks (never `react-aria-components`), and removed or renamed props recorded here.
- **2026-09-27** — Props removed or renamed in the Content rebuild: Card `variant` (flat · elevated) → `appearance` (elevated · outline · soft; flat was a surface fill plus a border: use `outline` for the border or `soft` for the fill). Badge `variant` → `intent`, with `appearance` added (the old accent, success, warning and danger fills are now `solid`; the default is `soft`). Avatar `initials` removed (derived from `name`); `name` is now optional; size `default` → `md`. Accordion: AccordionItem `defaultOpen` → `defaultValue` on Accordion (with `value` on each item); items are no longer `<details>`.
- **2026-09-27** — Plain Accordion drops its dividers: they ran into the rounded hover fill. Panel content gets `space.tight` above it.
- **2026-09-27** — Every piece of component state comes as a trio: current, default, on-change. Boolean state keeps its own name — `pressed` / `defaultPressed` / `onPressedChange` for toggle Buttons, `checked` / `defaultChecked` / `onCheckedChange` for Checkbox and Switch — and the rest use `value` / `defaultValue` / `onValueChange` or `open` / `defaultOpen` / `onOpenChange`. Button gains `defaultPressed` (uncontrolled toggle, via `useToggleState`).
- **2026-09-27** — Feedback built: Alert, Toast, Spinner, ProgressBar, Skeleton. Alert shares Badge's intent and appearance vocabulary; `solid` is a full-width banner with square ends, and focus rings inside it use the text color, since `border.focus` can't be relied on against a state fill. Toast runs on React Aria's toast hooks (`useToastRegion`, `useToast`, `ToastQueue`): one raised surface for every intent, which shows as the icon; the stack is an F6 landmark and timers pause on hover and focus. ProgressBar fills use the intent's `text.*` color so even warning reaches 3:1 against the track, and the fill moves with `transform`, never width. Indeterminate ProgressBar keeps moving under reduced motion, slower, like the spinner; Skeleton's pulse stops. Skeleton pulses its background toward the text color instead of fading opacity.
- **2026-09-27** — Props removed or renamed in the Feedback rebuild: Alert `variant` → `intent` (adds info and neutral; the default is now `info`), `body` → `description`; `title` is now optional and a ReactNode; `appearance`, `action`, `dismissible` and `open` / `defaultOpen` / `onOpenChange` added. Toast is no longer a component: `<Toast text onDismiss>` → `toast({ title, … })` plus one `<Toaster position>`. ProgressBar `value` is optional (omit for indeterminate) and `label` is now a visible label that names the bar (pass `aria-label` for no visible label). Skeleton `shape="avatar"` → `shape="circle"`; `rect`, `lines`, `animated` and `height` added; it is now `aria-hidden`.
- **2026-09-27** — Solid Alert keeps `radius.card` by default; new `fullBleed` squares the ends (and drops side borders) only when the alert touches both viewport edges. Documented as the one pill-first exception in Shapes. Focus rings on fills written as an Interaction rule: the fill re-points `--color-border-focus` to its on-color (replacing Alert's `:focus-visible { outline-color: currentColor }` override), and `npm run check` already fails a ring on a fill below 3:1 — verified by removing the rule (orange ring 1.47–2.35:1 on info, success and warning fills).
- **2026-09-28** — Forms built: Field + Label, TextField, Textarea, Checkbox (+ CheckboxGroup), Radio (+ RadioGroup), Switch, Select. One `Field` wires label, help and error text to any control through React Aria's `useField`; TextField, Textarea and Select share its frame and one field box (`bg.surfaceRaised`, `border.strong`, `elevation.field`; hover mixes the edge 40% toward `text.primary`; the ring goes round the whole box). Labels are `ui.label`, help text `ui.caption` in `text.secondary`, errors `text.danger` with an icon; the required `*` is `aria-hidden` (the control's `required` is announced). `readOnly` keeps full contrast and focus but draws a dashed edge with no fill, so it never reads as disabled. Checkbox, Radio and Switch are native inputs under a drawn indicator, on `useCheckbox` / `useRadio` / `useSwitch`; a description is linked with `aria-describedby` and kept out of the accessible name. Checked indicators are `bg.accent` with a `border.accent` edge: `bg.accent` alone is 1.8:1 on `bg.surface` in orange dark. Hover on a choice is a halo in the text color, so the checked fill never drops below 3:1. Radio `card` tiles use `border.strong` (they are controls) and ring the whole tile. Select moves off the native `<select>` to a React Aria listbox (`useSelect`, `useListBox`, `usePopover`) with groups as sections, pill options (card radius when they have a description), and a `HiddenSelect` for form submission; read-only never opens.
- **2026-09-28** — `npm run check` now measures form controls: text inputs and textareas on the box that draws them (`[data-control]`), checkboxes, radios and switches on their indicator (its edge or fill must reach 3:1 against what is behind it), with hover on the drawn element and touch targets on the label row or box. A border is now measured whenever the fill alone doesn't reach 3:1, not only on unfilled controls. `data-check-text="deep"` measures every text element inside a fixture (labels, help, errors, counters).
- **2026-09-28** — Props removed or renamed in the Forms rebuild: TextField, Textarea and Select take `value` / `defaultValue` / `onValueChange` (native `onChange` still fires on TextField and Textarea); TextField's native `size` attribute is replaced by `size` (sm · md · lg). Select `children` (`<option>`s) → `options` (`{ value, label, description, disabled, group }`); its `ref` is now the trigger button and other props go on the field root, not a `<select>`. Radio `name` moves to RadioGroup (optional), and a Radio must be inside a RadioGroup with a `value`. Checkbox `label` is now a ReactNode and `checked` / `defaultChecked` accept `"indeterminate"`, with `onCheckedChange` added; Switch gains `checked` / `defaultChecked` / `onCheckedChange`. On TextField, Textarea, Checkbox and Switch, `className` goes on the root and every other prop on the native input.
- **2026-09-28** — Switch redesigned: a filled track, ink (`bg.inverse`) when off and `bg.accent` when on, with the fill's on-color thumb sliding across; hover uses `bg.inverseHover` / `bg.accentHover`. The outlined off track is gone. Fixed with it: styles a component layers over a shared (`composes`) base now use a doubled class so they win whatever order the CSS loads in — Textarea had been drawn as a pill with no padding, and the Switch track had collapsed to a circle.
