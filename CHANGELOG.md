# Changelog

All notable changes to this project are recorded here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## 2026-09-07 — First real, installable package

### Added
- Real npm workspace monorepo: `packages/styles` (`@atlas-design/styles`) and `packages/react` (`@atlas-design/react`), modeled on kernelui.com's real, sourced implementation (Vite library mode, CSS Modules + hand-written `data-*` variants rather than `class-variance-authority`, Vitest + React Testing Library, a `render` prop for polymorphism rather than Radix-style `asChild`).
- `Button` converted end-to-end from spec to real code: props, TypeScript types, 7 passing tests, and a built `dist/` verified to work when imported from outside the source tree (not just "it compiles").

### Changed
- Relocated `design-system/tokens/` to `packages/styles/tokens/` via `git mv` (history preserved). Zero code changes — `build.cjs` is fully `__dirname`-relative — and the resulting `minimal.css` was diffed byte-for-byte against the pre-move version to confirm no regression.

### Decided
- npm workspaces over Bun, despite Bun matching the Kernel UI reference exactly and already being installed: this is a public repo, and npm ships with every Node install a future contributor already has.
- Tooltip stays a CSS-only `data-tooltip` attribute rather than becoming a full stateful component — no real need is driving that yet.
- Visual restyling per real design inspiration is deliberately a separate, later pass from the package/tooling work — the latter doesn't depend on what anything looks like.

### Added
- `README.md`, `LICENSE` (MIT), and this changelog.

## 2026-09-01 — Dialog, and pushing this to git for the first time

### Added
- **Dialog** component, built on the native `<dialog>` element and `.showModal()` rather than a hand-rolled focus trap. Verified (not assumed): focus moves in on open, stays trapped (`dialog.matches(':modal')`), does not close on backdrop click by default (the safe behavior for destructive confirmations), and restores focus to the trigger on close.
- Git repository initialized; pushed to `github.com/kanishksingh3012/atlas-design-system`.

## 2026-08-28 — Foundation completed, components started

### Added
- Grid system: breakpoints (matching Tailwind's values deliberately, since they're pure convention not a "look"), fluid `clamp()`-based gutter/margin/container tokens — no fixed column count, matching how Material's own layout model and shadcn both actually work.
- **18 components** built across five sections: Button, Icon Button, Tooltip (Actions); Text Field, Textarea, Select, Checkbox, Radio Group, Switch (Forms); Tabs (Navigation); Alert, Toast, Skeleton, Progress bar (Feedback); Badge, Avatar, Card (Display).
- Each component researched against Material Design 3, IBM Carbon, and Atlassian Design System's real published guidance before being built, not designed from memory.
- New tokens added on demand as real components surfaced real gaps: `color.border.danger`, `interaction.minTarget` (44px, WCAG 2.5.5), `color.bg.{danger,warning,success}Subtle` (Alert needed tinted backgrounds the strong button-oriented colors couldn't provide).
- A visual redesign of the Token Atlas dashboard itself: a two-page structure (Tokens / Components), real information architecture via section labels, and a light/dark/auto preview toggle independent of the dashboard's own (deliberately light-only) chrome.
- A full WCAG contrast audit of every color pairing in the system, computed with the real relative-luminance formula. Found and fixed two real regressions (`text.secondary` on `bg.surface`, and dark-mode `text.danger` — the "use step 400 for every color family" rule didn't hold uniformly, since WCAG weights red's luminance far lower than green's).

## 2026-08-26 — "Full throttle": comprehensive foundation, Geist as inspiration

### Added
- Full 8-color, 10-step color scale system, generated via a documented HSL method — not copied from Geist (whose real values aren't public), just structurally inspired by it.
- A real 8-role type scale (display through label), replacing the earlier 3-role placeholder.
- Radius rebuilt as a multiplier (`--radius-base` × N) rather than independent flat values, after research showed this is how shadcn's real token system does it.
- Switched from Helvetica Neue to Geist/Geist Mono — real, sourced, Google-Fonts-loadable, matching the actual named inspiration.
- An original icon construction system (20-unit canvas, 1.75-unit stroke, round-cap + miter-join) — deliberately distinct parameters from Lucide/Heroicons/Material, with 3 proof-of-concept glyphs (`chevron-right`, `check`, `x`).
- Light/dark mode support via native CSS `light-dark()` — 13 of 21 color tokens carry `[light, dark]` pairs; the other 8 (filled colored surfaces) don't need to change between modes at all.

## 2026-08-24 — First real tokens

### Added
- The core pipeline: `primitives.json` → `contract.json` → `themes/*.json` → `build.cjs`, with automatic validation (typo detection, missing-key detection).
- First theme (`minimal`), initially with placeholder values, to prove the architecture worked before any real design decisions were made.
- The Token Atlas dashboard — generated live from the real token files, published as a Claude Artifact, refreshed on every change rather than described in chat.
