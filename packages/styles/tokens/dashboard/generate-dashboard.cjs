#!/usr/bin/env node
// Generates dashboard.html from the SAME files build.cjs already validated — contract.json,
// primitives.json, themes/*.json, dist/*.css. Never re-derives values independently, so there
// is no code path where the dashboard can show something dist/*.css doesn't actually contain.
// Deliberately does not require("../build.cjs") — build.cjs calls *this* file, so requiring
// it back would re-run the whole build. Small helpers below are duplicated on purpose.

const fs = require("fs");
const path = require("path");

const TOKENS_DIR = path.join(__dirname, "..");
const THEMES_DIR = path.join(TOKENS_DIR, "themes");
const DIST_DIR = path.join(TOKENS_DIR, "dist");
const OUT_FILE = path.join(__dirname, "dashboard.html");

function dottedToVarName(dotted) {
  return `--${dotted.split(".").join("-")}`;
}

function byPrefix(contract, prefix) {
  return contract.filter((k) => k.startsWith(`${prefix}.`));
}

function lastSegment(dotted) {
  return dotted.split(".").pop();
}

function parseCssVars(cssText) {
  const vars = {};
  for (const rawLine of cssText.split("\n")) {
    const line = rawLine.trim();
    const match = line.match(/^(--[\w-]+):\s*(.+);$/);
    if (match) vars[match[1]] = match[2];
  }
  return vars;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function loadThemes() {
  return fs
    .readdirSync(THEMES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const name = path.basename(f, ".json");
      const raw = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, f), "utf8"));
      return { name, meta: raw._meta || {} };
    })
    .sort((a, b) => (a.name === "minimal" ? -1 : b.name === "minimal" ? 1 : a.name.localeCompare(b.name)));
}

function loadDistCss() {
  if (!fs.existsSync(DIST_DIR)) return {};
  const out = {};
  for (const f of fs.readdirSync(DIST_DIR).filter((f) => f.endsWith(".css"))) {
    out[path.basename(f, ".css")] = fs.readFileSync(path.join(DIST_DIR, f), "utf8");
  }
  return out;
}

function buildGoogleFontsLink(themes) {
  const families = new Set();
  for (const t of themes) {
    for (const f of t.meta.googleFonts || []) families.add(f);
  }
  if (families.size === 0) return "";
  const query = [...families].map((f) => `family=${f}`).join("&");
  return `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?${query}&display=swap" rel="stylesheet">`;
}

function renderColorGroup(title, keys) {
  const rows = keys
    .map((k) => {
      const varName = dottedToVarName(k);
      const label = lastSegment(k);
      return `
        <div class="swatch">
          <span class="swatch__color" style="background:var(${varName})"></span>
          <span class="swatch__label">${escapeHtml(label)}</span>
          <code class="swatch__var">${varName}</code>
          <span class="swatch__value" data-var="${varName}">...</span>
        </div>`;
    })
    .join("");
  return `
    <div class="card">
      <h3>${escapeHtml(title)}</h3>
      <div class="swatch-grid">${rows}</div>
    </div>`;
}

function renderTypography(fontKeys) {
  const blocks = fontKeys
    .map((k) => {
      const varName = dottedToVarName(k);
      const label = lastSegment(k);
      const sampleTag = label === "display" ? "p" : "p";
      const sampleSize = label === "display" ? "28px" : "15px";
      const sampleText = label === "display" ? "Morning pages" : "The quick brown fox jumps over the lazy dog.";
      return `
        <div class="type-block">
          <span class="type-block__label">${escapeHtml(label)}</span>
          <${sampleTag} class="type-block__sample" style="font-family:var(${varName});font-size:${sampleSize}">${escapeHtml(
        sampleText
      )}</${sampleTag}>
          <code class="swatch__var">${varName}</code>
          <span class="swatch__value" data-var="${varName}">...</span>
        </div>`;
    })
    .join("");
  return `<div class="card">${blocks}</div>`;
}

function renderSpacing(primitives, spaceKeys) {
  const scaleRows = Object.entries(primitives.spacing || {})
    .map(([key, value]) => {
      const px = parseFloat(value) || 0;
      const width = Math.min(px * 3, 220);
      return `
        <div class="scale-row">
          <span class="scale-row__label">spacing.${escapeHtml(key)}</span>
          <span class="scale-row__bar" style="width:${width}px"></span>
          <span class="scale-row__value">${escapeHtml(value)}</span>
        </div>`;
    })
    .join("");

  const semanticRows = spaceKeys
    .map((k) => {
      const varName = dottedToVarName(k);
      const label = lastSegment(k);
      return `
        <div class="kv-row">
          <code>${varName}</code>
          <span class="kv-row__label">${escapeHtml(label)}</span>
          <span class="swatch__value" data-var="${varName}">...</span>
        </div>`;
    })
    .join("");

  return `
    <div class="card">
      <h3>Spacing</h3>
      <p class="card__sub">Scale (theme-independent)</p>
      <div class="scale-list">${scaleRows}</div>
      <p class="card__sub">Semantic (active theme)</p>
      <div class="kv-list">${semanticRows}</div>
    </div>`;
}

function renderRadius(primitives, radiusKeys) {
  const scaleRows = Object.entries(primitives.radius || {})
    .map(([key, value]) => {
      return `
        <div class="radius-item">
          <span class="radius-item__box" style="border-radius:${escapeHtml(value)}"></span>
          <span class="radius-item__label">radius.${escapeHtml(key)} - ${escapeHtml(value)}</span>
        </div>`;
    })
    .join("");

  const semanticRows = radiusKeys
    .map((k) => {
      const varName = dottedToVarName(k);
      const label = lastSegment(k);
      return `
        <div class="radius-item">
          <span class="radius-item__box" style="border-radius:var(${varName})"></span>
          <span class="radius-item__label">${escapeHtml(label)} - <span data-var="${varName}">...</span></span>
        </div>`;
    })
    .join("");

  return `
    <div class="card">
      <h3>Radius</h3>
      <p class="card__sub">Scale (theme-independent)</p>
      <div class="radius-list">${scaleRows}</div>
      <p class="card__sub">Semantic (active theme)</p>
      <div class="radius-list">${semanticRows}</div>
    </div>`;
}

function renderColorScale(primitives) {
  const steps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
  const rows = Object.keys(primitives.color || {})
    .map((fam) => {
      const scale = primitives.color[fam];
      const chips = steps
        .filter((s) => scale[s] !== undefined)
        .map(
          (s) =>
            `<span class="color-scale__chip" style="background:${escapeHtml(scale[s])}" title="${escapeHtml(fam)}.${s} - ${escapeHtml(
              scale[s]
            )}"></span>`
        )
        .join("");
      return `
        <div class="color-scale__row">
          <span class="color-scale__label">${escapeHtml(fam)}</span>
          <div class="color-scale__strip">${chips}</div>
        </div>`;
    })
    .join("");
  return `
    <div class="card">
      <h3>Color scale</h3>
      <p class="card__sub">Primitives (theme-independent, 10-step)</p>
      <div class="color-scale-list">${rows}</div>
    </div>`;
}

function loadIcons() {
  const dir = path.join(TOKENS_DIR, "icons");
  if (!fs.existsSync(dir)) return {};
  const out = {};
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".svg"))) {
    const raw = fs.readFileSync(path.join(dir, f), "utf8").trim();
    out[path.basename(f, ".svg")] = raw.replace("<svg ", '<svg width="100%" height="100%" ');
  }
  return out;
}

function renderIcons(primitives, iconKeys, icons) {
  const names = Object.keys(icons);

  const scaleRows = Object.entries(primitives.icon || {})
    .map(([key, value]) => {
      const glyphs = names
        .map(
          (name) =>
            `<span class="icon-glyph" style="width:${escapeHtml(value)};height:${escapeHtml(value)}" title="${escapeHtml(
              name
            )}">${icons[name]}</span>`
        )
        .join("");
      return `
        <div class="icon-row">
          <span class="icon-row__label">icon.${escapeHtml(key)} - ${escapeHtml(value)}</span>
          <div class="icon-row__glyphs">${glyphs}</div>
        </div>`;
    })
    .join("");

  const semanticRows = iconKeys
    .map((k) => {
      const varName = dottedToVarName(k);
      const label = lastSegment(k);
      const glyphs = names
        .map(
          (name) =>
            `<span class="icon-glyph" style="width:var(${varName});height:var(${varName})" title="${escapeHtml(
              name
            )}">${icons[name]}</span>`
        )
        .join("");
      return `
        <div class="icon-row">
          <span class="icon-row__label">${escapeHtml(label)} - <span data-var="${varName}">...</span></span>
          <div class="icon-row__glyphs">${glyphs}</div>
        </div>`;
    })
    .join("");

  return `
    <div class="card">
      <h3>Icons</h3>
      <p class="card__sub">Scale (theme-independent)</p>
      <div class="icon-list">${scaleRows}</div>
      <p class="card__sub">Semantic (active theme)</p>
      <div class="icon-list">${semanticRows}</div>
    </div>`;
}

function renderGrid(primitives, gridKeys) {
  const breakpointChips = Object.entries(primitives.breakpoint || {})
    .map(([key, value]) => {
      const px = parseFloat(value) || 0;
      return `<span class="bp-chip" data-bp-min="${px}">${escapeHtml(key)}<br>${escapeHtml(value)}</span>`;
    })
    .join("");

  const semanticRows = gridKeys
    .map((k) => {
      const varName = dottedToVarName(k);
      const label = lastSegment(k);
      return `
        <div class="kv-row">
          <code>${varName}</code>
          <span class="kv-row__label">${escapeHtml(label)}</span>
          <span class="swatch__value" data-var="${varName}">...</span>
        </div>`;
    })
    .join("");

  return `
    <div class="card">
      <h3>Grid</h3>
      <p class="card__sub">Breakpoints (structural, non-themeable - your viewport is highlighted)</p>
      <div class="bp-list" id="bp-list">${breakpointChips}</div>
      <p class="card__sub">Semantic (active theme)</p>
      <div class="kv-list">${semanticRows}</div>
    </div>`;
}

function renderElevation(elevationKeys) {
  const rows = elevationKeys
    .map((k) => {
      const varName = dottedToVarName(k);
      const label = lastSegment(k);
      return `
        <div class="elevation-item">
          <span class="elevation-item__box" style="box-shadow:var(${varName})"></span>
          <span class="elevation-item__label">${escapeHtml(label)}</span>
          <code class="swatch__var">${varName}</code>
          <span class="swatch__value" data-var="${varName}">...</span>
        </div>`;
    })
    .join("");
  return `<div class="card"><h3>Elevation</h3><div class="elevation-list">${rows}</div></div>`;
}

function renderMotion(motionKeys) {
  const rows = motionKeys
    .map((k) => {
      const varName = dottedToVarName(k);
      const label = lastSegment(k);
      return `
        <div class="kv-row">
          <code>${varName}</code>
          <span class="kv-row__label">${escapeHtml(label)}</span>
          <span class="swatch__value" data-var="${varName}">...</span>
        </div>`;
    })
    .join("");
  return `
    <div class="card">
      <h3>Motion</h3>
      <div class="kv-list">${rows}</div>
      <p class="card__sub">Hover to feel it</p>
      <span class="motion-demo"></span>
    </div>`;
}

function renderTypeScale(typeKeys) {
  const roles = {};
  for (const k of typeKeys) {
    const parts = k.split(".");
    const role = parts[1];
    const prop = parts[2];
    if (!roles[role]) roles[role] = {};
    roles[role][prop] = dottedToVarName(k);
  }
  const sampleText = {
    display: "Morning pages",
    h1: "Track every streak",
    h2: "Weekly reflection",
    h3: "Today's entry",
    body: "The quick brown fox jumps over the lazy dog.",
    bodySmall: "Synced 2 minutes ago.",
    caption: "10 min - day 12 streak",
    label: "STATUS"
  };
  const blocks = Object.entries(roles)
    .map(([role, vars]) => {
      const style = `font-size:var(${vars.size});font-weight:var(${vars.weight});line-height:var(${vars.lineHeight})`;
      return `
        <div class="type-block">
          <span class="type-block__label">${escapeHtml(role)}</span>
          <p class="type-block__sample" style="${style}">${escapeHtml(sampleText[role] || role)}</p>
          <div class="type-block__meta">
            <span>size <span data-var="${vars.size}">...</span></span>
            <span>weight <span data-var="${vars.weight}">...</span></span>
            <span>line-height <span data-var="${vars.lineHeight}">...</span></span>
          </div>
        </div>`;
    })
    .join("");
  return `<div class="card">${blocks}</div>`;
}

function renderCatchAll(catchAllKeys) {
  if (catchAllKeys.length === 0) return "";
  const rows = catchAllKeys
    .map((k) => {
      const varName = dottedToVarName(k);
      return `
        <div class="kv-row">
          <code>${varName}</code>
          <span class="swatch__value" data-var="${varName}">...</span>
        </div>`;
    })
    .join("");
  return `<div class="card"><h3>Other tokens</h3><div class="kv-list">${rows}</div></div>`;
}

function renderComponentDoc({ name, purpose, variants, states, tokens, a11y }) {
  return `
    <div class="c-doc">
      <h3>${escapeHtml(name)}</h3>
      <p class="c-doc__purpose">${escapeHtml(purpose)}</p>
      <dl class="c-doc__list">
        <dt>Variants</dt><dd>${escapeHtml(variants)}</dd>
        <dt>States</dt><dd>${escapeHtml(states)}</dd>
        <dt>Tokens used</dt><dd>${escapeHtml(tokens)}</dd>
        <dt>Accessibility</dt><dd>${escapeHtml(a11y)}</dd>
      </dl>
    </div>`;
}

function renderComponentsPage(icons) {
  const check = icons.check || "";

  const buttonDemo = `
    <div class="c-demo">
      <div class="c-demo__row">
        <button class="btn btn--primary">Primary</button>
        <button class="btn btn--secondary">Secondary</button>
        <button class="btn btn--ghost">Ghost</button>
        <button class="btn btn--danger">Danger</button>
      </div>
      <div class="c-demo__row">
        <button class="btn btn--primary btn--sm">Small</button>
        <button class="btn btn--secondary" disabled>Disabled</button>
        <button class="btn btn--primary" aria-busy="true" disabled>
          <span class="btn__spinner" aria-hidden="true"></span> Loading
        </button>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Button",
      purpose: "The primary way to trigger an action. One filled (primary/danger) button per view region - everything else outline or ghost.",
      variants: "primary, secondary (outlined), ghost, danger - each at default (44px, meets the 2.5.5 touch-target minimum) or small (36px, dense contexts only)",
      states: "default, hover, focus-visible (visible outline via border.focus), active/pressed, disabled, loading",
      tokens: "color.bg.accent/danger, color.text.onAccent/onDanger, color.border.strong/focus, radius.control, space.default, motion.fast, interaction.minTarget",
      a11y: "Real <button> element - keyboard and screen reader support come free. Loading state sets aria-busy and disables the control so it can't be double-activated."
    })}`;

  const iconButtonDemo = `
    <div class="c-demo">
      <div class="c-demo__row">
        <button class="icon-btn" aria-label="Close" data-tooltip="Close">${icons.x || ""}</button>
        <button class="icon-btn" aria-label="Confirm" data-tooltip="Confirm">${check}</button>
        <button class="icon-btn" aria-label="Next" data-tooltip="Next" disabled>${icons["chevron-right"] || ""}</button>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Icon button",
      purpose: "A button whose only content is a glyph - always requires an accessible name since there's no visible label.",
      variants: "ghost only for now (matches Button's ghost treatment)",
      states: "default, hover, focus-visible, disabled",
      tokens: "icon.control (the glyph), interaction.minTarget (the hit area - deliberately larger than the 24px glyph itself), radius.control",
      a11y: "aria-label is mandatory, not optional - there is no text fallback. Hit area is 44px even though the glyph is 24px, exactly the gap WCAG 2.5.5 exists for. Hover/focus this button to see the Tooltip component below in action."
    })}`;

  const tooltipDemo = `
    <div class="c-demo">
      <div class="c-demo__row">
        <p class="c-demo__hint">Hover or focus the icon buttons above - each one carries a real data-tooltip.</p>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Tooltip",
      purpose: "A short label that appears on hover or keyboard focus, for sighted users who can't tell what an icon-only control does just by looking at it.",
      variants: "single style, positioned above the trigger",
      states: "hidden, visible (on hover or focus-visible)",
      tokens: "color.text.primary (as the chip's background, inverted), color.bg.page (as the chip's text), radius primitive, type.caption, motion.fast",
      a11y: "CSS-generated content (the attr() tooltip text) is not reliably read by screen readers - this is a real, known limitation of the pure-CSS approach, not an oversight. That's exactly why every icon button already carries aria-label independently: the tooltip is a visual convenience for sighted mouse/keyboard users, the aria-label is what actually makes the control accessible. Neither one substitutes for the other."
    })}`;

  const textFieldDemo = `
    <div class="c-demo">
      <div class="c-demo__row c-demo__row--stack">
        <div class="field">
          <label class="field__label" for="demo-email">Email</label>
          <input class="field__input" type="email" id="demo-email" placeholder="you@example.com" />
          <span class="field__help">We'll only use this to send your receipt.</span>
        </div>
        <div class="field field--error">
          <label class="field__label" for="demo-email-err">Email</label>
          <input class="field__input" type="email" id="demo-email-err" value="not-an-email" aria-invalid="true" aria-describedby="demo-email-err-msg" />
          <span class="field__help" id="demo-email-err-msg">Enter a valid email address.</span>
        </div>
        <div class="field">
          <label class="field__label" for="demo-email-dis">Email</label>
          <input class="field__input" type="email" id="demo-email-dis" value="locked@example.com" disabled />
        </div>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Text field",
      purpose: "A labeled single-line input. Label sits statically above the field, never as a placeholder substitute - placeholders disappear on input and can't serve as the field's name.",
      variants: "single line shown here; textarea follows the same label/help/error structure",
      states: "default, hover, focus-visible, error, disabled",
      tokens: "color.border.default/strong/focus/danger, color.bg.page, radius.control, interaction.minTarget, type.label, type.body, type.caption",
      a11y: "Real <label for> association. Error state sets aria-invalid and aria-describedby pointing at the message, so a screen reader announces the problem, not just a red border."
    })}`;

  const checkboxDemo = `
    <div class="c-demo">
      <div class="c-demo__row c-demo__row--stack">
        <label class="checkbox">
          <input type="checkbox" />
          <span class="checkbox__box">${check}</span>
          <span class="checkbox__label">Unchecked</span>
        </label>
        <label class="checkbox">
          <input type="checkbox" checked />
          <span class="checkbox__box">${check}</span>
          <span class="checkbox__label">Checked</span>
        </label>
        <label class="checkbox">
          <input type="checkbox" disabled />
          <span class="checkbox__box">${check}</span>
          <span class="checkbox__label">Disabled</span>
        </label>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Checkbox",
      purpose: "Binary or multi-select choice in a list or form.",
      variants: "single checkbox shown; indeterminate (partial-selection) state uses the same box with a dash glyph, added when a tri-state parent control exists",
      states: "unchecked, checked, focus-visible, disabled",
      tokens: "color.bg.accent (checked fill), color.border.strong (unchecked outline), color.border.focus, radius primitive (half of radius.base)",
      a11y: "Real <input type=checkbox>, visually hidden (clip technique, not display:none) so it stays in the accessibility tree and keyboard-operable. Visual box is 18px but the clickable label area is padded to meet the touch-target minimum - matches how Material and Atlassian both handle the same visual/touch-size gap."
    })}`;

  const textareaDemo = `
    <div class="c-demo">
      <div class="c-demo__row c-demo__row--stack">
        <div class="field">
          <label class="field__label" for="demo-notes">Notes</label>
          <textarea class="field__input field__input--textarea" id="demo-notes" placeholder="Add any details..."></textarea>
          <span class="field__help">Optional - visible to your team only.</span>
        </div>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Textarea",
      purpose: "Multi-line text input - same label/help/error structure as Text field, just taller and resizable.",
      variants: "single surface, resizes vertically only",
      states: "default, hover, focus-visible, error, disabled (identical to Text field)",
      tokens: "same as Text field: color.border.default/strong/focus/danger, color.bg.page, radius.control, type.label/body/caption",
      a11y: "Same <label for> requirement as Text field. resize:vertical only, so it can't grow wider than its container and break layout."
    })}`;

  const radioDemo = `
    <div class="c-demo">
      <div class="c-demo__row c-demo__row--stack">
        <label class="radio">
          <input type="radio" name="demo-plan" value="basic" checked />
          <span class="radio__circle"></span>
          <span class="checkbox__label">Basic</span>
        </label>
        <label class="radio">
          <input type="radio" name="demo-plan" value="pro" />
          <span class="radio__circle"></span>
          <span class="checkbox__label">Pro</span>
        </label>
        <label class="radio">
          <input type="radio" name="demo-plan" value="team" disabled />
          <span class="radio__circle"></span>
          <span class="checkbox__label">Team (disabled)</span>
        </label>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Radio group",
      purpose: "Single choice from a small set of mutually exclusive options - real radio inputs sharing one name group natively.",
      variants: "single group shown; same pattern for any option count",
      states: "unselected, selected, focus-visible, disabled",
      tokens: "color.bg.accent (selected fill), color.border.strong (unselected outline), color.border.focus",
      a11y: "Native radio grouping via a shared name attribute - arrow-key navigation between options is free browser behavior, not something we had to build. Same visually-hidden-input technique as Checkbox."
    })}`;

  const switchDemo = `
    <div class="c-demo">
      <div class="c-demo__row c-demo__row--stack">
        <label class="switch">
          <input type="checkbox" role="switch" />
          <span class="switch__track"><span class="switch__thumb"></span></span>
          <span class="checkbox__label">Off</span>
        </label>
        <label class="switch">
          <input type="checkbox" role="switch" checked />
          <span class="switch__track"><span class="switch__thumb"></span></span>
          <span class="checkbox__label">On</span>
        </label>
        <label class="switch">
          <input type="checkbox" role="switch" disabled />
          <span class="switch__track"><span class="switch__thumb"></span></span>
          <span class="checkbox__label">Disabled</span>
        </label>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Switch",
      purpose: "An immediate on/off action (a setting that applies right away) - distinct from Checkbox, which implies a choice batched until a form is submitted.",
      variants: "single track/thumb design",
      states: "off, on, focus-visible, disabled",
      tokens: "color.bg.accent (on-state track), color.border.strong (off-state track), color.border.focus, motion.normal (thumb slide)",
      a11y: "role=switch on the underlying input tells assistive tech this is a toggle, announced as on/off rather than checked/unchecked."
    })}`;

  const badgeDemo = `
    <div class="c-demo">
      <div class="c-demo__row">
        <span class="badge-c badge-c--neutral">Draft</span>
        <span class="badge-c badge-c--accent">New</span>
        <span class="badge-c badge-c--success">Active</span>
        <span class="badge-c badge-c--warning">Pending</span>
        <span class="badge-c badge-c--danger">Failed</span>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Badge",
      purpose: "A small, non-interactive status or count label riding on other content - never clickable itself (that's what Tag/Chip is for, not built yet).",
      variants: "neutral, accent, success, warning, danger",
      states: "static only - no hover/focus/disabled, since it's not interactive",
      tokens: "color.bg.{accent,success,warning,danger}, color.text.on*, type.label",
      a11y: "Plain <span>. If a badge conveys meaning through color alone (e.g. a status dot), the label text must say the status in words too - color can't be the only signal."
    })}`;

  const cardDemo = `
    <div class="c-demo">
      <div class="c-demo__row c-demo__row--cards">
        <div class="card-c">
          <p class="card-c__title">Flat (default)</p>
          <p class="card-c__body">Border-only, no shadow - the default per Carbon and Atlassian's own guidance: flat surfaces unless the card is meant to feel liftable.</p>
        </div>
        <div class="card-c card-c--elevated">
          <p class="card-c__title">Elevated</p>
          <p class="card-c__body">Shadow instead of border, reserved for cards that are draggable or need to visually float above the page.</p>
        </div>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Card",
      purpose: "A bounded content container. Default is flat (border, no shadow) - shadow is an opt-in variant, not the default, based on cross-referencing Carbon and Atlassian's real guidance.",
      variants: "flat (default), elevated",
      states: "static container - interactive states apply to whatever's inside it (a button, a link), not the card itself",
      tokens: "color.bg.surface, color.border.default, radius.card, elevation.raised (elevated variant only), space.section",
      a11y: "Semantic content only - no ARIA role by default, since a generic container has no special semantics. A clickable card (not shown here) would need a real focusable element inside it, not an onclick on the div."
    })}`;

  const dialogDemo = `
    <div class="c-demo">
      <div class="c-demo__row">
        <button class="btn btn--secondary" id="demo-dialog-trigger">Open dialog</button>
      </div>
    </div>
    <dialog class="dialog-c" id="demo-dialog" data-trigger="demo-dialog-trigger" aria-labelledby="demo-dialog-title">
      <form method="dialog" class="dialog-c__form">
        <h2 class="dialog-c__title" id="demo-dialog-title">Delete this item?</h2>
        <p class="dialog-c__body">This can't be undone. The item will be permanently removed.</p>
        <div class="dialog-c__actions">
          <button class="btn btn--secondary" value="cancel">Cancel</button>
          <button class="btn btn--danger" value="delete">Delete</button>
        </div>
      </form>
    </dialog>
    ${renderComponentDoc({
      name: "Dialog",
      purpose: "A focused, blocking overlay for a decision or a self-contained task - deliberately built last and carefully, since a broken focus trap is a real accessibility failure, not a cosmetic one.",
      variants: "single style shown (a confirm dialog); the same structure works for any modal content",
      states: "closed, open",
      tokens: "color.bg.surface, radius.card, elevation.overlay, space.section, type.h3/body",
      a11y: "Built on the native <dialog> element with .showModal() rather than a hand-rolled focus trap - the browser already implements focus trapping, Escape-to-close, and background inertness correctly, which is a smaller and more foolproof surface than reimplementing that logic in JS. Focus is explicitly saved before opening and restored to the trigger button on close (verified, not assumed). Does not close on backdrop click by default - accidental dismissal of a destructive confirmation is worse than requiring an explicit Cancel or Escape, so the safe behavior is the default rather than something bolted on for just the dangerous cases."
    })}`;

  const selectDemo = `
    <div class="c-demo">
      <div class="c-demo__row c-demo__row--stack">
        <div class="field">
          <label class="field__label" for="demo-country">Country</label>
          <div class="select-wrap">
            <select class="field__input select-c" id="demo-country">
              <option>United States</option>
              <option>India</option>
              <option>Germany</option>
            </select>
            <span class="select-c__chevron" aria-hidden="true">${icons["chevron-right"] || ""}</span>
          </div>
        </div>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Select",
      purpose: "Choosing one option from a longer list where showing every option as radio buttons would take too much space.",
      variants: "single style; error/disabled follow the same .field wrapper pattern as Text field",
      states: "default, hover, focus-visible, disabled",
      tokens: "same field tokens as Text field, plus icon.inline rotated 90deg as the chevron (reused, not a new glyph)",
      a11y: "Native <select> - full keyboard support (type-ahead, arrow keys, Escape) comes from the browser for free, which is exactly why this isn't a custom-built listbox. The chevron is aria-hidden since the native control already conveys its own affordance."
    })}`;

  const avatarDemo = `
    <div class="c-demo">
      <div class="c-demo__row">
        <span class="avatar-c">JD</span>
        <span class="avatar-c avatar-c--sm">A</span>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Avatar",
      purpose: "A person or entity's visual identifier - initials shown here as the fallback; a real instance would use a photo with initials as the loading/error fallback.",
      variants: "default (40px), small (28px)",
      states: "static display",
      tokens: "color.bg.accent, color.text.onAccent, type.label",
      a11y: "When used as an <img>, alt text should be the person's name, not generic text like 'avatar' or 'profile picture' - a screen reader user needs to know whose photo it is."
    })}`;

  const tabsDemo = `
    <div class="c-demo">
      <div class="c-demo__row">
        <div class="tabs-c" role="tablist" aria-label="Demo tabs">
          <button class="tabs-c__tab is-active" role="tab" aria-selected="true">Overview</button>
          <button class="tabs-c__tab" role="tab" aria-selected="false">Activity</button>
          <button class="tabs-c__tab" role="tab" aria-selected="false" disabled>Settings</button>
        </div>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Tabs",
      purpose: "Switching between views that occupy the same space - the dashboard you're looking at right now uses this exact pattern for its own Tokens/Components switcher.",
      variants: "underline style only",
      states: "inactive, active, focus-visible, disabled",
      tokens: "color.bg.accent (active underline), color.text.primary/secondary, color.border.default, color.border.focus, interaction.minTarget",
      a11y: "role=tablist/tab/aria-selected are wired in this demo; full roving-tabindex arrow-key navigation (ARIA APG's tab pattern) isn't implemented here since that needs real per-instance JS in an actual app, not a static reference page - flagged as a real gap, not silently skipped."
    })}`;

  const alertDemo = `
    <div class="c-demo">
      <div class="c-demo__row c-demo__row--stack">
        <div class="alert-c alert-c--danger" role="alert">
          <p class="alert-c__title">Payment failed</p>
          <p class="alert-c__body">Your card was declined. Try another payment method.</p>
        </div>
        <div class="alert-c alert-c--warning" role="status">
          <p class="alert-c__title">Storage almost full</p>
          <p class="alert-c__body">You're using 92% of your available space.</p>
        </div>
        <div class="alert-c alert-c--success" role="status">
          <p class="alert-c__title">Changes saved</p>
        </div>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Alert",
      purpose: "A page or section-level message about status or an error - persistent until dismissed or resolved, unlike a transient Toast, which disappears on its own.",
      variants: "danger, warning, success",
      states: "static - no hover/focus, it's not interactive itself",
      tokens: "color.bg.dangerSubtle/warningSubtle/successSubtle (new this round - the strong bg.danger/warning/success tokens were too loud for a persistent message box), color.text.danger/warning/success",
      a11y: "role=alert (danger) interrupts and announces immediately - reserve for things that need urgent attention. role=status (warning, success) announces politely without interrupting whatever the screen reader is already doing. No status icon yet - the icon set only has chevron/check/x so far, not alert-triangle or similar; text carries the meaning alone for now, which still passes 1.4.1 since color isn't the only signal."
    })}`;

  const toastDemo = `
    <div class="c-demo">
      <div class="c-demo__row">
        <div class="toast-c" role="status">
          <span class="toast-c__text">Message sent</span>
          <button class="toast-c__dismiss" aria-label="Dismiss">${icons.x || ""}</button>
        </div>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Toast",
      purpose: "A brief, transient confirmation that appears after an action and disappears on its own - shown here as a static sample since a real one auto-dismissing after a few seconds would just look broken on a reference page.",
      variants: "single style - severity is rarely needed for a toast, that's what Alert is for",
      states: "visible, dismissing (not animated in this static demo)",
      tokens: "color.text.primary (inverted as the chip background), color.bg.page (as the chip's text color), elevation.overlay, radius.control, type.bodySmall",
      a11y: "role=status, not role=alert - a toast confirms something that already happened, it doesn't need to interrupt. In a real app it should auto-dismiss after several seconds AND stay manually dismissible for anyone who reads slower than the timeout assumes - never rely on the timer alone."
    })}`;

  const skeletonDemo = `
    <div class="c-demo">
      <div class="c-demo__row c-demo__row--stack">
        <div class="skeleton-c skeleton-c--avatar"></div>
        <div class="skeleton-c skeleton-c--text" style="width:70%"></div>
        <div class="skeleton-c skeleton-c--text" style="width:45%"></div>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Skeleton",
      purpose: "A placeholder shown while real content is still loading, in roughly the shape of what's coming - reduces the jarring layout shift of content popping in.",
      variants: "text (a line), avatar (a circle) - shown here; any shape follows the same pulsing-block pattern",
      states: "loading only - it's removed once real content arrives, it has no other state",
      tokens: "color.bg.surface, radius.control",
      a11y: "Purely decorative - no ARIA role needed on the skeleton itself, but the region containing it should be marked aria-busy=true while loading so assistive tech knows content is still arriving. Animation respects prefers-reduced-motion (pulses via opacity only, nothing that moves)."
    })}`;

  const progressDemo = `
    <div class="c-demo">
      <div class="c-demo__row c-demo__row--stack">
        <div class="progress-c" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" aria-label="Upload progress">
          <div class="progress-c__fill" style="width:65%"></div>
        </div>
      </div>
    </div>
    ${renderComponentDoc({
      name: "Progress bar",
      purpose: "Shows how far a determinate operation (upload, multi-step setup) has gotten - not for open-ended waits with no known duration, which want a spinner instead.",
      variants: "determinate (shown) - indeterminate would need a different, continuously-animating fill and isn't built yet",
      states: "0-100%, driven by aria-valuenow",
      tokens: "color.bg.surface (track), color.bg.accent (fill), motion.normal (fill transition when the value changes)",
      a11y: "role=progressbar with aria-valuenow/min/max is what makes the percentage announced to assistive tech - the visual bar alone communicates nothing to a screen reader without it."
    })}`;

  return `
    <p class="header__desc components-intro">Framework-agnostic reference implementations - real semantic HTML and CSS, driven entirely by the tokens on the Tokens page. No framework decision has been made yet; these are the ground truth a future React/Radix (or any other) implementation would need to match.</p>

    <h2 class="section-label section-label--first">Actions</h2>
    <div class="c-grid">${buttonDemo}</div>
    <div class="c-grid">${iconButtonDemo}</div>
    <div class="c-grid">${tooltipDemo}</div>

    <h2 class="section-label">Forms</h2>
    <div class="c-grid">${textFieldDemo}</div>
    <div class="c-grid">${textareaDemo}</div>
    <div class="c-grid">${selectDemo}</div>
    <div class="c-grid">${checkboxDemo}</div>
    <div class="c-grid">${radioDemo}</div>
    <div class="c-grid">${switchDemo}</div>

    <h2 class="section-label">Navigation</h2>
    <div class="c-grid">${tabsDemo}</div>

    <h2 class="section-label">Overlays</h2>
    <div class="c-grid">${dialogDemo}</div>

    <h2 class="section-label">Feedback</h2>
    <div class="c-grid">${alertDemo}</div>
    <div class="c-grid">${toastDemo}</div>
    <div class="c-grid">${skeletonDemo}</div>
    <div class="c-grid">${progressDemo}</div>

    <h2 class="section-label">Display</h2>
    <div class="c-grid">${badgeDemo}</div>
    <div class="c-grid">${avatarDemo}</div>
    <div class="c-grid">${cardDemo}</div>
  `;
}

function renderPage({ themes, distCss, contract, primitives, icons }) {
  const built = new Set(Object.keys(distCss));
  const embeddedCss = Object.values(distCss).join("\n");
  const googleFonts = buildGoogleFontsLink(themes);

  const colorBg = byPrefix(contract, "color.bg");
  const colorText = byPrefix(contract, "color.text");
  const colorBorder = byPrefix(contract, "color.border");
  const fontKeys = byPrefix(contract, "font");
  const spaceKeys = byPrefix(contract, "space");
  const radiusKeys = byPrefix(contract, "radius");
  const iconKeys = byPrefix(contract, "icon");
  const gridKeys = byPrefix(contract, "grid");
  const elevationKeys = byPrefix(contract, "elevation");
  const motionKeys = byPrefix(contract, "motion");
  const typeKeys = byPrefix(contract, "type");
  const KNOWN_PREFIXES = ["color.", "font.", "space.", "radius.", "icon.", "grid.", "elevation.", "motion.", "type."];
  const catchAll = contract.filter((k) => !KNOWN_PREFIXES.some((p) => k.startsWith(p)));

  const tabs = themes
    .map(
      (t, i) => `
      <button class="tab${i === 0 ? " is-active" : ""}" data-theme="${t.name}" data-built="${built.has(t.name)}">
        ${escapeHtml(t.meta.label || t.name)}
      </button>`
    )
    .join("");

  const generatedAt = new Date().toISOString();

  return `<title>Token atlas</title>
${googleFonts}
<style>${embeddedCss}</style>
<style>
  :root{
    color-scheme: light;
    --dash-bg:#FBFBF9; --dash-surface:#FFFFFF; --dash-border:#E7E4DD;
    --dash-text:#1C1B19; --dash-text-muted:#6E6B63; --dash-accent:#4A5573;
    --dash-good:#3B6D11; --dash-good-bg:#EAF3DE; --dash-bad:#A32D2D; --dash-bad-bg:#FCEBEB;
    --dash-shadow: 0 1px 2px rgba(20,20,18,.05), 0 1px 1px rgba(20,20,18,.03);
  }
  *{ box-sizing:border-box; }
  body{ background:var(--dash-bg); color:var(--dash-text); font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; -webkit-font-smoothing:antialiased; }
  .wrap{ max-width:1080px; margin:0 auto; padding:2.5rem 1.5rem 5rem; }
  header{ display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem; margin-bottom:2rem; padding-bottom:1.8rem; border-bottom:1px solid var(--dash-border); }
  .eyebrow{ font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.09em; color:var(--dash-accent); margin:0 0 .5rem; }
  h1{ font-size:28px; font-weight:600; letter-spacing:-.015em; margin:0 0 .6rem; }
  .header__desc{ font-size:13.5px; line-height:1.6; color:var(--dash-text-muted); max-width:46ch; margin:0; }
  .timestamp{ font-size:11px; color:var(--dash-text-muted); font-variant-numeric:tabular-nums; white-space:nowrap; }
  .controls-row{ display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:.8rem; margin-bottom:1.4rem; }
  .page-switcher{ display:flex; gap:1.6rem; margin-bottom:2rem; border-bottom:1px solid var(--dash-border); }
  .page-switcher__btn{ font:inherit; font-size:14px; font-weight:500; padding:0 0 .8rem; background:none; border:none; border-bottom:2px solid transparent; color:var(--dash-text-muted); cursor:pointer; margin-bottom:-1px; }
  .page-switcher__btn.is-active{ color:var(--dash-text); font-weight:600; border-bottom-color:var(--dash-accent); }
  .tabs{ display:flex; gap:.5rem; flex-wrap:wrap; }
  .tab{ font:inherit; font-size:13px; font-weight:500; padding:.5rem 1rem; border-radius:999px; border:1px solid var(--dash-border); background:var(--dash-surface); color:var(--dash-text-muted); cursor:pointer; }
  .tab.is-active{ background:var(--dash-accent); border-color:var(--dash-accent); color:#FFFFFF; }
  .badge{ display:inline-flex; align-items:center; gap:.4rem; font-size:12.5px; font-weight:600; padding:.35rem .75rem; border-radius:999px; margin-bottom:1.6rem; }
  .badge.is-good{ background:var(--dash-good-bg); color:var(--dash-good); }
  .badge.is-bad{ background:var(--dash-bad-bg); color:var(--dash-bad); }
  .missing-list{ font-size:12px; color:var(--dash-bad); margin:0 0 1.4rem; }
  .notice{ font-size:13px; color:var(--dash-text-muted); background:var(--dash-surface); border:1px dashed var(--dash-border); border-radius:10px; padding:1rem; }
  .section-label{ font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:var(--dash-text-muted); margin:2.4rem 0 1rem; padding-top:1.8rem; border-top:1px solid var(--dash-border); }
  .section-label--first{ margin-top:0; padding-top:0; border-top:0; }
  .grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:1.2rem; margin-bottom:1.2rem; }
  .card{ background:var(--dash-surface); border:1px solid var(--dash-border); border-radius:14px; padding:1.25rem 1.35rem; box-shadow:var(--dash-shadow); }
  .card h3{ font-size:13px; font-weight:600; letter-spacing:-.005em; margin:0 0 .9rem; }
  .card__sub{ font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--dash-text-muted); margin:.9rem 0 .5rem; }
  .swatch-grid{ display:flex; flex-direction:column; gap:.6rem; }
  .swatch{ display:grid; grid-template-columns:20px auto 1fr auto; align-items:center; gap:.5rem; font-size:12px; }
  .swatch__color{ width:20px; height:20px; border-radius:5px; border:1px solid var(--dash-border); }
  .swatch__label{ color:var(--dash-text); }
  .swatch__var{ color:var(--dash-text-muted); font-size:11px; }
  .swatch__value{ color:var(--dash-text-muted); font-size:11px; font-variant-numeric:tabular-nums; text-align:right; }
  .type-block{ display:flex; flex-direction:column; gap:.35rem; padding:.6rem 0; border-bottom:1px solid var(--dash-border); }
  .type-block:last-child{ border-bottom:0; }
  .type-block__label{ font-size:11px; text-transform:uppercase; letter-spacing:.06em; color:var(--dash-text-muted); }
  .type-block__sample{ margin:0; color:var(--dash-text); }
  .scale-list{ display:flex; flex-direction:column; gap:.4rem; }
  .scale-row{ display:grid; grid-template-columns:90px 1fr 50px; align-items:center; gap:.5rem; font-size:11px; color:var(--dash-text-muted); }
  .scale-row__bar{ height:8px; background:var(--dash-accent); border-radius:3px; }
  .kv-list{ display:flex; flex-direction:column; gap:.4rem; }
  .kv-row{ display:flex; justify-content:space-between; gap:.5rem; font-size:12px; }
  .kv-row code{ color:var(--dash-text-muted); }
  .radius-list{ display:flex; flex-wrap:wrap; gap:1rem; }
  .radius-item{ display:flex; flex-direction:column; align-items:center; gap:.4rem; font-size:10.5px; color:var(--dash-text-muted); width:100px; }
  .radius-item__box{ width:48px; height:48px; background:var(--dash-accent); }
  .icon-list{ display:flex; flex-direction:column; gap:.6rem; }
  .icon-row{ display:flex; align-items:center; gap:.9rem; font-size:11px; color:var(--dash-text-muted); }
  .icon-row__label{ width:150px; flex:0 0 auto; }
  .icon-row__glyphs{ display:flex; gap:.7rem; }
  .icon-glyph{ display:inline-flex; color:var(--dash-text); }
  .bp-list{ display:flex; gap:.5rem; flex-wrap:wrap; }
  .bp-chip{ font-size:10.5px; text-align:center; line-height:1.4; color:var(--dash-text-muted); border:1px solid var(--dash-border); border-radius:8px; padding:.4rem .6rem; }
  .bp-chip.is-active{ border-color:var(--dash-accent); color:var(--dash-text); background:var(--dash-good-bg); }
  .components-placeholder{ margin-top:1.4rem; font-size:12.5px; color:var(--dash-text-muted); border-top:1px solid var(--dash-border); padding-top:1.2rem; }
  .elevation-list{ display:flex; gap:1.6rem; flex-wrap:wrap; }
  .elevation-item{ display:flex; flex-direction:column; align-items:center; gap:.5rem; font-size:11px; color:var(--dash-text-muted); }
  .elevation-item__box{ width:64px; height:64px; border-radius:10px; background:var(--dash-surface); }
  .motion-demo{ display:block; width:28px; height:28px; margin-top:.7rem; border-radius:8px; background:var(--dash-accent); transition:transform var(--motion-normal, 200ms) var(--motion-easing, ease); }
  .motion-demo:hover{ transform:translateX(48px); }
  .type-block__meta{ display:flex; gap:.9rem; font-size:11px; color:var(--dash-text-muted); font-variant-numeric:tabular-nums; }
  .color-scale-list{ display:flex; flex-direction:column; gap:.55rem; }
  .color-scale__row{ display:grid; grid-template-columns:70px 1fr; align-items:center; gap:.6rem; }
  .color-scale__label{ font-size:11px; color:var(--dash-text-muted); text-transform:capitalize; }
  .color-scale__strip{ display:flex; gap:3px; }
  .color-scale__chip{ width:24px; height:24px; border-radius:4px; border:1px solid var(--dash-border); flex:0 0 auto; }
  .mode-toggle{ display:flex; gap:.3rem; }
  .mode-toggle button{ font:inherit; font-size:12px; padding:.35rem .7rem; border-radius:999px; border:1px solid var(--dash-border); background:var(--dash-surface); color:var(--dash-text-muted); cursor:pointer; }
  .mode-toggle button.is-active{ background:var(--dash-text); border-color:var(--dash-text); color:var(--dash-bg); }

  .components-intro{ max-width:64ch; margin-bottom:1.6rem; }
  .c-grid{ display:grid; grid-template-columns:1fr 1fr; gap:1.4rem; margin-bottom:1.4rem; align-items:start; }
  @media (max-width: 720px){ .c-grid{ grid-template-columns:1fr; } }
  .c-demo{ background:var(--color-bg-page,var(--dash-bg)); border:1px solid var(--dash-border); border-radius:14px; padding:1.5rem; display:flex; flex-direction:column; gap:1rem; }
  .c-demo__row{ display:flex; flex-wrap:wrap; align-items:center; gap:.75rem; }
  .c-demo__row--stack{ flex-direction:column; align-items:flex-start; gap:1rem; width:100%; }
  .c-demo__row--cards{ align-items:stretch; }
  .c-doc{ background:var(--dash-surface); border:1px solid var(--dash-border); border-radius:14px; padding:1.25rem 1.35rem; box-shadow:var(--dash-shadow); }
  .c-doc h3{ font-size:13px; font-weight:600; margin:0 0 .5rem; color:var(--dash-text); }
  .c-doc__purpose{ font-size:12.5px; line-height:1.55; color:var(--dash-text-muted); margin:0 0 .9rem; }
  .c-doc__list{ margin:0; display:flex; flex-direction:column; gap:.55rem; }
  .c-doc__list dt{ font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.06em; color:var(--dash-text-muted); margin:0; }
  .c-doc__list dd{ font-size:12px; line-height:1.5; color:var(--dash-text); margin:.15rem 0 0; }

  /* --- component reference implementations: styled entirely from design-system tokens, not dashboard chrome --- */
  .btn{ display:inline-flex; align-items:center; justify-content:center; gap:.5rem; font-family:var(--font-body); font-weight:500; font-size:var(--type-body-size); border-radius:var(--radius-control); border:1px solid transparent; cursor:pointer; min-height:var(--interaction-minTarget); padding:0 var(--space-default); transition:filter var(--motion-fast) var(--motion-easing), background var(--motion-fast) var(--motion-easing), transform var(--motion-fast) var(--motion-easing); }
  .btn:focus-visible{ outline:2px solid var(--color-border-focus); outline-offset:2px; }
  .btn:active:not(:disabled){ transform:scale(.98); }
  .btn:disabled{ opacity:.5; cursor:not-allowed; }
  .btn--sm{ min-height:36px; padding:0 var(--space-compact); font-size:var(--type-caption-size); }
  .btn--primary{ background:var(--color-bg-accent); color:var(--color-text-onAccent); }
  .btn--primary:hover:not(:disabled){ filter:brightness(0.92); }
  .btn--secondary{ background:transparent; border-color:var(--color-border-strong); color:var(--color-text-primary); }
  .btn--secondary:hover:not(:disabled){ background:var(--color-bg-surface); }
  .btn--ghost{ background:transparent; color:var(--color-text-primary); }
  .btn--ghost:hover:not(:disabled){ background:var(--color-bg-surface); }
  .btn--danger{ background:var(--color-bg-danger); color:var(--color-text-onDanger); }
  .btn--danger:hover:not(:disabled){ filter:brightness(0.92); }
  .btn__spinner{ width:14px; height:14px; border-radius:50%; border:2px solid currentColor; border-top-color:transparent; display:inline-block; animation:btn-spin var(--motion-slow) linear infinite; }
  @keyframes btn-spin{ to{ transform:rotate(360deg); } }
  @media (prefers-reduced-motion: reduce){ .btn__spinner{ animation-duration:1.4s; } }

  .icon-btn{ display:inline-flex; align-items:center; justify-content:center; width:var(--interaction-minTarget); height:var(--interaction-minTarget); border-radius:var(--radius-control); border:1px solid transparent; background:transparent; color:var(--color-text-primary); cursor:pointer; transition:background var(--motion-fast) var(--motion-easing); }
  .icon-btn svg{ width:var(--icon-control); height:var(--icon-control); }
  .icon-btn:hover:not(:disabled){ background:var(--color-bg-surface); }
  .icon-btn:focus-visible{ outline:2px solid var(--color-border-focus); outline-offset:2px; }
  .icon-btn:disabled{ opacity:.5; cursor:not-allowed; }

  .field{ display:flex; flex-direction:column; gap:.4rem; max-width:280px; width:100%; }
  .field__label{ font-size:var(--type-label-size); font-weight:var(--type-label-weight); color:var(--color-text-primary); }
  .field__input{ font-family:var(--font-body); font-size:var(--type-body-size); color:var(--color-text-primary); background:var(--color-bg-page); border:1px solid var(--color-border-default); border-radius:var(--radius-control); padding:0 var(--space-default); min-height:var(--interaction-minTarget); transition:border-color var(--motion-fast) var(--motion-easing); }
  .field__input::placeholder{ color:var(--color-text-disabled); }
  .field__input:hover:not(:disabled){ border-color:var(--color-border-strong); }
  .field__input:focus-visible{ outline:2px solid var(--color-border-focus); outline-offset:1px; border-color:var(--color-border-focus); }
  .field__input:disabled{ opacity:.5; cursor:not-allowed; }
  .field__help{ font-size:var(--type-caption-size); color:var(--color-text-secondary); }
  .field--error .field__input{ border-color:var(--color-border-danger); }
  .field--error .field__help{ color:var(--color-text-danger); }

  .checkbox{ position:relative; display:inline-flex; align-items:center; gap:.6rem; cursor:pointer; min-height:var(--interaction-minTarget); }
  .checkbox input{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  .checkbox__box{ width:18px; height:18px; flex:0 0 auto; border-radius:calc(var(--radius-base) * 0.5); border:1.5px solid var(--color-border-strong); background:var(--color-bg-page); display:inline-flex; align-items:center; justify-content:center; transition:background var(--motion-fast) var(--motion-easing), border-color var(--motion-fast) var(--motion-easing); }
  .checkbox__box svg{ width:13px; height:13px; color:var(--color-text-onAccent); opacity:0; transition:opacity var(--motion-fast) var(--motion-easing); }
  .checkbox input:checked ~ .checkbox__box{ background:var(--color-bg-accent); border-color:var(--color-bg-accent); }
  .checkbox input:checked ~ .checkbox__box svg{ opacity:1; }
  .checkbox input:focus-visible ~ .checkbox__box{ outline:2px solid var(--color-border-focus); outline-offset:2px; }
  .checkbox input:disabled ~ .checkbox__box{ opacity:.5; }
  .checkbox__label{ font-size:var(--type-body-size); color:var(--color-text-primary); }

  .field__input--textarea{ min-height:96px; padding:var(--space-compact) var(--space-default); resize:vertical; font-family:var(--font-body); font-size:var(--type-body-size); color:var(--color-text-primary); }

  .radio{ position:relative; display:inline-flex; align-items:center; gap:.6rem; cursor:pointer; min-height:var(--interaction-minTarget); }
  .radio input{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  .radio__circle{ width:18px; height:18px; flex:0 0 auto; border-radius:50%; border:1.5px solid var(--color-border-strong); background:var(--color-bg-page); position:relative; transition:border-color var(--motion-fast) var(--motion-easing); }
  .radio__circle::after{ content:""; position:absolute; inset:4px; border-radius:50%; background:var(--color-bg-accent); opacity:0; transition:opacity var(--motion-fast) var(--motion-easing); }
  .radio input:checked ~ .radio__circle{ border-color:var(--color-bg-accent); }
  .radio input:checked ~ .radio__circle::after{ opacity:1; }
  .radio input:focus-visible ~ .radio__circle{ outline:2px solid var(--color-border-focus); outline-offset:2px; }
  .radio input:disabled ~ .radio__circle{ opacity:.5; }

  .switch{ position:relative; display:inline-flex; align-items:center; gap:.6rem; cursor:pointer; min-height:var(--interaction-minTarget); }
  .switch input{ position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
  .switch__track{ width:38px; height:22px; flex:0 0 auto; border-radius:999px; background:var(--color-border-strong); position:relative; transition:background var(--motion-fast) var(--motion-easing); display:inline-block; }
  .switch__thumb{ position:absolute; top:2px; left:2px; width:18px; height:18px; border-radius:50%; background:var(--color-bg-page); transition:transform var(--motion-normal) var(--motion-easing); }
  .switch input:checked ~ .switch__track{ background:var(--color-bg-accent); }
  .switch input:checked ~ .switch__track .switch__thumb{ transform:translateX(16px); }
  .switch input:focus-visible ~ .switch__track{ outline:2px solid var(--color-border-focus); outline-offset:2px; }
  .switch input:disabled ~ .switch__track{ opacity:.5; }

  .select-wrap{ position:relative; }
  .select-c{ appearance:none; -webkit-appearance:none; width:100%; padding-right:calc(var(--space-default) + 20px); cursor:pointer; }
  .select-c:disabled{ cursor:not-allowed; }
  .select-c__chevron{ position:absolute; right:var(--space-default); top:50%; transform:translateY(-50%) rotate(90deg); width:12px; height:12px; color:var(--color-text-secondary); pointer-events:none; }
  .select-c__chevron svg{ width:100%; height:100%; }

  .avatar-c{ display:inline-flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:var(--color-bg-accent); color:var(--color-text-onAccent); font-family:var(--font-body); font-size:var(--type-label-size); font-weight:var(--type-label-weight); flex:0 0 auto; object-fit:cover; }
  .avatar-c--sm{ width:28px; height:28px; font-size:10px; }

  .tabs-c{ display:flex; gap:1.6rem; border-bottom:1px solid var(--color-border-default); }
  .tabs-c__tab{ font-family:var(--font-body); font-size:var(--type-body-size); font-weight:500; padding:0 0 var(--space-compact); background:none; border:none; border-bottom:2px solid transparent; color:var(--color-text-secondary); cursor:pointer; margin-bottom:-1px; min-height:var(--interaction-minTarget); transition:color var(--motion-fast) var(--motion-easing), border-color var(--motion-fast) var(--motion-easing); }
  .tabs-c__tab.is-active{ color:var(--color-text-primary); border-bottom-color:var(--color-bg-accent); font-weight:600; }
  .tabs-c__tab:focus-visible{ outline:2px solid var(--color-border-focus); outline-offset:2px; }
  .tabs-c__tab:disabled{ opacity:.5; cursor:not-allowed; }

  .alert-c{ display:flex; flex-direction:column; gap:.3rem; padding:var(--space-default); border-radius:0; border-left:3px solid; }
  .alert-c--danger{ background:var(--color-bg-dangerSubtle); border-left-color:var(--color-border-danger); }
  .alert-c--warning{ background:var(--color-bg-warningSubtle); border-left-color:var(--color-text-warning); }
  .alert-c--success{ background:var(--color-bg-successSubtle); border-left-color:var(--color-text-success); }
  .alert-c__title{ font-size:var(--type-body-size); font-weight:600; color:var(--color-text-primary); margin:0; }
  .alert-c__body{ font-size:var(--type-bodySmall-size); margin:0; color:var(--color-text-secondary); }

  .c-demo__hint{ font-size:12.5px; color:var(--dash-text-muted); margin:0; }

  [data-tooltip]{ position:relative; }
  [data-tooltip]::after{ content:attr(data-tooltip); position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%) translateY(4px); background:var(--color-text-primary); color:var(--color-bg-page); font-size:var(--type-caption-size); font-weight:500; padding:.3rem .6rem; border-radius:calc(var(--radius-base) * 0.5); white-space:nowrap; pointer-events:none; opacity:0; transition:opacity var(--motion-fast) var(--motion-easing), transform var(--motion-fast) var(--motion-easing); z-index:10; }
  [data-tooltip]:hover::after, [data-tooltip]:focus-visible::after{ opacity:1; transform:translateX(-50%) translateY(0); }
  @media (prefers-reduced-motion: reduce){ [data-tooltip]::after{ transition:none; } }

  .toast-c{ display:inline-flex; align-items:center; gap:.75rem; background:var(--color-text-primary); color:var(--color-bg-page); padding:.7rem 1rem; border-radius:var(--radius-control); box-shadow:var(--elevation-overlay); font-size:var(--type-bodySmall-size); }
  .toast-c__dismiss{ background:none; border:none; color:inherit; opacity:.7; cursor:pointer; display:inline-flex; padding:0; }
  .toast-c__dismiss svg{ width:14px; height:14px; }
  .toast-c__dismiss:hover{ opacity:1; }

  .skeleton-c{ background:var(--color-bg-surface); border-radius:var(--radius-control); animation:skeleton-pulse 1.6s ease-in-out infinite; }
  .skeleton-c--text{ height:14px; }
  .skeleton-c--avatar{ width:40px; height:40px; border-radius:50%; }
  @keyframes skeleton-pulse{ 0%,100%{ opacity:1; } 50%{ opacity:.45; } }
  @media (prefers-reduced-motion: reduce){ .skeleton-c{ animation-duration:3.2s; } }

  .progress-c{ height:8px; width:100%; background:var(--color-bg-surface); border-radius:999px; overflow:hidden; }
  .progress-c__fill{ height:100%; background:var(--color-bg-accent); border-radius:999px; transition:width var(--motion-normal) var(--motion-easing); }

  .dialog-c{ border:none; padding:0; background:transparent; max-width:min(420px, calc(100vw - 2 * var(--space-default))); }
  .dialog-c::backdrop{ background:rgba(0,0,0,.45); }
  .dialog-c__form{ background:var(--color-bg-surface); border-radius:var(--radius-card); padding:var(--space-section); display:flex; flex-direction:column; gap:.75rem; box-shadow:var(--elevation-overlay); margin:0; }
  .dialog-c__title{ font-size:var(--type-h3-size); font-weight:var(--type-h3-weight); line-height:var(--type-h3-lineHeight); color:var(--color-text-primary); margin:0; }
  .dialog-c__body{ font-size:var(--type-body-size); color:var(--color-text-secondary); line-height:var(--type-body-lineHeight); margin:0; }
  .dialog-c__actions{ display:flex; justify-content:flex-end; gap:.6rem; margin-top:.5rem; }

  .badge-c{ display:inline-flex; align-items:center; gap:.3rem; font-size:var(--type-label-size); font-weight:var(--type-label-weight); padding:.15rem .55rem; border-radius:999px; line-height:1.5; }
  .badge-c--neutral{ background:var(--color-bg-surface); color:var(--color-text-secondary); }
  .badge-c--accent{ background:var(--color-bg-accent); color:var(--color-text-onAccent); }
  .badge-c--danger{ background:var(--color-bg-danger); color:var(--color-text-onDanger); }
  .badge-c--warning{ background:var(--color-bg-warning); color:var(--color-text-onWarning); }
  .badge-c--success{ background:var(--color-bg-success); color:var(--color-text-onSuccess); }

  .card-c{ background:var(--color-bg-surface); border:1px solid var(--color-border-default); border-radius:var(--radius-card); padding:var(--space-section); flex:1; }
  .card-c--elevated{ border:none; box-shadow:var(--elevation-raised); }
  .card-c__title{ font-size:var(--type-h3-size); font-weight:var(--type-h3-weight); line-height:var(--type-h3-lineHeight); color:var(--color-text-primary); margin:0 0 .5rem; }
  .card-c__body{ font-size:var(--type-body-size); color:var(--color-text-secondary); line-height:var(--type-body-lineHeight); margin:0; }
</style>

<div class="wrap">
  <header>
    <div>
      <p class="eyebrow">Design system</p>
      <h1>Token atlas</h1>
      <p class="header__desc">Live, generated reference for every token and component in the system - regenerated from the real files, never hand-typed.</p>
    </div>
    <span class="timestamp">generated ${generatedAt}</span>
  </header>

  <div class="controls-row">
    <div class="tabs" role="tablist">${tabs}</div>
    <div class="mode-toggle" role="group" aria-label="Preview color mode">
      <button data-mode="light dark">Auto</button>
      <button data-mode="light">Light</button>
      <button data-mode="dark">Dark</button>
    </div>
  </div>

  <div class="page-switcher" role="tablist" aria-label="Section">
    <button class="page-switcher__btn is-active" data-page="tokens">Tokens</button>
    <button class="page-switcher__btn" data-page="components">Components</button>
  </div>

  <div id="notice" class="notice" hidden></div>

  <div id="page-tokens">
    <div id="preview">
      <div id="coverage-badge" class="badge"></div>
      <ul id="missing-list" class="missing-list" hidden></ul>

      <h2 class="section-label section-label--first">Color</h2>
      <div class="grid">
        ${renderColorScale(primitives)}
      </div>
      <div class="grid">
        ${renderColorGroup("Background", colorBg)}
        ${renderColorGroup("Text", colorText)}
        ${renderColorGroup("Border", colorBorder)}
      </div>

      <h2 class="section-label">Typography</h2>
      <div class="grid">
        ${renderTypography(fontKeys)}
      </div>
      <div class="grid">
        ${renderTypeScale(typeKeys)}
      </div>

      <h2 class="section-label">Layout</h2>
      <div class="grid">
        ${renderSpacing(primitives, spaceKeys)}
        ${renderRadius(primitives, radiusKeys)}
        ${renderGrid(primitives, gridKeys)}
      </div>

      <h2 class="section-label">Icons</h2>
      <div class="grid">
        ${renderIcons(primitives, iconKeys, icons)}
      </div>

      <h2 class="section-label">Depth &amp; motion</h2>
      <div class="grid">
        ${renderElevation(elevationKeys)}
        ${renderMotion(motionKeys)}
      </div>

      <h2 class="section-label">Other tokens</h2>
      <div class="grid">
        ${renderCatchAll(catchAll)}
      </div>
    </div>
  </div>

  <div id="page-components" hidden>
    ${renderComponentsPage(icons)}
  </div>
</div>

<script>
(function(){
  var CONTRACT = ${JSON.stringify(contract)};

  var pageButtons = Array.prototype.slice.call(document.querySelectorAll(".page-switcher__btn"));
  var pages = { tokens: document.getElementById("page-tokens"), components: document.getElementById("page-components") };
  function showPage(name){
    pageButtons.forEach(function(b){ b.classList.toggle("is-active", b.getAttribute("data-page") === name); });
    Object.keys(pages).forEach(function(k){ pages[k].hidden = k !== name; });
  }
  pageButtons.forEach(function(b){
    b.addEventListener("click", function(){ showPage(b.getAttribute("data-page")); });
  });

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var notice = document.getElementById("notice");
  var preview = document.getElementById("preview");
  var badge = document.getElementById("coverage-badge");
  var missingList = document.getElementById("missing-list");

  function dottedToVarName(dotted){ return "--" + dotted.split(".").join("-"); }

  // getComputedStyle on a custom property returns its raw text, including an unresolved
  // light-dark(...) call - that only resolves when consumed by an actual CSS property.
  // Pick the half that matches what's actually on screen so the label never lies about it.
  function resolveDisplayValue(raw){
    var match = raw.match(/^light-dark\\((.+),\\s*(.+)\\)$/);
    if (!match) return raw;
    var scheme = document.documentElement.style.colorScheme;
    var isDark = scheme === "dark" || (scheme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    return isDark ? match[2].trim() : match[1].trim();
  }

  function refresh(){
    var vals = getComputedStyle(document.documentElement);
    document.querySelectorAll("[data-var]").forEach(function(el){
      var v = resolveDisplayValue(vals.getPropertyValue(el.getAttribute("data-var")).trim());
      el.textContent = v || "-";
    });
    var missing = CONTRACT.filter(function(k){
      return !vals.getPropertyValue(dottedToVarName(k)).trim();
    });
    badge.textContent = (CONTRACT.length - missing.length) + "/" + CONTRACT.length + " tokens resolved";
    badge.className = "badge " + (missing.length === 0 ? "is-good" : "is-bad");
    if (missing.length){
      missingList.hidden = false;
      missingList.innerHTML = missing.map(function(k){ return "<li>" + k + "</li>"; }).join("");
    } else {
      missingList.hidden = true;
    }
  }

  function activate(name, isBuilt){
    document.documentElement.setAttribute("data-theme", name);
    tabs.forEach(function(t){ t.classList.toggle("is-active", t.getAttribute("data-theme") === name); });
    if (isBuilt === "false"){
      notice.hidden = false;
      notice.textContent = 'Theme "' + name + '" is defined but not built yet - run: node build.cjs ' + name;
      preview.style.display = "none";
    } else {
      notice.hidden = true;
      preview.style.display = "";
      refresh();
    }
  }

  tabs.forEach(function(t){
    t.addEventListener("click", function(){ activate(t.getAttribute("data-theme"), t.getAttribute("data-built")); });
  });
  if (tabs.length){ activate(tabs[0].getAttribute("data-theme"), tabs[0].getAttribute("data-built")); }

  var modeButtons = Array.prototype.slice.call(document.querySelectorAll(".mode-toggle button"));
  function setMode(mode){
    document.documentElement.style.colorScheme = mode;
    modeButtons.forEach(function(b){ b.classList.toggle("is-active", b.getAttribute("data-mode") === mode); });
    refresh();
  }
  modeButtons.forEach(function(b){
    b.addEventListener("click", function(){ setMode(b.getAttribute("data-mode")); });
  });
  setMode("light dark");

  var bpChips = Array.prototype.slice.call(document.querySelectorAll(".bp-chip"));
  function updateBreakpoints(){
    var w = window.innerWidth;
    var active = null;
    bpChips.forEach(function(c){
      if (w >= parseFloat(c.getAttribute("data-bp-min"))) active = c;
    });
    bpChips.forEach(function(c){ c.classList.toggle("is-active", c === active); });
  }
  window.addEventListener("resize", updateBreakpoints);
  updateBreakpoints();

  document.querySelectorAll(".tabs-c__tab").forEach(function(t){
    t.addEventListener("click", function(){
      if (t.disabled) return;
      var group = t.closest(".tabs-c").querySelectorAll(".tabs-c__tab");
      group.forEach(function(sib){
        sib.classList.toggle("is-active", sib === t);
        sib.setAttribute("aria-selected", sib === t ? "true" : "false");
      });
    });
  });

  document.querySelectorAll(".toast-c__dismiss").forEach(function(btn){
    btn.addEventListener("click", function(){
      var toast = btn.closest(".toast-c");
      toast.style.transition = "opacity " + "var(--motion-fast, 120ms)";
      toast.style.opacity = "0";
      setTimeout(function(){ toast.style.visibility = "hidden"; }, 150);
    });
  });

  document.querySelectorAll(".dialog-c").forEach(function(dialog){
    var triggerId = dialog.getAttribute("data-trigger");
    var trigger = triggerId ? document.getElementById(triggerId) : null;
    var opener = null;
    if (trigger) {
      trigger.addEventListener("click", function(){
        opener = document.activeElement;
        dialog.showModal();
      });
    }
    dialog.addEventListener("close", function(){
      if (opener && typeof opener.focus === "function") opener.focus();
    });
  });
})();
</script>
`;
}

function generate() {
  const contract = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, "contract.json"), "utf8")).required;
  const primitives = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, "primitives.json"), "utf8"));
  const themes = loadThemes();
  const distCss = loadDistCss();
  const icons = loadIcons();

  const html = renderPage({ themes, distCss, contract, primitives, icons });
  fs.writeFileSync(OUT_FILE, html);
  console.log(`built dashboard/dashboard.html — ${themes.length} theme(s), ${Object.keys(distCss).length} built`);
}

module.exports = { generate };

if (require.main === module) generate();
