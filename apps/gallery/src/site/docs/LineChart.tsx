import { LineChart } from "@datum-design/react/charts";
import { ChartDoc } from "./chartDoc";
import { devices, months } from "./chartData";

export default function LineChartDoc() {
  return (
    <ChartDoc id="line-chart" name="LineChart" dek="Change over time for one to six series, drawn as 2px lines in the categorical chart tokens."
      demos={[
        ["Example", <LineChart data={months} series={devices} xKey="month" label="Visitors by device" />],
        ["Formatted ticks and an aspect ratio", <LineChart data={months} series={devices.slice(0, 2)} xKey="month" label="Revenue by device" valueFormatter={(v) => `$${v}k`} aspectRatio={3} />],
        ["Dots and a linear curve", <LineChart data={months} series={devices.slice(0, 1)} xKey="month" label="Desktop visitors" dots curve="linear" size="sm" />],
      ]}
      props={[["curve", "monotone | natural | linear | step", "monotone", "How points join."], ["dots", "boolean", "false", "A dot on every point. The hovered point always gets one, ringed in the surface color."], ["grid / xAxis / yAxis / tooltip", "boolean", "true", "Chart furniture: horizontal grid lines only, no axis or tick lines."], ["yAxisWidth", "number | auto", "auto", "As wide as the longest formatted tick."], ["tooltipIndicator", "line | dot", "line", "Marker beside each series in the tooltip."]]} />
  );
}
