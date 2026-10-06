import { forwardRef, useId, type HTMLAttributes } from "react";
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
 * under it is a vertical gradient of the same token, fading into the surface.
 */
export const AreaChart = forwardRef<HTMLElement, AreaChartProps>(function AreaChart(
  { data, series, stacked = false, curve = "monotone", grid, xAxis, yAxis, yAxisWidth, tooltip, tooltipIndicator, defaultTooltipIndex, ...rest },
  ref
) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, "");
  const gradient = (key: string) => `${uid}-${key.replace(/[^\w-]/g, "_")}`;
  // stacked bands sit on each other, so they keep some color at the bottom to stay distinct
  const [top, bottom] = stacked ? [0.5, 0.15] : [0.4, 0];
  return (
    <ChartContainer ref={ref} data={data} series={series} {...rest}>
      <RAreaChart data={data} margin={CHART_MARGIN} accessibilityLayer>
        {cartesianScaffold({ grid, xAxis, yAxis, yAxisWidth, tooltip, tooltipIndicator, defaultTooltipIndex, ...rest })}
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={gradient(s.key)} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={seriesVar(s.key)} stopOpacity={top} />
              <stop offset="100%" stopColor={seriesVar(s.key)} stopOpacity={bottom} />
            </linearGradient>
          ))}
        </defs>
        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type={curve}
            stackId={stacked ? "stack" : undefined}
            stroke={seriesVar(s.key)}
            strokeWidth={2}
            strokeLinecap="round"
            fill={`url(#${gradient(s.key)})`}
            fillOpacity={1}
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
