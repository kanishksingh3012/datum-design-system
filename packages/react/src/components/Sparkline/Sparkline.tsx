import { forwardRef, useMemo, type HTMLAttributes } from "react";
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
  /** Formats values in the summary and data table. */
  valueFormatter?: ChartFormatter;
}

export type SparklineProps = SparklineOwnProps & Omit<HTMLAttributes<HTMLElement>, "children" | "color">;

/**
 * A word-sized trend line for stat tiles and table cells: no axes, grid,
 * legend or tooltip. The summary and data table still carry the numbers.
 */
export const Sparkline = forwardRef<HTMLElement, SparklineProps>(function Sparkline(
  { data, label, summary, color = 1, variant = "line", height = 40, valueFormatter = defaultFormat, ...rest },
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
  const common = { dataKey: "value", name: label, type: "monotone" as const, stroke, strokeWidth: 2, isAnimationActive: !reduced, "data-check-graphic": label };
  const domain = ["dataMin", "dataMax"] as const;

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
        <RAreaChart data={rows} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={[...domain]} />
          <Area {...common} fill={stroke} fillOpacity={0.16} dot={false} activeDot={false} />
        </RAreaChart>
      ) : (
        <RLineChart data={rows} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <YAxis hide domain={[...domain]} />
          <Line {...common} dot={false} activeDot={false} />
        </RLineChart>
      )}
    </ChartContainer>
  );
});

Sparkline.displayName = "Sparkline";
