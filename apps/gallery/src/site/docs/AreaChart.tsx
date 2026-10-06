import { AreaChart } from "@datum-design/react/charts";
import { ChartDoc } from "./chartDoc";
import { devices, months } from "./chartData";

export default function AreaChartDoc() {
  return (
    <ChartDoc id="area-chart" name="AreaChart" dek="Volume over time. The line carries the series; the fill under it is a vertical gradient of the same token that fades into the surface."
      demos={[
        ["Example", <AreaChart data={months} series={devices.slice(0, 2)} xKey="month" label="Visitors" />],
        ["Stacked", <AreaChart data={months} series={devices} xKey="month" label="Visitors, stacked" stacked />],
      ]}
      props={[["stacked", "boolean", "false", "The top edge is the total. Bands keep some color at the bottom so they stay distinct."], ["curve", "monotone | natural | linear | step", "monotone", "How points join."], ["grid / xAxis / yAxis / tooltip", "boolean", "true", "Chart furniture."], ["tooltipIndicator", "dot | line", "dot", "Marker beside each series in the tooltip."]]} />
  );
}
