import { BarChart } from "@datum-design/react/charts";
import { ChartDoc } from "./chartDoc";
import { devices, months } from "./chartData";

export default function BarChartDoc() {
  return (
    <ChartDoc id="bar-chart" name="BarChart" dek="Compares amounts across categories. Only the data end of a bar is rounded (6px); a stack shares one rounded end and its segments are split by a 2px surface gap."
      demos={[
        ["Grouped", <BarChart data={months} series={devices.slice(0, 2)} xKey="month" label="Visitors by device" />],
        ["Stacked", <BarChart data={months} series={devices} xKey="month" label="Visitors, stacked" stacked />],
        ["Horizontal", <BarChart data={months.slice(0, 4)} series={devices.slice(0, 1)} xKey="month" label="Desktop visitors" orientation="horizontal" size="sm" />],
      ]}
      props={[["stacked", "boolean", "false", "One bar per category, series stacked. The rounded end sits on whichever segment is on top in that category."], ["orientation", "vertical | horizontal", "vertical", "horizontal suits long category names."], ["yAxisWidth", "number | auto", "auto", "As wide as the longest label; category names when horizontal."], ["grid / xAxis / yAxis / tooltip", "boolean", "true", "Chart furniture."]]} />
  );
}
