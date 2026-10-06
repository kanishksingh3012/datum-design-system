import { Sparkline } from "@datum-design/react/charts";
import { ChartDoc } from "./chartDoc";

export default function SparklineDoc() {
  return (
    <ChartDoc id="sparkline" name="Sparkline" dek="A word-sized trend line for stat tiles and table cells: no axes, grid, legend or tooltip."
      demos={[
        ["Example", <div style={{ display: "grid", gap: 16, width: 200 }}>
          <Sparkline data={[12, 14, 11, 18, 21, 19, 24]} label="Signups, last 7 days" />
          <Sparkline data={[30, 28, 31, 26, 22, 24, 19]} label="Churn, last 7 days" color="trend" variant="area" />
        </div>],
      ]}
      props={[["data", "number[]", "—", "Values, oldest first (replaces the shared data/series props)."], ["color", "1–6 | up | down | neutral | trend", "1", "trend: up or down from first to last."], ["variant", "line | area", "line", "Area adds a gradient under the line."], ["endDot", "boolean", "true", "A dot on the latest value, ringed in the surface color."], ["height", "number", "40", "Plot height in px."]]} />
  );
}
