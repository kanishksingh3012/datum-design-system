import { forwardRef, useId, useMemo, type HTMLAttributes } from "react";
import { Area, Line, AreaChart as RAreaChart, LineChart as RLineChart, YAxis } from "recharts";
import {
  ChartContainer,
  defaultFormat,
  usePrefersReducedMotion,
  type ChartColor,
  type ChartFormatter,
} from "../ChartContainer/ChartContainer";

export interface SparklineOwnProps {
  /** The values, oldest first. */
  data: number[];
  /** Accessible name, e.g. "Revenue, last 30 days". */
  label: string;
  /** Replaces the generated summary (start, end, low, high). */
  summary?: string;
  /** Token color. "trend" picks up (success) or down (danger) from the first and last values. @default 1 */
  color?: ChartColor | "trend";
  /** A line, or a line with a tint under it. @default "line" */
  variant?: "line" | "area";
  /** Plot height in px. @default 40 */
  height?: number;
  /** A dot on the latest value, ringed in the surface color. @default true */
  endDot?: boolean;
  /** Formats values in the summary and data table. */
  valueFormatter?: ChartFormatter;
}

export type SparklineProps = SparklineOwnProps & Omit<HTMLAttributes<HTMLElement>, "children" | "color">;

/**
 * A word-sized trend line for stat tiles and table cells: no axes, grid,
 * legend or tooltip. The summary and data table still carry the numbers.
 */
export const Sparkline = forwardRef<HTMLElement, SparklineProps>(function Sparkline(
  { data, label, summary, color = 1, variant = "line", height = 40, endDot = true, valueFormatter = defaultFormat, ...rest },
  ref
) {
  const reduced = usePrefersReducedMotion();
  const rows = useMemo(() => data.map((value, i) => ({ point: i + 1, value })), [data]);
  const first = data[0];
  const last = data[data.length - 1];
  const resolved: ChartColor = color === "trend" ? (last >= first ? "up" : "down") : color;
  const series = useMemo(() => [{ key: "value", label, color: resolved }], [label, resolved]);
  const spoken =
    summary ??
    (data.length
      ? `${label}. Starts at ${valueFormatter(first)}, ends at ${valueFormatter(last)}. Low ${valueFormatter(Math.min(...data))}, high ${valueFormatter(Math.max(...data))}.`
      : `${label}. No data.`);
  const stroke = "var(--series-value)";
  const gradientId = `${useId().replace(/:/g, "")}-spark`;
  // only the latest point gets a dot
  const dot = endDot
    ? ({ cx, cy, index }: { cx?: number; cy?: number; index?: number }) =>
        index === rows.length - 1 && cx != null && cy != null ? (
          <circle key="end" cx={cx} cy={cy} r={3.5} fill={stroke} stroke="var(--chart-surface)" strokeWidth={2} />
        ) : (
          <g key={index} />
        )
    : false;
  const common = { dataKey: "value", name: label, type: "monotone" as const, stroke, strokeWidth: 2, strokeLinecap: "round" as const, dot, activeDot: false, isAnimationActive: !reduced, "data-check-graphic": label };
  const domain = ["dataMin", "dataMax"] as const;
  const margin = { top: 5, right: 6, bottom: 5, left: 2 };

  return (
    <ChartContainer
      ref={ref}
      data={rows}
      series={series}
      xKey="point"
      label={label}
      summary={spoken}
      height={height}
      legend={false}
      valueFormatter={valueFormatter}
      data-sparkline=""
      {...rest}
    >
      {variant === "area" ? (
        <RAreaChart data={rows} margin={margin}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.4} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis hide domain={[...domain]} />
          <Area {...common} fill={`url(#${gradientId})`} fillOpacity={1} />
        </RAreaChart>
      ) : (
        <RLineChart data={rows} margin={margin}>
          <YAxis hide domain={[...domain]} />
          <Line {...common} />
        </RLineChart>
      )}
    </ChartContainer>
  );
});

Sparkline.displayName = "Sparkline";
