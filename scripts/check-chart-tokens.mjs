#!/usr/bin/env node
// Datum data-viz token check. Reads the built theme CSS and, for orange/navy × light/dark:
//   - every categorical color (--color-chart-1…6) reaches 3:1 (WCAG non-text) against
//     --color-bg-page and --color-bg-surface;
//   - --color-chart-axis (tick labels) reaches 4.5:1 against both;
//   - adjacent categorical colors stay apart: OKLab ΔE ≥ 15 under normal vision
//     (colorblind separation was validated when the order was chosen; see DESIGN.md);
//   - the sequential ramp (--color-chart-seq-1…5) is monotonic in lightness.
// Exits non-zero on any failure.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = join(dirname(fileURLToPath(import.meta.url)), "../packages/styles/tokens/dist");
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const rgb = (h) => [1, 3, 5].map((i) => lin(parseInt(h.slice(i, i + 2), 16) / 255));
const lum = (h) => { const [r, g, b] = rgb(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const oklab = (h) => {
  const [r, g, b] = rgb(h);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
};
const dE = (a, b) => 100 * Math.hypot(...oklab(a).map((v, i) => v - oklab(b)[i]));

let failures = 0;
for (const theme of ["orange", "navy"]) {
  const css = readFileSync(join(DIST, `${theme}.css`), "utf8");
  const v = (name, mode) => {
    const m = css.match(new RegExp(`--${name}: light-dark\\((#[0-9A-Fa-f]{6}), (#[0-9A-Fa-f]{6})\\)`));
    if (!m) throw new Error(`${theme}: --${name} is not a light-dark() hex pair`);
    return m[mode === "light" ? 1 : 2];
  };
  for (const mode of ["light", "dark"]) {
    const bgs = ["bg-page", "bg-surface"].map((b) => v(`color-${b}`, mode));
    const cat = [1, 2, 3, 4, 5, 6].map((n) => v(`color-chart-${n}`, mode));
    const worst = Math.min(...cat.flatMap((c) => bgs.map((b) => ratio(c, b))));
    const axis = Math.min(...bgs.map((b) => ratio(v("color-chart-axis", mode), b)));
    const sep = Math.min(...cat.slice(1).map((c, i) => dE(c, cat[i])));
    const seqL = [1, 2, 3, 4, 5].map((n) => oklab(v(`color-chart-seq-${n}`, mode))[0]);
    const mono = seqL.every((l, i) => !i || (mode === "light" ? l < seqL[i - 1] : l > seqL[i - 1]));
    const ok = worst >= 3 && axis >= 4.5 && sep >= 15 && mono;
    if (!ok) failures++;
    console.log(`${ok ? "ok  " : "FAIL"} ${theme}/${mode}: series ≥ ${worst.toFixed(2)}:1, axis ${axis.toFixed(2)}:1, adjacent ΔE ≥ ${sep.toFixed(1)}, sequential ${mono ? "monotonic" : "NOT monotonic"}`);
  }
}
process.exit(failures ? 1 : 0);
