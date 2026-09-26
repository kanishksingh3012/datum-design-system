#!/usr/bin/env node
// Datum four-combo checker.
//
//   node scripts/check-combos.mjs [Component ...]
//
// 1. Static scan: fails on hardcoded colors in a component's .css/.tsx.
// 2. Render: loads each component's fixture (apps/gallery/check.html) in
//    orange/navy × light/dark and fails on WCAG contrast failures —
//    text 4.5:1 (3:1 large), control borders and focus rings 3:1 —
//    at rest and on hover.
//
// Needs a built @datum-design/react (the gallery imports dist); `npm run check` builds first.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GALLERY = join(ROOT, "apps/gallery");
const COMPONENTS = join(ROOT, "packages/react/src/components");
const THEMES = ["orange", "navy"];
const MODES = ["light", "dark"];

const registered = [...readFileSync(join(GALLERY, "src/check/fixtures.tsx"), "utf8").matchAll(/^  (\w+): \(\) =>/gm)].map((m) => m[1]);
const requested = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const targets = requested.length ? requested : registered;

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  ✗ ${msg}`);
};

// ---------------------------------------------------------------- static scan
const NAMED = new Set(
  ("white black red green blue yellow orange purple pink gray grey silver maroon navy olive teal aqua cyan magenta fuchsia lime " +
    "brown gold indigo violet coral salmon tomato crimson khaki beige ivory lavender plum orchid tan chocolate sienna peru " +
    "turquoise skyblue steelblue royalblue slategray slategrey darkgray darkgrey lightgray lightgrey whitesmoke gainsboro " +
    "snow linen wheat azure mintcream honeydew aliceblue ghostwhite seashell oldlace floralwhite " +
    "canvas canvastext buttonface buttontext highlight highlighttext graytext field fieldtext").split(" ")
);
const COLOR_FN = /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/;
const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})(?![\w-])/;
const COLOR_PROP = /(color|background|border|outline|fill|stroke|shadow|caret|accent|decoration)[\w-]*\s*[:=]\s*(.+)/i;

function stripComments(src) {
  // Keep line numbers stable: replace comment bodies with blank lines.
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:"'`])\/\/.*$/gm, (m, p) => p);
}

function scanComponent(name) {
  const dir = join(COMPONENTS, name);
  if (!existsSync(dir)) return fail(`${name}: no folder at ${relative(ROOT, dir)}`);
  const files = readdirSync(dir).filter((f) => /\.(css|tsx)$/.test(f) && !f.includes(".test."));
  let hits = 0;
  for (const file of files) {
    const lines = stripComments(readFileSync(join(dir, file), "utf8")).split("\n");
    lines.forEach((line, i) => {
      const where = `${relative(ROOT, join(dir, file))}:${i + 1}`;
      const hex = line.match(HEX);
      const fn = line.match(COLOR_FN);
      let named;
      const prop = line.match(COLOR_PROP);
      if (prop) {
        const value = prop[2].replace(/var\([^)]*\)/g, "");
        named = value.toLowerCase().match(/[a-z]+/g)?.find((w) => NAMED.has(w));
      }
      const found = hex?.[0] ?? (fn ? `${fn[1]}(` : named);
      if (found) {
        hits++;
        fail(`hardcoded color "${found}" at ${where}`);
      }
    });
  }
  if (!hits) console.log(`  ✓ ${name}: no hardcoded colors (${files.join(", ")})`);
}

// ---------------------------------------------------------------- in-page measurement
// Runs inside the browser. Returns contrast measurements for one control.
function measure({ id, focus }) {
  const el = document.querySelector(`[data-check-id="${id}"]`);
  const canvas = (window.__checkCanvas ??= Object.assign(document.createElement("canvas"), { width: 1, height: 1 }));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const rgba = (css) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "rgba(0,0,0,0)";
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b, a / 255];
  };
  const over = (top, bottom) => {
    const a = top[3] + bottom[3] * (1 - top[3]);
    if (a === 0) return [0, 0, 0, 0];
    return [0, 1, 2].map((i) => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / a).concat(a);
  };
  const lum = ([r, g, b]) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  // Composite background: every ancestor's background from <html> down (the fixture page paints bg.page on body).
  const backdrop = (node) => {
    const chain = [];
    for (let n = node; n && n.nodeType === 1; n = n.parentElement) chain.unshift(n);
    let bg = [255, 255, 255, 1];
    for (const n of chain) bg = over(rgba(getComputedStyle(n).backgroundColor), bg);
    return bg;
  };
  const hex = (c) => "#" + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

  if (focus) el.focus();
  const cs = getComputedStyle(el);
  const outer = backdrop(el.parentElement);
  const own = backdrop(el);
  const text = over(rgba(cs.color), own);
  const size = parseFloat(cs.fontSize);
  const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
  const out = {
    label: el.getAttribute("aria-label") || el.textContent.trim(),
    checks: [{ kind: "text", ratio: ratio(text, own), min: large ? 3 : 4.5, fg: hex(text), bg: hex(own) }],
  };
  const ownFill = rgba(cs.backgroundColor)[3];
  const border = rgba(cs.borderTopColor);
  if (parseFloat(cs.borderTopWidth) > 0 && border[3] > 0 && ownFill === 0) {
    const b = over(border, outer);
    out.checks.push({ kind: "border", ratio: ratio(b, outer), min: 3, fg: hex(b), bg: hex(outer) });
  }
  if (focus) {
    if (cs.outlineStyle === "none" || parseFloat(cs.outlineWidth) === 0) {
      out.checks.push({ kind: "focus", ratio: 0, min: 3, fg: "none", bg: hex(outer) });
    } else {
      const o = over(rgba(cs.outlineColor), outer);
      out.checks.push({ kind: "focus", ratio: ratio(o, outer), min: 3, fg: hex(o), bg: hex(outer) });
    }
    el.blur();
  }
  return out;
}

// ---------------------------------------------------------------- run
const { createServer } = await import("vite");
const { chromium } = await import("playwright");

console.log(`\nDatum combo check — ${targets.join(", ") || "(nothing registered)"}\n`);
console.log("Static scan");
targets.forEach(scanComponent);

const server = await createServer({
  root: GALLERY,
  configFile: join(GALLERY, "vite.config.ts"),
  logLevel: "error",
  server: { port: 5199, strictPort: false },
});
await server.listen();
const base = server.resolvedUrls.local[0];

let browser;
try {
  browser = await chromium.launch({ channel: "chrome" });
} catch {
  browser = await chromium.launch();
}
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

try {
  for (const name of targets) {
    if (!registered.includes(name)) {
      console.log(`\n${name}`);
      fail(`${name}: no fixture registered in apps/gallery/src/check/fixtures.tsx`);
      continue;
    }
    for (const theme of THEMES) {
      for (const mode of MODES) {
        await page.goto(`${base}check.html?component=${name}&theme=${theme}&mode=${mode}`);
        await page.waitForSelector("body[data-fixture=ready] #fixture > *");
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" });
        const count = await page.evaluate(() => {
          const els = [...document.querySelectorAll("#fixture button, #fixture a")].filter(
            (el) => !el.matches(":disabled, [data-disabled]")
          );
          els.forEach((el, i) => el.setAttribute("data-check-id", String(i)));
          return els.length;
        });
        const before = failures;
        const report = (state, res) => {
          for (const c of res.checks) {
            if (c.ratio + 1e-9 < c.min) {
              fail(`${theme}/${mode} ${state} "${res.label}" ${c.kind} ${c.ratio.toFixed(2)}:1 < ${c.min}:1 (${c.fg} on ${c.bg})`);
            }
          }
        };
        // Rest + focus ring (no pointer has touched the page, so focus() shows :focus-visible).
        for (let i = 0; i < count; i++) report("rest", await page.evaluate(measure, { id: i, focus: true }));
        for (let i = 0; i < count; i++) {
          await page.hover(`[data-check-id="${i}"]`);
          report("hover", await page.evaluate(measure, { id: i, focus: false }));
        }
        await page.mouse.move(0, 0);
        const n = failures - before;
        console.log(`${n ? "✗" : "✓"} ${name} ${theme}/${mode}: ${count} controls × rest, focus, hover — ${n} failure${n === 1 ? "" : "s"}`);
      }
    }
  }
} finally {
  await browser.close();
  await server.close();
}

console.log(failures ? `\n${failures} failure(s).` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
