---
name: Datum
description: A React component library for building websites — two themes (orange, navy) on one token pipeline, accessibility verified in light and dark
colors:
  orange-accent: "#FC6E20"
  orange-on-accent: "#1B1B1B"
  orange-accent-subtle: "#FFE7D0"
  orange-accent-text: "#B34210"
  orange-page: "#FDF9F6"
  orange-ink: "#1B1B1B"
  orange-surface-dark: "#323232"
  navy-accent: "#1F2E4A"
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
  control: "10px"
  card: "10px"
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
- Pill radius on controls, 10px on cards and surfaces.
- Shadows only where something is genuinely lifted; most controls are flat.
- Every text and border pairing is measured against WCAG AA in both themes and both modes before it ships.

## Token architecture

```
primitives.json      raw ramps (orange, stone, navy, slate, crimson, yellow, emerald, azure, cyan), sizes, weights, shadows
base.json            shared: fonts, 20 type roles, spacing, radius, icons, grid, motion
themes/orange.json   color + elevation for orange
themes/navy.json     color + elevation for navy
contract.json        171 required tokens — the build fails if a theme misses one
dist/*.css           orange.css, navy.css, themes.css (both)
```

Components only ever reference semantic tokens (`--color-bg-accent`, `--type-body-md-size`, `--elevation-overlay`) — never a primitive or a hex value.

## Colors

### Orange theme
- **Brand** — orange ramp, anchored at `#FC6E20` (orange-500). White text on it is only 2.84:1, so the primary fill always carries **dark** text (`#1B1B1B`, 6.06:1). Hover lightens to orange-400 so the label gains contrast.
- **Accent subtle** — `#FFE7D0` (orange-100). It shares the brand's hue family, so it is a tint of the brand, not a neutral: secondary buttons, selected rows, soft highlights.
- **Neutral** — warm stone ramp (hue 66°), anchored to `#323232` and `#1B1B1B`, which are also the dark-mode surface and page.
- **States** — danger is crimson (not red, too close to orange), warning is golden yellow (not amber, same reason), success emerald, info azure.

### Navy theme
- **Brand** — navy ramp, anchored at `#1F2E4A` (navy-900). A fill, with white text (13.57:1). It is nearly the same darkness as body text (1.18:1 against `#343A40`), so links, focus rings and selection use brighter navy-700 / navy-600. Hover goes **lighter** (navy-800) because the brand already sits near the bottom of the ramp. In dark mode the fill becomes navy-300 with navy-950 text.
- **Neutral** — cool slate ramp (hue 248°), anchored to `#F8F9FA`, `#CED4DA`, `#343A40`.
- **States** — info is cyan (blue would read as brand), danger crimson, warning golden yellow, success emerald.

### Rules for both
- A fill (`bg.accent`, `bg.danger`, …) is always paired with its `text.on*` token. **Never hardcode white on an accent** — orange's on-accent is dark.
- Colored text on the page uses `text.*` roles, which are chosen per mode for contrast.
- Borders on interactive controls (`border.strong`, `border.focus`) meet 3:1; `border.subtle` and `border.default` are decorative and have no minimum.

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

Radius is one base (10px) times a ratio: xs ×0.25, sm ×0.5, md ×0.75, lg ×1, xl ×1.5, 2xl ×2, 3xl ×3. Controls use `radius.control`, cards `radius.card`, and pill-shaped controls use the dedicated `radius.pill` — an explicit choice, not incidental geometry. Spacing runs on a 4px grid: compact 8, tight 12, default 16, section 32.

## Do's and don'ts

- **Do** pick a type role by purpose, not by the size you want.
- **Do** test every component in all four combinations: orange/navy × light/dark.
- **Do** reserve shadow for things that are genuinely lifted.
- **Don't** hardcode a hex value, a pixel font size, or white text on an accent.
- **Don't** reuse a brand hue for a state color.

## Decision log

- **2026-09-26** — Purple (`minimal`) retired. Datum ships orange and navy as a set, selected by `data-theme`.
- **2026-09-26** — Tokens split into `base.json` (shared) and per-theme files (color + elevation only).
- **2026-09-26** — Type moved from an 8-step scale to 20 semantic roles (display, heading, body, paragraph, ui, numeric, code). Components renamed onto them with identical values.
- **2026-09-26** — Fonts kept: Barlow, Instrument Sans, IBM Plex Mono.
- **2026-09-26** — Orange's warning moved to golden yellow and danger to crimson; navy's info moved to cyan — each to keep states off the brand hue.
- **2026-09-26** — Subtle tints in the new themes come from ramp steps, not `color-mix()`, so the reference cream `#FFE7D0` can be used exactly.
- **2026-09-26** — Phase 1 of the component library is ~30 components for website building; the remaining ~30 are wave 2.
