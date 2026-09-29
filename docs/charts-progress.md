# Charts progress (handoff)

Plan: Recharts wrapped so Datum tokens drive every color, shipped from `@datum-design/react/charts`.

## Milestones
- [x] M1 Data-viz tokens: `65c00fa`
- [x] M2 Checker extension: SVG `<text>` on its fill, `data-check-graphic` marks at 3:1 (see git log "Charts M2")
- [x] M3 Foundation: `@datum-design/react/charts` entry, ChartContainer (summary aria-label, hidden data table, CSS-var series colors, Recharts accessibilityLayer), ChartLegend, ChartTooltip, reduced motion (see git log "Charts M3")
- [x] M4 charts: LineChart, AreaChart, BarChart (grouped/stacked/horizontal), DonutChart/PieChart, Sparkline — tests + fixtures `3141dfd`; doc pages + "Charts" nav group (see git log "Charts M4: docs")

## Token contrast (scripts/check-chart-tokens.mjs)
orange/light series ≥ 3.56:1 · orange/dark ≥ 3.26:1 · navy/light ≥ 3.25:1 · navy/dark ≥ 3.06:1; axis ≥ 5.21:1; adjacent ΔE ≥ 17.

## Next step
Charts milestone done. Follow-ups: a heatmap using chart.seq.1–5; hand-written Code snippets for chart demos; check the /docs/components/*-chart pages on the deployed site.

## Final state
npm run check: 784 ✓ lines, 0 failures. React tests: 74 files, 419 passed. npm run build + gallery build OK.

## Bundle
`dist/index.js` / `index.cjs` contain no Recharts; only `dist/charts.*` import it (externalized). `src/charts.test.ts` guards the source graph.

## Problems found
- Dark surfaces (stone/slate 800) sit so light that series colors in dark mode land above the dataviz lightness band (L 0.67). Accepted; 3:1 wins.
- The check's static preview server sometimes answers a navigation with an error status (ERR_HTTP_RESPONSE_CODE_FAILURE), seen twice mid-run while another session was running its own server. check-combos now retries a navigation up to 3 times.
- Recharts puts data-* on every shape a series draws (an area's tint and line, each bar, each sector), so the checker treats shapes sharing one data-check-graphic value in one svg as one mark, judged on its strongest paint. Donut slices each get their own value via <Cell>.
- Recharts animates bars/sectors by replacing nodes; check-combos waits for a chart fixture to be still for 300ms before measuring. Tick text needs real text measurement, so jsdom tests do not assert tick labels (the checker measures them).
