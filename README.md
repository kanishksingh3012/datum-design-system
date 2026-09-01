# Atlas Design System

A personal design system built from first principles: a validated token pipeline and a growing set of accessible, framework-agnostic reference components — meant to be the reusable foundation for future app projects, not tied to any one of them.

**Live reference:** [Token Atlas](https://claude.ai/code/artifact/578d3487-b6ad-44df-84c6-461bd61ba614) — generated directly from the files in this repo, republished every time something changes. What you see there is never hand-typed; if it's wrong, the source files are wrong, not the description of them.

## What's here

- **71 validated design tokens** — color (8 families, 10-step scales, real light/dark via CSS `light-dark()`), typography (8 semantic roles), spacing, a proportional radius scale, an original icon construction system, a fluid grid, elevation, and motion.
- **19 components**, framework-agnostic (real semantic HTML/CSS, no framework dependency), across six sections: Actions, Forms, Navigation, Overlays, Feedback, Display. Each one is researched against Material Design 3, IBM Carbon, and Atlassian's real published guidance, WCAG-contrast-verified, and documented with a `Problem / API / States / Tokens used / Accessibility` contract.
- **One theme so far** (`minimal`), inspired by — not copied from — Vercel's Geist. More theme packs (bold/colorful, dark-first/technical, warm/editorial) are designed for structurally but not built yet.

## Structure

```
design-system/
  tokens/
    primitives.json       # raw values: color scales, spacing, type scale, etc.
    contract.json          # the semantic names every theme must resolve
    themes/minimal.json    # the values behind those names, for this theme
    build.cjs               # resolves + validates + compiles to CSS
    dist/                   # generated output (do not hand-edit)
    dashboard/               # generates the live Token Atlas preview
    icons/                   # original icon construction spec + SVGs
  components/
    README.md               # full contract for every component
```

## Architecture, briefly

Tokens flow through four layers: **primitives** (raw values) → a **contract** (the semantic names a theme must implement, e.g. `color.bg.accent`) → a **theme** (real values behind those names) → a build script that resolves references, validates completeness, and compiles to CSS custom properties. Nothing is themeable by accident and nothing can silently go missing — `build.cjs` fails loudly if a theme is incomplete or contains an unknown key (catches typos before they become dead code).

Components are still framework-agnostic on purpose. No React/Vue/etc. binding exists yet — that's a real decision for whoever is actually driving the project to make deliberately, not something to lock in while building the token layer.

## Running it locally

```bash
cd design-system/tokens
node build.cjs
```

Rebuilds `dist/minimal.css` and regenerates the dashboard from the current token files. No dependencies to install — everything here is dependency-free Node.

## Status

Foundation layer is comprehensive. Component set is growing (19 so far, prioritized by how reusable each one is — Button and Card before anything niche). Not yet started: additional theme packs, a real component-library binding (React or otherwise), and a formal layout-grid decision beyond the fluid breakpoint system already in place.

## License

[MIT](./LICENSE)
