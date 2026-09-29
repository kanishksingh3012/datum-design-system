import { forwardRef, type HTMLAttributes } from "react";
import { Bar, BarChart as RBarChart } from "recharts";
import {
  CHART_MARGIN,
  ChartContainer,
  cartesianScaffold,
  seriesVar,
  usePrefersReducedMotion,
  type CartesianChartOwnProps,
} from "../ChartContainer/ChartContainer";

export type BarChartOrientation = "vertical" | "horizontal";

export interface BarChartOwnProps extends CartesianChartOwnProps {
  /** Stack the series in one bar per category instead of side by side. @default false */
  stacked?: boolean;
  /** "horizontal" runs bars left to right, for long category names. @default "vertical" */
  orientation?: BarChartOrientation;
}

export type BarChartProps = BarChartOwnProps & Omit<HTMLAttributes<HTMLElement>, "children">;

const R = 4;

/**
 * Compares amounts across categories: grouped by default, `stacked` for
 * part-to-whole, `orientation="horizontal"` for long labels. Only the data end
 * of a bar is rounded; stacked segments are split by a 2px surface gap.
 */
export const BarChart = forwardRef<HTMLElement, BarChartProps>(function BarChart(
  { data, series, stacked = false, orientation = "vertical", grid, xAxis, yAxis, yAxisWidth, tooltip, defaultTooltipIndex, ...rest },
  ref
) {
  const reduced = usePrefersReducedMotion();
  const horizontal = orientation === "horizontal";
  const end: [number, number, number, number] = horizontal ? [0, R, R, 0] : [R, R, 0, 0];
  return (
    <ChartContainer ref={ref} data={data} series={series} data-orientation={orientation} {...rest}>
      <RBarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={CHART_MARGIN}
        barGap={2}
        barCategoryGap="24%"
        accessibilityLayer
      >
        {cartesianScaffold({ grid, xAxis, yAxis, yAxisWidth: yAxisWidth ?? (horizontal ? 96 : 48), tooltip, defaultTooltipIndex, ...rest }, { cursor: "band", horizontal })}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={seriesVar(s.key)}
            stackId={stacked ? "stack" : undefined}
            // stacked: only the last segment reaches the data end
            radius={!stacked || i === series.length - 1 ? end : 0}
            stroke={stacked ? "var(--chart-surface)" : undefined}
            strokeWidth={stacked ? 2 : 0}
            maxBarSize={48}
            isAnimationActive={!reduced}
            data-check-graphic={s.label}
          />
        ))}
      </RBarChart>
    </ChartContainer>
  );
});

BarChart.displayName = "BarChart";
