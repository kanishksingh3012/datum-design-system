# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: the author (Kanishk Singh), building products directly with Datum. Secondary, and an explicit goal: other developers who install Datum via npm into their own React projects, the way they'd adopt HeroUI or Minimals UI.

## Product Purpose

Datum is an open-source React component library and design system — a real, installable npm package (not just documentation or a static reference), giving developers accessible, token-driven components they can drop into their own products.

## Positioning

Accessibility-first, not native-only: native HTML elements where they're already fully stylable and keyboard/screen-reader behavior comes free (Button, Link, Checkbox, Radio, Textarea); custom-built DOM with correctly layered ARIA roles and keyboard handling where native elements cap visual control (Select, Slider, DatePicker, Switch, Combobox) — the same approach HeroUI/Radix/Base UI take via React Aria. Openly inspired by kernelui.com and HeroUI's structure and polish, not copied. A token cascade via CSS custom properties, and CSS Modules with `data-variant`/`data-size` attributes rather than class-variance-authority, applies across both approaches.

## Operating Context

Consumed as an npm package (`@datum-design/react` + `@datum-design/styles`) inside other developers' React apps, and directly inside the author's own products. Documented via a component-doc site (in progress) showing live examples, code, variants, and props per component — modeled on HeroUI's docs structure.

## Capabilities and Constraints

- npm workspaces monorepo: `packages/styles` (token pipeline — primitives → contract → theme → build.cjs → dist CSS), `packages/react` (components), and `apps/gallery` (an internal Vite dev app that renders every real component/variant for visual review — not a shipped product surface).
- CSS Modules with predictable, non-hashed class names (`datum-[Component]-[local]`) for override ergonomics.
- Variants/sizes/states exposed as `data-*` attributes, not compound BEM classes.
- Vitest + React Testing Library — every shipped component has real test coverage.
- lucide-react is the icon library.
- MIT licensed, hosted at github.com/kanishksingh3012/datum-design-system.

## Evidence on Hand

Real, shipped code: a single unified Button component (icon-only, toggle, and floating/FAB are modes of it via props, not separate components) plus Button Group and Link, which stay their own components since they're a genuinely different shape of problem. Also 12 AI-chat primitives and dozens more from the original Kernel-UI-parity pass. No customer testimonials, case studies, or usage metrics exist yet — none should be fabricated.

## Product Principles

1. Accessibility-first, not native-only — correct semantics and keyboard behavior are the bar, delivered via native elements or custom-built DOM depending on which actually achieves it.
2. Every visual/variant decision is backed by real, computed WCAG contrast math, not eyeballed.
3. Tokens are the single source of truth — no hardcoded colors or spacing in component CSS.
4. Inspired by, not copied from, kernelui.com and HeroUI.
5. Real code and real tests ship together — no component is "done" without both.

## Accessibility & Inclusion

WCAG AA is the working standard (contrast, touch targets, keyboard navigation, ARIA), verified via computed contrast math per color decision rather than visual approximation.
