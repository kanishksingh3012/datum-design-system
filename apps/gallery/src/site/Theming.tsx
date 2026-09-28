import { Alert, CodeBlock, Heading, Stack, Text } from "@datum-design/react";
import { DocTable } from "./DocTable";

const layers = `primitives.json      raw ramps (orange, stone, navy, slate, crimson, yellow, emerald, azure, cyan), sizes, weights, shadows
base.json            shared: fonts, 20 type roles, spacing, radius, icons, grid, motion
themes/orange.json   color + elevation for orange
themes/navy.json     color + elevation for navy
contract.json        175 required tokens: the build fails if a theme misses one
dist/*.css           orange.css, navy.css, themes.css (both)`;

const custom = `.promo {
  background: var(--color-bg-accent);
  color: var(--color-text-onAccent);   /* never hardcode white */
  border-radius: var(--radius-card);
  padding: var(--space-default);
}`;

export function Theming() {
  return (
    <Stack gap="lg" className="site-doc">
      <Stack gap="sm">
        <Text variant="overline" tone="secondary">Getting started</Text>
        <Heading level={1}>Theming</Heading>
        <Text as="p" variant="body-lg" tone="secondary">
          Two themes, orange (warm, high-energy) and navy (restrained, institutional), share one base and differ only in
          color and shadow tint. Try both with the switcher in the top bar.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Switching themes and modes</Heading>
        <Text as="p">
          <code>data-theme="orange"</code> or <code>data-theme="navy"</code> on <code>&lt;html&gt;</code> picks the theme.
          Light and dark follow <code>color-scheme</code> through CSS <code>light-dark()</code>, so the same tokens serve both modes.
        </Text>
        <CodeBlock code={`document.documentElement.dataset.theme = "navy";\ndocument.documentElement.style.colorScheme = "dark";`} language="ts" copyable />
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Token layers</Heading>
        <Text as="p">
          Components only reference semantic tokens (<code>--color-bg-accent</code>, <code>--type-body-md-size</code>,{" "}
          <code>--elevation-overlay</code>), never a primitive or a hex value. Both themes define the same 175 tokens.
        </Text>
        <CodeBlock code={layers} language="text" title="packages/styles/tokens" />
        <Text as="p">Your own CSS can use the same custom properties:</Text>
        <CodeBlock code={custom} language="css" copyable />
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Colors</Heading>
        <Text as="p">
          One accent per theme carries the whole emphasis ladder: solid fill, tint and text color. State colors are held
          well away from each brand hue so a status never reads as branding.
        </Text>
        <DocTable
          label="Color by theme"
          columns={["Role", "Orange", "Navy"]}
          rows={[
            ["Brand", "Orange ramp, anchored at #FC6E20", "Navy ramp; fill navy-700, lighter on hover"],
            ["Accent subtle", "Orange-100 tint: secondary buttons, selected rows", "Navy tint"],
            ["Neutral", "Warm stone ramp", "Cool slate ramp"],
            ["States", "Danger crimson, warning golden yellow, success emerald, info azure", "Info cyan; danger, warning, success as orange"],
            ["Ink", "bg.inverse from the stone ramp", "bg.inverse from the slate ramp"],
          ]}
        />
        <Alert intent="warning" title="Fills always pair with their on-color">
          bg.accent, bg.danger, bg.warning, bg.success and bg.info are fills. Put text on them with the matching
          text.on* token; its value is set per theme and mode for contrast. For colored text on the page, use the text.*
          roles (text.accent, text.danger), which are chosen for contrast against the page.
        </Alert>
        <Text as="p">
          Hierarchy comes from type roles and two text colors, text.primary and text.secondary, never a third gray. Borders on
          interactive controls (border.strong, border.focus) meet 3:1; border.subtle and border.default are decorative.
        </Text>
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Typography</Heading>
        <Text as="p">
          Three families shared by both themes: Barlow for display and headings, Instrument Sans for reading and interface,
          IBM Plex Mono for numbers and code. Twenty roles, picked by purpose rather than size; each defines family, size,
          weight, line height and tracking (e.g. <code>--type-heading-lg-size</code>).
        </Text>
        <DocTable
          label="Type roles"
          columns={["Role", "Steps", "Use"]}
          rows={[
            ["display", "lg 56 · md 48 · sm 40", "Hero statements, one per view"],
            ["heading", "xl 32 · lg 24 · md 20 · sm 18", "Page, section, subsection, card titles"],
            ["body", "lg 18 · md 16 · sm 14", "Interface running text"],
            ["paragraph", "lg 18 · md 16", "Long-form reading, line height 1.7"],
            ["ui", "label · caption · overline (12)", "Form labels, helper text, category markers"],
            ["numeric", "lg 32 · md 20 · sm 14", "Figures, prices, stats; tabular"],
            ["code", "md 14 · sm 12", "Inline and block code"],
          ]}
        />
      </Stack>

      <Stack gap="sm">
        <Heading level={2}>Shapes and space</Heading>
        <Text as="p">
          Datum is pill-first: nothing has a sharp corner. A checkbox is never round, and a tall or multi-line box is never
          a pill. A full-bleed band has square ends, because its corners are the viewport's.
        </Text>
        <DocTable
          label="Radius tokens"
          columns={["Token", "Value", "Use"]}
          rows={[
            ["radius.control", "999px (pill)", "Every single-line control: buttons, fields, selects, badges, tabs, menu items"],
            ["radius.card", "20px", "Anything that holds content or wraps: cards, alerts, menus, dialogs, textareas"],
            ["radius.subtle", "7.5px", "Small square elements: checkboxes, code chips"],
            ["radius.pill", "999px", "When something must be round regardless of role"],
          ]}
        />
        <Text as="p">
          Radius is one base (10px) times a ratio, so the system can be re-tuned from one value. Spacing runs on a 4px grid:
          compact 8, tight 12, default 16, section 32.
        </Text>
      </Stack>
    </Stack>
  );
}
