# Icon system

An original construction system, not a re-parameterized copy of any existing icon library. Researched Lucide, Feather, Heroicons, Phosphor, and Material Symbols for how professional icon systems are actually engineered — grid, stroke, naming — and built our own spec from that understanding, deliberately distinct from any single one of them.

## Construction spec

| parameter | value |
|---|---|
| canvas / viewBox | `0 0 20 20` |
| safe area | centered 17×17 (1.5-unit inset on every side) |
| stroke width | 1.75 units, non-scaling |
| line cap | `round` |
| line join | `miter` (default miter-limit) |
| corner radius (on rounded-rect glyphs) | 1.5 units, fixed |
| inter-element gap (multi-part glyphs) | 1.5 units — same constant as the inset, reused |
| fill | none — stroke-only, `stroke: currentColor` |

Every icon is `viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="miter"`.

Sized via the token layer, not hardcoded: `--icon-inline` (16px — dense text contexts, table rows, badges) and `--icon-control` (24px — inside buttons and nav items). The primitive scale (`icon.sm/md/lg` = 16/24/32px) is every other step of the `spacing` scale, so icons always land on the same 4px rhythm as padding and gaps.

## Naming philosophy

Adapted from Lucide's real, documented naming guide (a sound engineering practice, not something exclusive to them):

- kebab-case, always: `chevron-right.svg`, never `ChevronRight` or `icon_chevron_right`.
- Name what the glyph **depicts**, not its use in any one screen: `x`, not `close` or `dismiss`. `circle-check`, not `success` or `verified`. An icon gets reused in contexts its original name wouldn't fit — name the shape, not the job.
- Compound/variant icons: `<group>-<variant>` — `chevron-up` / `chevron-down` / `chevron-left` / `chevron-right`.
- Multi-element icons: name container-shape-first, in reading order — `circle-check` (the circle holds the check), not `check-circle`.
- Disambiguating variants get a trailing qualifier, never a number: `arrow-up-right` vs. `arrow-up-right-square`, never `arrow-2`.

## What exists so far

Three icons only — a proof that the grid and rules actually work, not a start on a full set:

- `chevron-right.svg`
- `check.svg`
- `x.svg`

These three were chosen specifically because they're pure geometry — fixed-angle line segments with essentially no room for the compositional choices a pictorial icon (camera, floppy disk, folder) would involve. Their coordinates are a mechanical consequence of this system's own 20-unit grid and 1.75-unit stroke, which can't coincide with any reference library's coordinates (all of which use a different canvas size and stroke width).

Further icons get authored the same way, against this same spec, as components actually need them — not produced in bulk ahead of time.
