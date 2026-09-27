#!/usr/bin/env node
// Datum four-combo checker.
//
//   node scripts/check-combos.mjs [Component ...]
//
// 1. Static scan: fails on hardcoded colors in a component's .css/.tsx, and
//    on breaking the interaction rules in DESIGN.md: filter-based hover, raw
//    durations instead of motion tokens, and :focus rings instead of :focus-visible.
// 2. Render: loads each component's fixture (apps/gallery/check.html) in
//    orange/navy × light/dark and fails on WCAG contrast failures —
//    text 4.5:1 (3:1 large), control borders and focus rings 3:1 —
//    at rest and on hover. Also fails any control whose touch hit area is
//    under 44 × 44px (links in running text, underline="always", are exempt).
//    Overlays portal out of #fixture, so the whole page is scanned: buttons,
//    links and menu items are controls; tooltips are checked as text at rest.
//    Anything hidden behind an open modal (aria-hidden / inert) or visually
//    hidden (React Aria's 1px dismiss buttons) is not operable and is skipped.
//
// Needs a built @datum-design/react (the gallery imports dist); `npm run check` builds first.
// The gallery is built into a temp folder and served statically.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GALLERY = join(ROOT, "apps/gallery");
const COMPONENTS = join(ROOT, "packages/react/src/components");
const THEMES = ["orange", "navy"];
const MODES = ["light", "dark"];

const registered = [...readFileSync(join(GALLERY, "src/check/fixtures.tsx"), "utf8").matchAll(/^  (\w+): \(\) =>/gm)].map((m) => m[1]);
const requested = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const targets = requested.length ? requested : registered;

// What counts as a control, what is checked as text only, and what is operable.
const CONTROLS = "button, a, [role^=menuitem]";
const TEXT_ONLY = "[role=tooltip]";
const OPERABLE = `
  if (el.matches(":disabled, [data-disabled]")) return false;
  if (el.closest('[aria-hidden="true"], [inert]')) return false;
  for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
    const r = n.getBoundingClientRect();
    if ((n === el || getComputedStyle(n).overflow !== "visible") && (r.width <= 1 || r.height <= 1)) return false;
  }
  return true;
`;

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
      if (file.endsWith(".css")) {
        const rule =
          (/(^|[\s;{])(backdrop-)?filter\s*:/.test(line) && "no filter effects — hover and press use real tokens") ||
          (/(transition|animation)[\w-]*\s*:/.test(line) && /(^|[\s:,(])\d*\.?\d+m?s\b/.test(line.replace(/var\([^)]*\)/g, "")) &&
            "timing must come from motion tokens") ||
          (/:focus(?![\w-])/.test(line) && "focus rings use :focus-visible (keyboard only), not :focus");
        if (rule) {
          hits++;
          fail(`interaction rule: ${rule} at ${where}`);
        }
      }
    });
  }
  if (!hits) console.log(`  ✓ ${name}: no hardcoded colors or interaction-rule breaks (${files.join(", ")})`);
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
  const spinner = el.getAttribute("aria-busy") === "true" && el.querySelector("[data-spinner]");
  const out = { label: el.getAttribute("aria-label") || el.textContent.trim(), checks: [] };
  if (spinner) {
    // Loading hides the label (it keeps its space); the spinner is the visible graphic: 3:1.
    const sc = over(rgba(getComputedStyle(spinner).borderRightColor), own);
    out.checks.push({ kind: "spinner", ratio: ratio(sc, own), min: 3, fg: hex(sc), bg: hex(own) });
  } else {
    out.checks.push({ kind: "text", ratio: ratio(text, own), min: large ? 3 : 4.5, fg: hex(text), bg: hex(own) });
  }
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
const { build, preview } = await import("vite");
const { chromium } = await import("playwright");

console.log(`\nDatum combo check — ${targets.join(", ") || "(nothing registered)"}\n`);
console.log("Static scan");
targets.forEach(scanComponent);

// A static build, not the dev server: the dev server can reload the page
// mid-run when it discovers a dependency, which destroys the measurement.
const outDir = join(tmpdir(), "datum-combo-check");
const viteConfig = { root: GALLERY, configFile: join(GALLERY, "vite.config.ts"), logLevel: "error" };
await build({ ...viteConfig, build: { outDir, emptyOutDir: true } });
const server = await preview({ ...viteConfig, build: { outDir }, preview: { port: 5199, strictPort: false } });
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
        const [count, texts] = await page.evaluate(
          ([controls, textOnly, operable]) => {
            const isOperable = new Function("el", operable);
            const els = [...document.querySelectorAll(controls)].filter(isOperable);
            const txt = [...document.querySelectorAll(textOnly)].filter(isOperable);
            [...els, ...txt].forEach((el, i) => el.setAttribute("data-check-id", String(i)));
            return [els.length, txt.length];
          },
          [CONTROLS, TEXT_ONLY, OPERABLE]
        );
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
        for (let i = count; i < count + texts; i++) report("rest", await page.evaluate(measure, { id: i, focus: false }));
        for (let i = 0; i < count; i++) {
          await page.hover(`[data-check-id="${i}"]`);
          report("hover", await page.evaluate(measure, { id: i, focus: false }));
        }
        await page.mouse.move(0, 0);
        const n = failures - before;
        const extra = texts ? ` + ${texts} text${texts === 1 ? "" : "s"}` : "";
        console.log(`${n ? "✗" : "✓"} ${name} ${theme}/${mode}: ${count} controls × rest, focus, hover${extra} — ${n} failure${n === 1 ? "" : "s"}`);
      }
    }
    // Touch targets: colors don't matter here, so one theme/mode is enough.
    const touch = await browser.newContext({ viewport: { width: 1400, height: 1000 }, hasTouch: true, isMobile: true });
    const tp = await touch.newPage();
    await tp.goto(`${base}check.html?component=${name}&theme=orange&mode=light`);
    await tp.waitForSelector("body[data-fixture=ready] #fixture > *");
    const touchResult = await tp.evaluate(([controls, operable]) => {
      if (!matchMedia("(pointer: coarse)").matches) return { coarse: false, small: [], count: 0 };
      const isOperable = new Function("el", operable);
      const els = [...document.querySelectorAll(controls)].filter(
        // Links in running text (underline="always") are exempt, as in WCAG 2.5.8.
        (el) => isOperable(el) && !el.matches('[data-underline="always"]')
      );
      const small = [];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const after = getComputedStyle(el, "::after");
        const w = Math.max(r.width, after.position === "absolute" ? parseFloat(after.width) || 0 : 0);
        const h = Math.max(r.height, after.position === "absolute" ? parseFloat(after.height) || 0 : 0);
        if (w < 43.5 || h < 43.5) small.push(`"${el.getAttribute("aria-label") || el.textContent.trim()}" ${Math.round(w)}×${Math.round(h)}`);
      }
      return { coarse: true, small, count: els.length };
    }, [CONTROLS, OPERABLE]);
    await touch.close();
    if (!touchResult.coarse) fail(`${name}: could not emulate a touch screen (pointer: coarse)`);
    touchResult.small.forEach((m) => fail(`touch target under 44×44: ${m}`));
    console.log(`${touchResult.small.length ? "✗" : "✓"} ${name} touch: ${touchResult.count} controls ≥ 44×44 hit area — ${touchResult.small.length} failure${touchResult.small.length === 1 ? "" : "s"}`);
  }
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}

console.log(failures ? `\n${failures} failure(s).` : "\nAll checks passed.");
process.exit(failures ? 1 : 0);
