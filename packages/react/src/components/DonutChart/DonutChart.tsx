import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from "react";
import { Cell, Label, Pie, PieChart as RPieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  defaultFormat,
  seriesVar,
  usePrefersReducedMotion,
  type ChartContainerOwnProps,
  type ChartDatum,
} from "../ChartContainer/ChartContainer";

export interface DonutChartOwnProps extends Omit<ChartContainerOwnProps, "children" | "xKey" | "tableData" | "tableSeries" | "series"> {
  /** One row per slice. */
  data: ChartDatum[];
  /** The key naming each slice; it must match a `series` key. */
  nameKey: string;
  /** The key holding each slice's amount. */
  valueKey: string;
  /** One entry per slice (key = the slice's `nameKey` value), in legend order. Six at most: fold the rest into "Other". */
  series: ChartContainerOwnProps["series"];
  /** "pie" fills the middle. @default "donut" */
  variant?: "donut" | "pie";
  /** Text in the middle of a donut, usually the total. Pass `null` for none. @default the formatted total */
  centerLabel?: ReactNode;
  /** A short caption under the center label, e.g. "Visitors". */
  centerCaption?: string;
  /** Hover / keyboard tooltip. @default true */
  tooltip?: boolean;
  /** Data table column headers. @default nameKey / valueKey */
  nameLabel?: string;
  valueLabel?: string;
}

export type DonutChartProps = DonutChartOwnProps & Omit<HTMLAttributes<HTMLElement>, "children">;

/**
 * Part-to-whole for a handful of slices. Slices are separated by a small
 * angle and rounded corners, never a stroke, so the chart looks right on any
 * surface. The legend is always shown, so identity is never color alone.
 */
export const DonutChart = forwardRef<HTMLElement, DonutChartProps>(function DonutChart(
  { data, nameKey, valueKey, nameLabel = nameKey, valueLabel = valueKey, series, variant = "donut", centerLabel, centerCaption, tooltip = true, valueFormatter = defaultFormat, label, summary, legend = true, ...rest },
  ref
) {
  const reduced = usePrefersReducedMotion();
  const total = data.reduce((sum, d) => sum + (typeof d[valueKey] === "number" ? (d[valueKey] as number) : 0), 0);
  const pct = (v: number) => (total ? `${Math.round((v / total) * 100)}%` : "0%");
  const spoken = useMemo(
    () =>
      summary ??
      `${label}. ${series
        .map((s) => {
          const v = data.find((d) => d[nameKey] === s.key)?.[valueKey];
          return typeof v === "number" ? `${s.label} ${valueFormatter(v)} (${pct(v)})` : null;
        })
        .filter(Boolean)
        .join(", ")}.`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [summary, label, series, data, nameKey, valueKey, valueFormatter, total]
  );
  const center = centerLabel === undefined ? valueFormatter(total) : centerLabel;
  const tableData = data.map((d) => ({ ...d, [nameKey]: series.find((s) => s.key === d[nameKey])?.label ?? d[nameKey] }));

  return (
    <ChartContainer
      ref={ref}
      data={data}
      series={series}
      label={label}
      summary={spoken}
      legend={legend}
      valueFormatter={valueFormatter}
      tableData={tableData}
      tableSeries={[{ key: nameKey, label: nameLabel }, { key: valueKey, label: valueLabel }]}
      xKey={undefined}
      data-variant={variant}
      {...rest}
    >
      <RPieChart accessibilityLayer>
        {tooltip && <ChartTooltip cursor={false} />}
        <Pie
          data={data}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius={variant === "donut" ? "62%" : 0}
          outerRadius="92%"
          stroke="none"
          paddingAngle={variant === "donut" ? 2 : 1}
          cornerRadius={variant === "donut" ? 4 : 2}
          startAngle={90}
          endAngle={-270}
          isAnimationActive={!reduced}
        >
          {data.map((d) => {
            const s = series.find((x) => x.key === d[nameKey]);
            return <Cell key={String(d[nameKey])} fill={seriesVar(String(d[nameKey]))} data-check-graphic={s?.label ?? String(d[nameKey])} />;
          })}
          {variant === "donut" && center != null && center !== "" && (
            <Label
              position="center"
              content={({ viewBox }) => {
                // polar view boxes carry cx/cy; a cartesian one is the plot's box
                const box = (viewBox ?? {}) as { cx?: number; cy?: number; x?: number; y?: number; width?: number; height?: number };
                const cx = box.cx ?? (box.x ?? 0) + (box.width ?? 0) / 2;
                const cy = box.cy ?? (box.y ?? 0) + (box.height ?? 0) / 2;
                return (
                  <text x={cx} y={cy} textAnchor="middle" fill="var(--color-text-primary)" data-center="">
                    <tspan x={cx} dy={centerCaption ? "-0.1em" : "0.35em"} fill="var(--color-text-primary)" fontSize={24} fontWeight={700}>{center}</tspan>
                    {centerCaption && <tspan x={cx} dy="1.6em" fill="var(--color-text-secondary)" fontSize={12}>{centerCaption}</tspan>}
                  </text>
                );
              }}
            />
          )}
        </Pie>
      </RPieChart>
    </ChartContainer>
  );
});

DonutChart.displayName = "DonutChart";

/** A DonutChart with the middle filled. */
export const PieChart = forwardRef<HTMLElement, Omit<DonutChartProps, "variant" | "centerLabel">>(function PieChart(props, ref) {
  return <DonutChart ref={ref} {...props} variant="pie" />;
});

PieChart.displayName = "PieChart";
