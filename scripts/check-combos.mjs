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
//    at rest and on hover. Rings are measured against everything painted
//    behind the control, so a control on a colored fill (a solid Alert, an
//    ink band) fails unless the fill re-points --color-border-focus. Also fails any control whose touch hit area is
//    under 44 × 44px (links in running text, underline="always", are exempt).
//    Static text a fixture marks with data-check-text (type tones, text on
//    section backgrounds) is measured too, at rest: 4.5:1, or 3:1 when large;
//    data-check-text="deep" also measures every element inside it that holds text.
//    Form controls count as controls too: text inputs and textareas are measured
//    on the box that draws them ([data-control]); a checkbox, radio or switch
//    on its drawn indicator, whose edge or fill must reach 3:1 against what is
//    behind it. A border is measured whenever the fill alone doesn't reach 3:1.
//    Menu items count as controls. A fixture can show several states (a closed
//    trigger, an open dialog, …) as variants; each is loaded and measured on its own.
//    Overlays render into the fixture, so what a modal hides (aria-hidden) is skipped,
//    as is hover on anything a scrim or popover covers. [data-check-skip] marks a
//    control measured in another variant (a menu's trigger, while the menu holds focus).
//    Visually hidden controls (React Aria's screen-reader DismissButton) are skipped, and so are
//    controls that aren't rendered (display: none — a navbar's menu button above its breakpoint).
//    backdrop-filter is allowed (a translucent bar blurring what's behind it); filter is not.
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
// Everything the checker treats as a control (hidden inputs such as React Aria's HiddenSelect are skipped).
const CONTROLS = ["button", "a", 'input:not([type=hidden]):not([tabindex="-1"])', 'textarea:not([tabindex="-1"])', '[role^="menuitem"]']
  .map((s) => `#fixture ${s}`)
  .join(", ");
const MODES = ["light", "dark"];

const registered = [...readFileSync(join(GALLERY, "src/check/fixtures.tsx"), "utf8").matchAll(/^  (\w+): (?:\(\) =>|states\()/gm)].map((m) => m[1]);
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
      if (file.endsWith(".css")) {
        const rule =
          (/(^|[\s;{])filter\s*:/.test(line) && "no filter effects — hover and press use real tokens") ||
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

  // A form input is drawn by another element: the box around it, or the indicator beside it.
  const isField = el.matches("input, textarea");
  const isChoice = el.matches("input[type=checkbox], input[type=radio]");
  const vis = isField ? (el.closest("[data-control]") ?? el.parentElement.querySelector(":scope > [data-control]") ?? el) : el;
  if (focus) el.focus();
  const cs = getComputedStyle(el);
  const vcs = getComputedStyle(vis);
  const outer = backdrop(vis.parentElement);
  const own = backdrop(el);
  const text = over(rgba(cs.color), own);
  const size = parseFloat(cs.fontSize);
  const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
  const spinner = el.getAttribute("aria-busy") === "true" && el.querySelector("[data-spinner]");
  const name = el.getAttribute("aria-label") || el.labels?.[0]?.textContent.trim() || el.textContent.trim();
  const out = { label: name, checks: [] };
  if (isChoice) {
    // no text of its own: the label is measured as text
  } else if (spinner) {
    // Loading hides the label (it keeps its space); the spinner is the visible graphic: 3:1.
    const sc = over(rgba(getComputedStyle(spinner).borderRightColor), own);
    out.checks.push({ kind: "spinner", ratio: ratio(sc, own), min: 3, fg: hex(sc), bg: hex(own) });
  } else {
    out.checks.push({ kind: "text", ratio: ratio(text, own), min: large ? 3 : 4.5, fg: hex(text), bg: hex(own) });
  }
  const fillColor = rgba(vcs.backgroundColor);
  const fill = over(fillColor, outer);
  const fillRatio = fillColor[3] > 0 ? ratio(fill, outer) : 1;
  const border = rgba(vcs.borderTopColor);
  const hasBorder = parseFloat(vcs.borderTopWidth) > 0 && border[3] > 0;
  const b = over(border, outer);
  if (isChoice) {
    // the indicator carries the state: its edge or its fill must stand out at 3:1
    const edge = hasBorder ? ratio(b, outer) : 1;
    const best = edge >= fillRatio ? { r: edge, c: b } : { r: fillRatio, c: fill };
    out.checks.push({ kind: "boundary", ratio: best.r, min: 3, fg: hex(best.c), bg: hex(outer) });
  } else if (hasBorder && fillRatio < 3) {
    out.checks.push({ kind: "border", ratio: ratio(b, outer), min: 3, fg: hex(b), bg: hex(outer) });
  }
  if (focus) {
    if (vcs.outlineStyle === "none" || parseFloat(vcs.outlineWidth) === 0) {
      out.checks.push({ kind: "focus", ratio: 0, min: 3, fg: "none", bg: hex(outer) });
    } else {
      const o = over(rgba(vcs.outlineColor), outer);
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
    const url = (theme, mode, v) => `${base}check.html?component=${name}&theme=${theme}&mode=${mode}&variant=${v}`;
    await page.goto(url("orange", "light", 0));
    await page.waitForSelector("body[data-fixture=ready] #fixture > *", { state: "attached" });
    const variants = await page.evaluate(() => JSON.parse(document.body.dataset.variants || "[null]"));
    for (const theme of THEMES) {
      for (const mode of MODES) {
      for (let v = 0; v < variants.length; v++) {
        const label = variants[v] ? ` [${variants[v]}]` : "";
        await page.goto(url(theme, mode, v));
        await page.waitForSelector("body[data-fixture=ready] #fixture > *", { state: "attached" });
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; }" });
        // let entry animations (a sheet sliding in) land; looping ones (spinners) never finish
        await page.evaluate(() =>
          Promise.all(document.getAnimations().filter((x) => x.effect?.getComputedTiming().iterations !== Infinity).map((x) => x.finished))
        );
        const count = await page.evaluate((selector) => {
          const els = [...document.querySelectorAll(selector)].filter(
            (el) => el.getClientRects().length > 0 && !el.matches(":disabled, [data-disabled]") && !el.closest('[aria-hidden="true"], [data-check-skip]') && ![el, el.parentElement].some((n) => n && getComputedStyle(n).clipPath === "inset(50%)")
          );
          els.forEach((el, i) => {
            el.setAttribute("data-check-id", String(i));
            // a form input is hovered where it is drawn (a checkbox input can't be pointed at)
            const target = el.matches("input, textarea") ? (el.closest("label, [data-control]") ?? el) : el;
            target.setAttribute("data-check-hover", String(i));
          });
          return els.length;
        }, CONTROLS);
        const before = failures;
        const report = (state, res) => {
          for (const c of res.checks) {
            if (c.ratio + 1e-9 < c.min) {
              fail(`${theme}/${mode}${label} ${state} "${res.label}" ${c.kind} ${c.ratio.toFixed(2)}:1 < ${c.min}:1 (${c.fg} on ${c.bg})`);
            }
          }
        };
        // Rest + focus ring (no pointer has touched the page, so focus() shows :focus-visible).
        for (let i = 0; i < count; i++) report("rest", await page.evaluate(measure, { id: i, focus: true }));
        let covered = 0;
        for (let i = 0; i < count; i++) {
          // a control under a scrim or popover can't be hovered, so it has no hover state to measure
          const reachable = await page.evaluate((i) => {
            const el = document.querySelector(`[data-check-hover="${i}"]`);
            el.scrollIntoView({ block: "center" });
            const r = el.getBoundingClientRect();
            const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
            return !!hit && (el === hit || el.contains(hit));
          }, i);
          if (!reachable) {
            covered++;
            continue;
          }
          await page.hover(`[data-check-hover="${i}"]`);
          report("hover", await page.evaluate(measure, { id: i, focus: false }));
        }
        await page.mouse.move(0, 0);
        const texts = await page.evaluate(() => {
          const hasText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
          const els = [...document.querySelectorAll("#fixture [data-check-text]")].flatMap((el) =>
            el.dataset.checkText === "deep"
              ? [el, ...[...el.querySelectorAll("*")].filter((d) => hasText(d) && !d.closest('button, a, option, [aria-hidden="true"]'))]
              : [el]
          );
          els.forEach((el, i) => el.setAttribute("data-check-id", `text-${i}`));
          return els.length;
        });
        for (let i = 0; i < texts; i++) report("rest", await page.evaluate(measure, { id: `text-${i}`, focus: false }));
        const n = failures - before;
        const what = [count && `${count} controls × rest, focus, hover${covered ? ` (${covered} covered, no hover)` : ""}`, texts && `${texts} text styles`].filter(Boolean).join(", ");
        console.log(`${n ? "✗" : "✓"} ${name}${label} ${theme}/${mode}: ${what || "nothing to measure"} — ${n} failure${n === 1 ? "" : "s"}`);
      }
      }
    }
    // Touch targets: colors don't matter here, so one theme/mode is enough.
    const touch = await browser.newContext({ viewport: { width: 1400, height: 1000 }, hasTouch: true, isMobile: true });
    const tp = await touch.newPage();
    const touchResult = { coarse: true, small: [], count: 0 };
    for (let v = 0; v < variants.length; v++) {
    await tp.goto(url("orange", "light", v));
    await tp.waitForSelector("body[data-fixture=ready] #fixture > *", { state: "attached" });
    const r = await tp.evaluate((selector) => {
      if (!matchMedia("(pointer: coarse)").matches) return { coarse: false, small: [], count: 0 };
      const els = [...document.querySelectorAll(selector)].filter(
        // Links in running text (underline="always") are exempt, as in WCAG 2.5.8.
        (el) => el.getClientRects().length > 0 && !el.matches(':disabled, [data-disabled], [data-underline="always"]') && !el.closest('[aria-hidden="true"], [data-check-skip]') && ![el, el.parentElement].some((n) => n && getComputedStyle(n).clipPath === "inset(50%)")
      );
      const small = [];
      for (const control of els) {
        // a form input's hit area is its label row or the box that draws it
        const el = control.matches("input, textarea") ? (control.closest("label, [data-control]") ?? control) : control;
        const r = el.getBoundingClientRect();
        const after = getComputedStyle(el, "::after");
        const w = Math.max(r.width, after.position === "absolute" ? parseFloat(after.width) || 0 : 0);
        const h = Math.max(r.height, after.position === "absolute" ? parseFloat(after.height) || 0 : 0);
        if (w < 43.5 || h < 43.5) small.push(`"${control.getAttribute("aria-label") || el.textContent.trim()}" ${Math.round(w)}×${Math.round(h)}`);
      }
      return { coarse: true, small, count: els.length };
    }, CONTROLS);
    touchResult.coarse &&= r.coarse;
    touchResult.small.push(...r.small.map((m) => (variants[v] ? `[${variants[v]}] ${m}` : m)));
    touchResult.count += r.count;
    }
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
