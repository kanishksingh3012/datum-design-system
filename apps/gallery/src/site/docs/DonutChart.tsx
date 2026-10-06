import { DonutChart, PieChart } from "@datum-design/react/charts";
import { ChartDoc } from "./chartDoc";
import { browserSeries, browsers } from "./chartData";

export default function DonutChartDoc() {
  return (
    <ChartDoc id="donut-chart" name="DonutChart" dek="Part-to-whole for a handful of slices, with the total and a caption in the middle. Slices are separated by a small angle and rounded corners, never a stroke. PieChart fills the middle."
      demos={[
        ["Example", <DonutChart data={browsers} series={browserSeries} nameKey="browser" valueKey="visitors" nameLabel="Browser" valueLabel="Visitors" label="Visitors by browser" centerCaption="Visitors" />],
        ["PieChart", <PieChart data={browsers} series={browserSeries} nameKey="browser" valueKey="visitors" label="Visitors by browser" size="sm" />],
      ]}
      props={[["nameKey / valueKey", "string", "—", "Which keys name and size each slice; series keys match nameKey values."], ["centerLabel", "ReactNode", "the total", "Text in the middle; null for none."], ["centerCaption", "string", "—", "A short caption under the center label."], ["nameLabel / valueLabel", "string", "the keys", "Data table headers."]]} />
  );
}
