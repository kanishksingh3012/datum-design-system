# Atlas Design System

A personal design system built from first principles: a validated token pipeline, a growing set of accessible components, and — as of this pass — a real, installable React package. Meant to be the reusable foundation for future app projects, not tied to any one of them.

**Live reference:** [Token Atlas](https://claude.ai/code/artifact/578d3487-b6ad-44df-84c6-461bd61ba614) — generated directly from the files in this repo, republished every time something changes. What you see there is never hand-typed; if it's wrong, the source files are wrong, not the description of them.

## What's here

- **71 validated design tokens** — color (8 families, 10-step scales, real light/dark via CSS `light-dark()`), typography (8 semantic roles), spacing, a proportional radius scale, an original icon construction system, a fluid grid, elevation, and motion.
- **19 documented component contracts** (`design-system/components/README.md`), each researched against Material Design 3, IBM Carbon, and Atlassian's real published guidance, WCAG-contrast-verified, and specified as `Problem / API / States / Tokens used / Accessibility`. Most still exist as static HTML/CSS reference demos in the Token Atlas dashboard.
- **`@atlas-design/react`** — a real npm workspace package, built with Vite library mode, tested with Vitest + React Testing Library. `Button` is the first component actually converted from spec to real, installable code (props, types, tests, a built `dist/` that's been verified to work when imported externally) — every other component follows the same pattern next.
- **One theme so far** (`minimal`), inspired by — not copied from — Vercel's Geist. More theme packs (bold/colorful, dark-first/technical, warm/editorial) are designed for structurally but not built yet.

## Structure

```
packages/
  styles/                     # @atlas-design/styles - the token pipeline, packaged
    tokens/
      primitives.json          # raw values: color scales, spacing, type scale, etc.
      contract.json            # the semantic names every theme must resolve
      themes/minimal.json      # the values behind those names, for this theme
      build.cjs                 # resolves + validates + compiles to CSS (unchanged, dependency-free)
      dist/                     # generated CSS output (tracked in git - no build step at publish time)
      dashboard/                 # generates the live Token Atlas preview
      icons/                     # original icon construction spec + SVGs
  react/                       # @atlas-design/react - real, installable React components
    src/
      components/Button/        # Button.tsx + Button.module.css + Button.test.tsx
      index.ts                   # public exports
design-system/
  components/
    README.md                  # the authoritative contract for every component (spec, not code)
```

## Architecture, briefly

Tokens flow through four layers: **primitives** (raw values) → a **contract** (the semantic names a theme must implement, e.g. `color.bg.accent`) → a **theme** (real values behind those names) → a build script that resolves references, validates completeness, and compiles to CSS custom properties. Nothing is themeable by accident and nothing can silently go missing — `build.cjs` fails loudly if a theme is incomplete or contains an unknown key.

Components follow a pattern researched directly from a real production library (kernelui.com): CSS Modules for styling (not Tailwind or CSS-in-JS), hand-written `data-variant`/`data-size`/etc. attributes for variants (not `class-variance-authority`), and a `render` prop for polymorphism (e.g. rendering as an anchor instead of a button) rather than Radix-style `asChild` slot magic.

## Running it locally

```bash
npm install                 # once, at the repo root - resolves both workspace packages
npm run build:styles        # rebuilds packages/styles/tokens/dist/minimal.css + the dashboard
npm run build:react         # builds @atlas-design/react to packages/react/dist/
npm test                    # runs @atlas-design/react's test suite
```

## Status

Foundation layer is comprehensive. The real npm package has just started — `Button` is converted and verified end-to-end (built, tested, and confirmed working when imported from the built output, not just the source). The remaining 18 components follow the same pattern next, roughly in order of increasing interaction complexity, with Dialog last since its native focus-trap behavior needs the most care to preserve. Visual restyling per real design inspiration is a separate, later pass — it only touches each component's CSS Module, not the package structure.

## License

[MIT](./LICENSE)
