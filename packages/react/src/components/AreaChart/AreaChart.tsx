import { forwardRef, type HTMLAttributes } from "react";
import { Area, AreaChart as RAreaChart } from "recharts";
import {
  CHART_MARGIN,
  ChartContainer,
  cartesianScaffold,
  seriesVar,
  usePrefersReducedMotion,
  type CartesianChartOwnProps,
} from "../ChartContainer/ChartContainer";
import type { ChartCurve } from "../LineChart/LineChart";

export interface AreaChartOwnProps extends CartesianChartOwnProps {
  /** Stack the series so the top edge is their total. @default false */
  stacked?: boolean;
  /** How points join. @default "monotone" */
  curve?: ChartCurve;
}

export type AreaChartProps = AreaChartOwnProps & Omit<HTMLAttributes<HTMLElement>, "children">;

/**
 * Volume over time. The 2px line carries the series' identity; the fill
 * under it is a translucent tint of the same token.
 */
export const AreaChart = forwardRef<HTMLElement, AreaChartProps>(function AreaChart(
  { data, series, stacked = false, curve = "monotone", grid, xAxis, yAxis, yAxisWidth, tooltip, tooltipIndicator, defaultTooltipIndex, ...rest },
  ref
) {
  const reduced = usePrefersReducedMotion();
  return (
    <ChartContainer ref={ref} data={data} series={series} {...rest}>
      <RAreaChart data={data} margin={CHART_MARGIN} accessibilityLayer>
        {cartesianScaffold({ grid, xAxis, yAxis, yAxisWidth, tooltip, tooltipIndicator, defaultTooltipIndex, ...rest })}
        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type={curve}
            stackId={stacked ? "stack" : undefined}
            stroke={seriesVar(s.key)}
            strokeWidth={2}
            fill={seriesVar(s.key)}
            fillOpacity={stacked ? 0.32 : 0.16}
            activeDot={{ r: 5, fill: seriesVar(s.key), stroke: "var(--chart-surface)", strokeWidth: 2 }}
            isAnimationActive={!reduced}
            data-check-graphic={s.label}
          />
        ))}
      </RAreaChart>
    </ChartContainer>
  );
});

AreaChart.displayName = "AreaChart";
