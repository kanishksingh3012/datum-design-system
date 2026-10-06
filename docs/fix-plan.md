# Fix round 3 — library-level fixes (plan + chat briefs)

Every fix here goes into **packages/react (and packages/styles if a token is needed)**, not into the gallery.
The gallery only shows what the library does. Each chat reads **only** the Workflow section and its own section.

## Workflow (every chat follows this)

1. `git pull`. Read this file's **Workflow** + **your section** only. Read `DESIGN.md` → "Surfaces and elevation" (added in P0) with `grep -n`, not the whole file.
2. Read only your components' `.tsx`, `.module.css`, `.test.tsx`. Never read big files whole (use `grep -n` + ranges).
3. Research only if your section says so: **max 2 WebFetch calls**, then decide.
4. Make the library change. Keep each component's API backward compatible unless your section says otherwise.
5. **Approval gate — show before you ship.** Run the dev server (`preview_start gallery`), open `/review.html` (every fixture in all four theme × mode combos; add or update your component's fixture in `apps/gallery/src/check/fixtures.tsx` if needed), and send the user **one screenshot per component at scale ≤ 0.5** showing orange/navy × light/dark. **Stop and wait** for the user's OK or changes. Do not touch the gallery doc pages before the OK.
6. After the OK: update the component's doc page in `apps/gallery/src/site/docs/<Name>.tsx` (demos, props table, a11y notes) to match.
7. Verify cheaply: `npx vitest run src/components/<Name>` (from `packages/react`), `npm run build`, `npm run build -w @datum-design/gallery`. Don't run the full suite or `npm run check`; the checkpoint chat does that.
8. Commit **per component** (`Fix round 3: <Name> — …`, ending with the Co-Authored-By line), push, and add one line under **Log** at the bottom of this file (component, commit hash, anything left).
9. Never stage `scratch-*.html`, `.impeccable/`, `apps/gallery/dist/`. No subagents. If the budget runs low, finish or revert the current component, push, log, stop.

Order: **P0 first (it's blocking)**. After that, chats can run one at a time in the listed order; if you run two at once, only pair chats that touch different component folders.

| # | Chat | Size | Depends on |
|---|---|---|---|
| P0 | DATUM: PARENT | M | — |
| 1 | DATUM: LAYOUT+TYPO | S | P0 |
| 2 | DATUM: CONTENT COMPONENTS | M | P0 |
| 3 | DATUM: LAYOUT and RICH INPUTS | S | P0 |
| 4 | DATUM: SEARCH FIELDS and DATES | L | P0 |
| 5 | DATUM: NAVIGATION | L | P0 |
| 6 | DATUM: AI PRIMITIVES and TABLES | M | P0 |
| 7 | DATUM: CHARTS | L | P0 |
| 8 | DATUM: Gallery site | S | 1–7 |
| 9 | DATUM: CHECKPOINT 2 | S | all |

---

## P0 — DATUM: PARENT (system rules; blocking)

**Problem (found in round 3 review):** almost every container fills with `--color-bg-surface` (Card, Table header, ToolCall, Sidebar, FileUpload, …). `surface` is not an elevation: in light mode it is *darker* than `surfaceRaised` (#F6F1EC vs #FFFFFF), in dark mode it is *lighter* (#424140 vs #323232). Nested containers therefore land on the same or nearly the same color ("light on light", "dark on dark") — see the ToolCall, chat, Table and Sidebar screenshots.

Do:
1. **Define one elevation ladder** (research reference: Material 3 "surface container" tonal ladder — lowest → highest). Decide which token is each step, per mode, so every step up is visibly different from the one below in *both* modes: `sunken` (wells: input tracks, code blocks) < `page` < `container` (cards, panels, table, tool calls) < `raised` (popovers, menus, toasts, dialogs). If the existing tokens can't form a monotonic ladder in dark mode, add tokens to `base`/themes + `contract.json` (both themes, both modes) and update `packages/styles` build. Keep WCAG pairs passing (`npm run build` runs the contract).
2. **Nesting rule:** a container placed on a container of the same step uses a border (`border.default`) and the *next step's* fill, or no fill at all — never the same fill without a border. Write it down.
3. **Text never clips:** inline highlighted text (inline `code`, badges, marks) uses `box-decoration-break: clone` so a wrapped chip keeps its padding and radius on every line; no fixed height + `overflow: hidden` on text chips; badges `white-space: nowrap` unless `truncate` is asked for.
4. **Fill container:** block-level components (Table, DataTable, Tabs with `fullWidth`, charts, FileUpload, Composer, MessageScroller, CodeBlock, Alert) fill their parent's width by default (`width: 100%; min-width: 0; box-sizing: border-box`), like Auto Layout "fill". Inline controls hug their content.
5. Add a **"Surfaces and elevation"** section to `DESIGN.md` (ladder table per mode, nesting rule, text-never-clips rule, fill-container rule), short enough for other chats to grep.
6. Approval gate: show the user a before/after of Card-in-Card, ToolCall, and Table in dark + light (review.html), wait for OK. Then commit + push. **Don't** migrate individual components beyond Card — the group chats do that.

---

## 1 — DATUM: LAYOUT+TYPO

- **Text** `variant="code"` and any inline highlight: apply P0's "text never clips" rule (`box-decoration-break: clone`, padding that survives wrapping). Screenshot 1: the inline `@datum-design/styles/themes.css` chip is cut where it wraps.
- **Container / Stack / Grid / Section:** confirm they follow the fill-container rule (Grid's responsive columns were fixed in `23fc3a6`).

## 2 — DATUM: CONTENT COMPONENTS

- **Carousel autoplay doesn't rotate** in the gallery demo. Find out why (timer, `paused` state, `prefers-reduced-motion` detection, StrictMode double-mount, visibility) and fix it; add a test with fake timers.
- **Carousel controls:** the dots are spread far apart. Layout: `[pause] … [‹] ●●● [›]` with dots grouped tightly (≈ 6–8px gap), the whole row centered under the slide, the pause button aligned with the slide's start edge.
- **Card:** move to P0's ladder (`container` step) and nesting rule. **Badge / Avatar / Accordion:** check against the ladder and the text-never-clips rule.

## 3 — DATUM: LAYOUT and RICH INPUTS

- **FileUpload:** the drop zone's grey fill looks off. Use a white / off-white surface from the ladder (light: raised/white; dark: the matching step), dashed `border.strong`, and neutral content on top: the upload icon on a transparent or subtle neutral circle — **not** filled with accent or grey. Hover/drag-over state: accent border + `bg.accentSubtle`. File rows: same surface with a border.
- **ScrollArea, Resizable, ColorPicker:** check against the ladder only; change nothing else.

## 4 — DATUM: SEARCH FIELDS and DATES

- **TagInput chips:** look grey and cramped. Chips: white / light surface (`raised` in light, the matching step in dark) with `border.default`, larger padding (≈ 4px 10px), 6–8px gap between chips, comfortable padding inside the field, remove-× keeps its 44px touch target. Wrapped rows must not crowd the input.
- **DatePicker + DateRangePicker:** add **month and year selection** inside the calendar header. Research first (max 2 fetches: e.g. MUI X DatePicker views, React Aria Calendar with a custom header, Radix/shadcn "captionLayout=dropdown"). Suggested: clicking the "September 2026" caption toggles a month grid, then a year grid (bounded by `minValue`/`maxValue`); keyboard: arrows move, Enter picks, Escape returns to days. Prev/next arrows still work. Tests for month/year change + bounds.
- **Combobox, CommandPalette:** check against the ladder only.

## 5 — DATUM: NAVIGATION

- **Tabs (`pill`, `segmented`):** two selection marks show at once — the fill/thumb *and* the underline bar, plus the tablist's bottom rule. The underline indicator and the bottom rule belong to `appearance="underline"` only. Pill = ink fill only; segmented = raised thumb only.
- **Navbar — redesign.** Research first (max 2 fetches: e.g. vercel.com, linear.app, stripe.com, Radix Navigation Menu). Fix: (a) it **bleeds out of its container** in the gallery demos — it must fill its parent, never exceed it; (b) left/right padding is far too large — use the page gutter token only once; (c) the centered links need even spacing (≈ 24–32px) and clear gaps from the logo and from the actions; (d) the `inverse` appearance looks bad — rebuild it with `bg.inverse`, `text.onInverse`, and actions that re-point correctly; (e) consistent 64px height, 14px medium links, subtle active indicator, dropdown panels on the `raised` step. Mobile Sheet behavior stays.
- **Footer:** link columns are indented relative to their titles — align them; use the ladder.
- **Sidebar:** panel vs page contrast per the ladder; the count badge must stay readable on the active row in dark mode.
- **Breadcrumbs, Pagination:** check against the ladder only.

## 6 — DATUM: AI PRIMITIVES and TABLES

- **Table / DataTable:** don't fill their container (gap on the right in the screenshot). Apply the fill-container rule: the table and its scroll box span 100% of the parent; columns share the width.
- **Same-color nesting:** ToolCall, Message, MessageScroller, Composer, Reasoning, TodoList, Sources, FileDiff, CodeBlock — move to P0's ladder + nesting rule so each layer is distinguishable in light and dark (see the ToolCall and chat screenshots). The message actions under a message must be clearly visible (not faded) when the message isn't streaming.

## 7 — DATUM: CHARTS

The charts don't look production-ready. Research first (max 2 fetches: ui.shadcn.com/charts, tremor.so or MUI X Charts). Target anatomy:
- **Fill container:** the chart spans its parent's width with a sensible min-height (it currently renders narrow and centered). Optional aspect-ratio prop.
- **Grid & axes:** horizontal grid lines only, subtle (`border.subtle`/chart grid token), no axis lines, no tick lines, 8–10px tick margin, formatted ticks (e.g. `Jan`, `$12k`), tabular numbers.
- **Line/Area:** 2px strokes, `monotone`/`natural` curve, dots hidden until hover (active dot with a ring of the surface color), area fills as a vertical gradient (series color ~40% → 0%).
- **Bar:** 4–6px top radius, category gap, stacked bars share one radius at the top.
- **Pie/Donut:** **no dark strokes** — separate slices with a stroke in the chart's own surface color (or a small `paddingAngle` + corner radius); donut center shows the total + a caption; legend below with small round markers.
- **Tooltip:** on the `raised` step with a border, label on top, rows of indicator (dot/line) + name + right-aligned tabular value.
- **Chart card pattern:** a documented composition (Card with title, description, chart, footer trend line like "Up 5.2% this month") — add it as a doc demo, not a new component unless the research says otherwise.
- Keep the token contrast guarantees in `scripts/check-chart-tokens.mjs` passing; update chart fixtures.

## 8 — DATUM: Gallery site

After 1–7 are logged: (a) the Preview frame (`.site-demo .sample-box/.example-box` in `apps/gallery/src/site/site.css`) sits on the ladder's page step with a `border.subtle` border, so components show their real elevation; (b) inline `code` in `.site-doc`/`.site-prose` follows the text-never-clips rule; (c) spot-check every changed component page in all four combos; push (auto-deploys to https://datum-design-system.vercel.app).

## 9 — DATUM: CHECKPOINT 2

Run once at the end: `npm run check` (all combos), full `npm test`, `npm run build`, gallery build. Fix only regressions; log counts here.

---

## Log
<!-- one line per component: chat · component · commit · notes -->
- PARENT · P0 elevation ladder (dark surface/raised swapped so raised is always the lighter step), Card nesting rule, DESIGN.md "Surfaces and elevation" · see git log "Fix round 3: P0" · group chats migrate their own components
- LAYOUT+TYPO · Text inline code chip (clone, sunken fill) `2f1cd62` · gallery uses it on Getting started / Theming + Text doc demo `5ddd228` · Container/Stack/Grid/Section already fill
- LAYOUT and RICH INPUTS · FileUpload `c2da670` · raised drop zone + rows, neutral icon ring (text-color hairline, since border.default vanishes on raised in dark), accent hover/drag-over, fills parent width · docs page updated, not screenshotted
- LAYOUT and RICH INPUTS · ScrollArea, Resizable, ColorPicker · no commit · checked against the ladder in the CSS, nothing to change (no container fills of their own; grip, thumbs, trigger and panel are on raised)
- CHARTS · LineChart + shared ChartContainer foundation · see git log "Fix round 3: LineChart" · fills parent width, `aspectRatio`, auto y-axis width, tabular ticks, tooltip indicator (line/dot), centered legend with round markers, `natural` curve · review.html gained `?only=Name`
- CHARTS · AreaChart · see git log "Fix round 3: AreaChart" · vertical gradient fill (40%→0%; stacked 50%→15%), round caps
- CHARTS · BarChart · see git log "Fix round 3: BarChart" · 6px data-end radius, a stack shares one rounded end (per category, via Cell), 28% category gap, auto axis width
- CHARTS · DonutChart/PieChart · see git log "Fix round 3: DonutChart" · no strokes (paddingAngle + corner radius), `centerCaption` under the total
- CHARTS · Sparkline · see git log "Fix round 3: Sparkline" · end dot on the latest value (`endDot`, default on), gradient area variant, round caps
- CHARTS · Chart card pattern · see git log "Fix round 3: chart card" · doc demo on the AreaChart page (Card + header, chart, trend footer; sets `--chart-surface`), no new component · note: chart entrance animations look slow in the Claude browser pane only because the pane is backgrounded (rAF ≈ 2/s), not a library issue · left for the checkpoint chat: full `npm run check` and full test suite were not run this round
- AI PRIMITIVES and TABLES · Table · see git log "Fix round 3: Table" · fills its parent (width 100%, border-box); rows run edge to edge via new ScrollArea `scrollbarGutter` (default true, Table passes false) · Table + ScrollArea docs updated
- SEARCH FIELDS and DATES · TagInput `b94bb22` · chips on the raised fill with a hairline edge (border.default mixed 16% toward text, as it vanishes on raised in dark), 4×10px padding, 6–8px gaps; the input collapses at maxTags · docs page updated
- NAVIGATION · Tabs · see git log "Fix round 3: Tabs" · selectors were descendant selectors, so a Tabs nested in an underline Tabs (every docs page) also got the bar and bottom rule; now child combinators, one mark per appearance · nested fixture + docs demo
- AI PRIMITIVES and TABLES · DataTable · see git log "Fix round 3: DataTable" · wrapper fills its parent (width 100%, border-box); grid inherits the Table fix · docs page updated
- NAVIGATION · Navbar · see git log "Fix round 3: Navbar" · folds by its own width (container query, so it never exceeds its parent), one gutter, 64px default (was 72), 14px links with a soft active pill, sides never shrink under the links, inverse band re-points text/fills/edges/focus and swaps the ink + accent tokens (accent Button = the light button on the band) · mobileBreakpoint now measures the bar, not the screen
- AI PRIMITIVES and TABLES · ToolCall · see git log "Fix round 3: ToolCall" · shared `lib/Disclosure` card is now a container (bg.surface + border; raised when nested in another disclosure), so Reasoning, TodoList, FileDiff and AgentActivity steps get the fill too; input/output/error are sunken wells · a ToolCall inside a Card is not auto-detected
- SEARCH FIELDS and DATES · DatePicker `359f0db` · caption button → month grid → year grid (12 per page) in shared lib/Calendar, bounded by min/max; prev/next step month / year / page; arrows + Home/End, Enter picks, Escape returns to days · hovered "today" uses text.primary (accent failed 4.5:1 on the hover fill in dark) · fixture variants months, years · research: 1 fetch (MUI, no detail), built the suggested design
- SEARCH FIELDS and DATES · DateRangePicker `b96f378` · same header via lib/Calendar; test + docs
- NAVIGATION · Footer · see git log "Fix round 3: Footer" · the indent came from the host page: the docs site`s `ul` / `h2` rules outranked the single-class resets inside doc sections; title and list resets now use a doubled class (same hardening on Navbar, Sidebar, Breadcrumbs, Pagination lists) · ladder already right (muted = container, default = page)
- SEARCH FIELDS and DATES · Combobox, CommandPalette · no commit · checked against the ladder in the CSS: field, list popover and palette panel are on raised; the palette's search field repeats the raised fill but has its border.strong edge. Left: group dividers in lib/listBox and the palette use border.default, which equals the raised fill in dark (the "Known" note), so they vanish there — shared with Select, not changed
- AI PRIMITIVES and TABLES · Message · see git log "Fix round 3: Message" · user bubble is a bordered container (bg.surface + border.default) instead of accentSubtle (near-invisible in navy dark); actions already full strength in the library — fading to be checked in MessageScroller
- NAVIGATION · Sidebar · see git log "Fix round 3: Sidebar" · active-row count badge is solid neutral (ink) instead of soft accent, readable in dark; panel already on the container step; title/list resets hardened
- NAVIGATION · Breadcrumbs, Pagination · see git log "Fix round 3: Breadcrumbs, Pagination" · checked against the ladder: no fills of their own (Pagination is Buttons), nothing to change; list resets hardened against host `ol` / `ul` styles (Navbar lists too) · not screenshotted, no visual change in review.html
