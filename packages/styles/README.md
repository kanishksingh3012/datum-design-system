# @datum-design/styles

Design tokens and theme CSS for [Datum](https://github.com/kanishksingh3012/datum-design-system). Ships as plain CSS custom properties — no build step required at install time, no CSS-in-JS runtime.

## Install

```bash
npm install @datum-design/styles
```

## Usage

```ts
import "@datum-design/styles/themes.css";
```

```html
<html data-theme="orange"> <!-- or data-theme="navy" -->
```

Datum ships two themes as a set — **orange** (warm, high-energy) and **navy** (restrained, institutional). `themes.css` contains both; switch by changing `data-theme`. To ship only one, import `@datum-design/styles/orange.css` or `@datum-design/styles/navy.css` instead. Every token is a CSS custom property (`--color-bg-accent`, `--space-default`, `--type-body-md-size`, …) ready for any CSS to reference via `var(--token-name)`. Light and dark mode follow the page's `color-scheme` through CSS `light-dark()`.

## What's in it

- **171 tokens per theme**, identical names in both themes: color roles, 20 type roles, spacing, radius, elevation, and motion
- `base.json` — everything the themes share (fonts, type roles, spacing, radius, motion)
- `themes/orange.json`, `themes/navy.json` — color and elevation, mapped onto the primitive ramps
- `primitives.json` and `contract.json` are exported directly, so you can build another theme against the same contract

### Fill vs. text color tokens

`color.bg.accent`, `color.bg.danger`, `color.bg.warning`, `color.bg.success`, and `color.bg.info` are **fills**, always paired with their `color.text.on*` token — never with page text. The pairing differs by theme: orange's accent carries **dark** text (`#1B1B1B` on `#FC6E20`), navy's carries white in light mode and near-black in dark mode. Never hardcode white on an accent fill. For colored text on the page, use the `color.text.*` role instead (e.g. `color.text.accent`, `color.text.danger`), which is chosen for text-on-page contrast in both modes.

## License

MIT
