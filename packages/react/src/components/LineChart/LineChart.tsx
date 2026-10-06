import { forwardRef, type HTMLAttributes } from "react";
import { Line, LineChart as RLineChart } from "recharts";
import {
  CHART_MARGIN,
  ChartContainer,
  cartesianScaffold,
  seriesVar,
  usePrefersReducedMotion,
  type CartesianChartOwnProps,
} from "../ChartContainer/ChartContainer";

export type ChartCurve = "monotone" | "natural" | "linear" | "step";

export interface LineChartOwnProps extends CartesianChartOwnProps {
  /** How points join. @default "monotone" */
  curve?: ChartCurve;
  /** A dot on every point (few points, or uneven spacing). The hovered point always gets one. @default false */
  dots?: boolean;
}

export type LineChartProps = LineChartOwnProps & Omit<HTMLAttributes<HTMLElement>, "children">;

/** Change over time for one to six series: 2px lines in the categorical tokens. */
export const LineChart = forwardRef<HTMLElement, LineChartProps>(function LineChart(
  { data, series, curve = "monotone", dots = false, grid, xAxis, yAxis, yAxisWidth, tooltip, tooltipIndicator = "line", defaultTooltipIndex, ...rest },
  ref
) {
  const reduced = usePrefersReducedMotion();
  return (
    <ChartContainer ref={ref} data={data} series={series} {...rest}>
      <RLineChart data={data} margin={CHART_MARGIN} accessibilityLayer>
        {cartesianScaffold({ grid, xAxis, yAxis, yAxisWidth, tooltip, tooltipIndicator, defaultTooltipIndex, ...rest })}
        {series.map((s) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type={curve}
            stroke={seriesVar(s.key)}
            strokeWidth={2}
            strokeLinecap="round"
            dot={dots ? { r: 4, fill: seriesVar(s.key), stroke: "var(--chart-surface)", strokeWidth: 2 } : false}
            activeDot={{ r: 5, fill: seriesVar(s.key), stroke: "var(--chart-surface)", strokeWidth: 2 }}
            isAnimationActive={!reduced}
            data-check-graphic={s.label}
          />
        ))}
      </RLineChart>
    </ChartContainer>
  );
});

LineChart.displayName = "LineChart";
