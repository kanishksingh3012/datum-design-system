#!/usr/bin/env node
// Resolves primitives.json + base.json (shared type, space, radius, motion) deep-merged with one
// theme file (color + elevation) into CSS custom properties, validates the result against
// contract.json, then writes dist/<theme>.css plus dist/themes.css holding every theme.
// Usage: node build.cjs            -> builds every theme in themes/
//        node build.cjs navy       -> builds just themes/navy.json

const fs = require("fs");
const path = require("path");

const TOKENS_DIR = __dirname;
const THEMES_DIR = path.join(TOKENS_DIR, "themes");
const DIST_DIR = path.join(TOKENS_DIR, "dist");
const BASE_FILE = path.join(TOKENS_DIR, "base.json");

const primitives = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, "primitives.json"), "utf8"));
const contract = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, "contract.json"), "utf8")).required;
const base = JSON.parse(fs.readFileSync(BASE_FILE, "utf8"));

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

function deepMerge(target, source) {
  const out = { ...target };
  for (const key of Object.keys(source)) {
    if (key === "_meta") continue;
    if (isPlainObject(source[key]) && isPlainObject(target[key])) {
      out[key] = deepMerge(target[key], source[key]);
    } else {
      out[key] = source[key];
    }
  }
  return out;
}

function getPath(obj, dotted) {
  const value = dotted.split(".").reduce((node, key) => (node == null ? undefined : node[key]), obj);
  if (value === undefined) throw new Error(`Unresolved token reference: {${dotted}}`);
  return value;
}

function resolveRefs(node) {
  if (typeof node === "string") {
    const fullMatch = node.match(/^\{([\w.]+)\}$/);
    if (fullMatch) return getPath(primitives, fullMatch[1]);
    // A reference embedded inside a larger string (e.g. a color-mix() formula) — replace
    // every {dotted.path} occurrence in place rather than requiring the whole string to be one.
    if (/\{[\w.]+\}/.test(node)) {
      return node.replace(/\{([\w.]+)\}/g, (_, dotted) => getPath(primitives, dotted));
    }
    return node;
  }
  // A [light, dark] pair — each side resolved independently, formatted at flatten time via
  // CSS light-dark(), so one token carries both values instead of doubling the contract.
  if (Array.isArray(node)) {
    return node.map(resolveRefs);
  }
  if (isPlainObject(node)) {
    const out = {};
    for (const key of Object.keys(node)) {
      if (key === "_meta") continue;
      out[key] = resolveRefs(node[key]);
    }
    return out;
  }
  return node;
}

function flatten(node, prefix, out) {
  for (const key of Object.keys(node)) {
    const value = node[key];
    const nextPrefix = prefix ? `${prefix}-${key}` : key;
    if (Array.isArray(value)) {
      out[`--${nextPrefix}`] = `light-dark(${value[0]}, ${value[1]})`;
    } else if (isPlainObject(value)) {
      flatten(value, nextPrefix, out);
    } else {
      out[`--${nextPrefix}`] = value;
    }
  }
  return out;
}

function dottedToVarName(dotted) {
  return `--${dotted.split(".").join("-")}`;
}

function collectLeafPaths(node, prefix, out) {
  for (const key of Object.keys(node)) {
    if (key === "_meta") continue;
    const value = node[key];
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(value)) collectLeafPaths(value, nextPrefix, out);
    else out.push(nextPrefix);
  }
  return out;
}

// Catches typos in a theme file (e.g. "colour.bg.accent") before they silently become a
// dead branch that never overrides anything while the real key quietly keeps its default.
function validateKnownKeys(themeName, rawTheme) {
  const contractSet = new Set(contract);
  const unknown = collectLeafPaths(rawTheme, "", []).filter((p) => !contractSet.has(p));
  if (unknown.length > 0) {
    throw new Error(
      `Theme "${themeName}" defines token(s) not in contract.json — typo, or a new token that needs adding to the contract:\n` +
        unknown.map((k) => `  - ${k}`).join("\n")
    );
  }
}

// Guards against a theme (or base.json) losing a required key — e.g. a role deleted by accident.
function validateContractComplete(themeName, vars) {
  const missing = contract.filter((dotted) => !(dottedToVarName(dotted) in vars));
  if (missing.length > 0) {
    throw new Error(
      `Theme "${themeName}" is missing ${missing.length} required token(s):\n` +
        missing.map((k) => `  - ${k}`).join("\n")
    );
  }
}

function buildTheme(themeName) {
  const theme = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, `${themeName}.json`), "utf8"));
  validateKnownKeys(themeName, theme);
  const merged = deepMerge(base, theme);

  const resolved = resolveRefs(merged);
  const vars = flatten(resolved, "", {});

  validateContractComplete(themeName, vars);

  const lines = Object.entries(vars).map(([name, value]) => `  ${name}: ${value};`);
  const css = `:root[data-theme="${themeName}"] {\n  color-scheme: light dark;\n${lines.join("\n")}\n}\n`;

  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, `${themeName}.css`), css);
  console.log(`built dist/${themeName}.css — ${lines.length} tokens, contract satisfied (${contract.length}/${contract.length})`);
  return css;
}

const requested = process.argv[2];
validateKnownKeys("base", base);
if (requested) {
  buildTheme(requested);
} else {
  const all = fs.readdirSync(THEMES_DIR).filter((f) => f.endsWith(".json")).sort()
    .map((f) => buildTheme(path.basename(f, ".json")));
  fs.writeFileSync(path.join(DIST_DIR, "themes.css"), all.join("\n"));
  console.log(`built dist/themes.css — ${all.length} themes, select with data-theme`);
}

try {
  require("./dashboard/generate-dashboard.cjs").generate();
} catch (err) {
  console.warn("dashboard generation failed (tokens build still succeeded):", err.message);
}
