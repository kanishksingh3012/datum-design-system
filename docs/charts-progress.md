# Charts progress (handoff)

Plan: Recharts wrapped so Datum tokens drive every color, shipped from `@datum-design/react/charts`.

## Milestones
- [x] M1 Data-viz tokens: `65c00fa`
- [x] M2 Checker extension: SVG `<text>` on its fill, `data-check-graphic` marks at 3:1 (see git log "Charts M2")
- [x] M3 Foundation: `@datum-design/react/charts` entry, ChartContainer (summary aria-label, hidden data table, CSS-var series colors, Recharts accessibilityLayer), ChartLegend, ChartTooltip, reduced motion (see git log "Charts M3")
- [ ] M4 Core charts: LineChart, AreaChart, BarChart, DonutChart/PieChart, Sparkline

## Token contrast (scripts/check-chart-tokens.mjs)
orange/light series ≥ 3.56:1 · orange/dark ≥ 3.26:1 · navy/light ≥ 3.25:1 · navy/dark ≥ 3.06:1; axis ≥ 5.21:1; adjacent ΔE ≥ 17.

## Next step
M4: LineChart, AreaChart, BarChart, DonutChart/PieChart, Sparkline — components, tests, fixtures, doc pages, "Charts" nav group.

## Bundle
`dist/index.js` / `index.cjs` contain no Recharts; only `dist/charts.*` import it (externalized). `src/charts.test.ts` guards the source graph.

## Problems found
- Dark surfaces (stone/slate 800) sit so light that series colors in dark mode land above the dataviz lightness band (L 0.67). Accepted; 3:1 wins.
- The check's static preview server sometimes answers a navigation with an error status (ERR_HTTP_RESPONSE_CODE_FAILURE), seen twice mid-run while another session was running its own server. check-combos now retries a navigation up to 3 times.
- Recharts puts data-* on every shape a series draws (an area's tint and line, each bar, each sector), so the checker treats shapes sharing one data-check-graphic value in one svg as one mark, judged on its strongest paint. Donut slices each get their own value via <Cell>.
