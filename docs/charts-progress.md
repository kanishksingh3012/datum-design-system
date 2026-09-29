# Charts progress (handoff)

Plan: Recharts wrapped so Datum tokens drive every color, shipped from `@datum-design/react/charts`.

## Milestones
- [x] M1 Data-viz tokens: (this commit, see git log "Charts M1")
- [ ] M2 Checker extension (SVG `<text>` fill, `data-check-graphic` marks)
- [ ] M3 Foundation (charts subpath, ChartContainer, Legend, ChartTooltip)
- [ ] M4 Core charts: LineChart, AreaChart, BarChart, DonutChart/PieChart, Sparkline

## Token contrast (scripts/check-chart-tokens.mjs)
orange/light series ≥ 3.56:1 · orange/dark ≥ 3.26:1 · navy/light ≥ 3.25:1 · navy/dark ≥ 3.06:1; axis ≥ 5.21:1; adjacent ΔE ≥ 17.

## Next step
M2: extend scripts/check-combos.mjs.

## Problems found
- Dark surfaces (stone/slate 800) sit so light that series colors in dark mode land above the dataviz lightness band (L 0.67). Accepted; 3:1 wins.
