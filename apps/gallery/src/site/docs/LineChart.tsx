import { LineChart } from "@datum-design/react/charts";
import { ChartDoc } from "./chartDoc";
import { devices, months } from "./chartData";

export default function LineChartDoc() {
  return (
    <ChartDoc id="line-chart" name="LineChart" dek="Change over time for one to six series, drawn as 2px lines in the categorical chart tokens."
      demos={[
        ["Example", <LineChart data={months} series={devices} xKey="month" label="Visitors by device" />],
        ["Dots and a linear curve", <LineChart data={months} series={devices.slice(0, 1)} xKey="month" label="Desktop visitors" dots curve="linear" size="sm" />],
      ]}
      props={[["curve", "monotone | linear | step", "monotone", "How points join."], ["dots", "boolean", "false", "A dot on every point."], ["grid / xAxis / yAxis / tooltip", "boolean", "true", "Chart furniture."]]} />
  );
}
