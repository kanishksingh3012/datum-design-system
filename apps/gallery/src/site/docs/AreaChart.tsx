import type { CSSProperties } from "react";
import { Card, CardBody, CardFooter, CardHeader, Heading, Stack, Text } from "@datum-design/react";
import { AreaChart } from "@datum-design/react/charts";
import { TrendingUp } from "lucide-react";
import { ChartDoc } from "./chartDoc";
import { devices, months } from "./chartData";

export default function AreaChartDoc() {
  return (
    <ChartDoc id="area-chart" name="AreaChart" dek="Volume over time. The line carries the series; the fill under it is a vertical gradient of the same token that fades into the surface."
      demos={[
        ["Example", <AreaChart data={months} series={devices.slice(0, 2)} xKey="month" label="Visitors" />],
        ["Stacked", <AreaChart data={months} series={devices} xKey="month" label="Visitors, stacked" stacked />],
        // The chart card pattern: title and description, the chart, then a one-line trend.
        // --chart-surface tells the chart it sits on the card's fill, not the page.
        ["Chart card", <Card style={{ width: "100%", "--chart-surface": "var(--color-bg-surface)" } as CSSProperties}>
          <CardHeader>
            <Stack gap="xs">
              <Heading as="h3" size="sm">Visitors</Heading>
              <Text variant="body-sm" tone="secondary">January to June, by device</Text>
            </Stack>
          </CardHeader>
          <CardBody>
            <AreaChart data={months} series={devices.slice(0, 2)} xKey="month" label="Visitors by device, January to June" />
          </CardBody>
          <CardFooter>
            <Stack gap="xs">
              <Stack direction="horizontal" gap="sm" align="center">
                <Text variant="label">Up 5.2% this month</Text>
                <TrendingUp size={16} aria-hidden="true" />
              </Stack>
              <Text variant="body-sm" tone="secondary">Compared with the previous six months</Text>
            </Stack>
          </CardFooter>
        </Card>],
      ]}
      props={[["stacked", "boolean", "false", "The top edge is the total. Bands keep some color at the bottom so they stay distinct."], ["curve", "monotone | natural | linear | step", "monotone", "How points join."], ["grid / xAxis / yAxis / tooltip", "boolean", "true", "Chart furniture."], ["tooltipIndicator", "dot | line", "dot", "Marker beside each series in the tooltip."]]} />
  );
}
