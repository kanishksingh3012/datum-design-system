# @datum-design/styles

Design tokens and theme CSS for [Datum](https://github.com/kanishksingh3012/datum-design-system). Ships as plain CSS custom properties — no build step required at install time, no CSS-in-JS runtime.

## Install

```bash
npm install @datum-design/styles
```

## Usage

```ts
import "@datum-design/styles/minimal.css";
```

That's it — this sets `--color-bg-accent`, `--space-default`, `--type-body-size`, and every other Datum token as a CSS custom property on `:root`, ready for any CSS (yours, or `@datum-design/react`'s) to reference via `var(--token-name)`.

## What's in it

- 71 tokens across color (8 families × 10 steps, with real light/dark via CSS `light-dark()`), typography, spacing, radius, elevation, and motion
- `primitives.json` and `contract.json` are also exported directly, if you want to build your own theme against the same contract Datum's own `minimal` theme implements

## License

MIT
