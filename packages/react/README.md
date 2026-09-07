# @datum-design/react

React components for [Datum](https://github.com/kanishksingh3012/datum-design-system), a personal design system. Every component is built on the real, matching HTML element wherever one exists (`<dialog>`, `<details>`, `<table>`) instead of an ARIA-role `<div>`, and tested with Vitest + React Testing Library.

## Install

```bash
npm install @datum-design/react @datum-design/styles
```

`react` and `react-dom` (>=18) are peer dependencies — install them if your project doesn't already have them.

## Usage

```tsx
import { Button } from "@datum-design/react";
import "@datum-design/react/styles.css";
import "@datum-design/styles/minimal.css";

function App() {
  return <Button variant="primary">Get started</Button>;
}
```

`@datum-design/styles/minimal.css` provides the design tokens (colors, spacing, type scale) as CSS custom properties; `@datum-design/react/styles.css` provides the components' own styles, which reference those tokens.

## What's included

61 components covering primitives (Button, Badge, Avatar…), forms (TextField, Select, Combobox, DatePicker…), overlays (Dialog, Sheet, Popover, CommandPalette…), data display (Table, DataTable, Carousel…), and a set of AI-chat primitives (Message, ToolCall, Reasoning, CodeBlock…) for building conversational UI.

See the [repository README](https://github.com/kanishksingh3012/datum-design-system) for the full component list and architecture.

## License

MIT
