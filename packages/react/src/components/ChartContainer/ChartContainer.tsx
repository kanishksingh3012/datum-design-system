import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import styles from "./ChartContainer.module.css";

/**
 * A series color. 1–6 are the categorical `chart.*` tokens, always used in that
 * order; "up" / "down" are trend colors (success / danger); "neutral" is for
 * "Other" or a comparison series.
 */
export type ChartColor = 1 | 2 | 3 | 4 | 5 | 6 | "up" | "down" | "neutral";
export type ChartSize = "sm" | "md" | "lg";
export type ChartDatum = Record<string, string | number | null | undefined>;
export type ChartFormatter = (value: number) => string;

export interface ChartSeries {
  /** The data key this series reads. */
  key: string;
  /** Shown in the legend, tooltip and data table. */
  label: string;
  /** Token color. @default the series' position: 1, 2, 3, … */
  color?: ChartColor;
}

const TREND: Record<string, string> = {
  up: "var(--color-border-success)",
  down: "var(--color-border-danger)",
  neutral: "var(--color-border-strong)",
};

/** The CSS color for a series: a categorical token by position unless `color` says otherwise. */
export function seriesColor(series: ChartSeries, index: number): string {
  const c = series.color ?? index + 1;
  if (typeof c === "string") return TREND[c];
  // Colors are never cycled: a 7th series has no categorical slot. Fold extras into "Other".
  if (c > 6) return TREND.neutral;
  return `var(--color-chart-${c})`;
}

/** CSS custom property that carries a series' color inside a ChartContainer. */
export const seriesVar = (key: string) => `var(--series-${key.replace(/[^\w-]/g, "_")})`;

export const CHART_HEIGHT: Record<ChartSize, number> = { sm: 160, md: 240, lg: 320 };

export const defaultFormat: ChartFormatter = (v) => v.toLocaleString();

/** True when the user asks for reduced motion; charts then draw without animating. */
export function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && !!window.matchMedia?.(query).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

interface ChartContextValue {
  series: ChartSeries[];
  xKey?: string;
  valueFormatter: ChartFormatter;
  xFormatter: (value: unknown) => string;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export function useChart() {
  const ctx = useContext(ChartContext);
  if (!ctx) throw new Error("Chart parts must be used inside a ChartContainer");
  return ctx;
}

/** A short spoken summary: the series and the range each one covers. */
function summarize(label: string, data: ChartDatum[], series: ChartSeries[], xKey: string | undefined, fmt: ChartFormatter, xFmt: (v: unknown) => string) {
  const parts = [label];
  if (xKey && data.length > 1) parts.push(`${xFmt(data[0][xKey])} to ${xFmt(data[data.length - 1][xKey])}`);
  for (const s of series) {
    const values = data.map((d) => d[s.key]).filter((v): v is number => typeof v === "number");
    if (!values.length) continue;
    const min = Math.min(...values);
    const max = Math.max(...values);
    parts.push(min === max ? `${s.label} ${fmt(min)}` : `${s.label} from ${fmt(min)} to ${fmt(max)}`);
  }
  return parts.join(". ") + ".";
}

export interface ChartContainerOwnProps {
  /** Rows to plot. */
  data: ChartDatum[];
  /** One entry per plotted value, in legend order. */
  series: ChartSeries[];
  /** The category key (x axis, table row header). */
  xKey?: string;
  /** Accessible name of the chart and the data table's caption. */
  label: string;
  /** Replaces the generated spoken summary (label, range, each series' min and max). */
  summary?: string;
  /** Formats values in the axis, tooltip, table and summary. */
  valueFormatter?: ChartFormatter;
  /** Formats the category (x) values. */
  xFormatter?: (value: unknown) => string;
  /** Plot height: 160 / 240 / 320px. Ignored when `height` is set. @default "md" */
  size?: ChartSize;
  /** Exact plot height in px (Sparkline). */
  height?: number;
  /** Show the legend. @default true with two or more series */
  legend?: boolean;
  /** The Recharts chart. It is sized to the container. */
  children: ReactNode;
  /** Rows for the data table and summary when they differ from the plotted series (a donut's slices). */
  tableData?: ChartDatum[];
  /** Columns for the data table and summary, with `tableData`. */
  tableSeries?: ChartSeries[];
}

/** Props every cartesian chart (line, area, bar) shares on top of the container's. */
export interface CartesianChartOwnProps extends Omit<ChartContainerOwnProps, "children" | "tableData" | "tableSeries"> {
  /** Horizontal grid lines. @default true */
  grid?: boolean;
  /** Category axis. @default true */
  xAxis?: boolean;
  /** Value axis. @default true */
  yAxis?: boolean;
  /** Value axis width in px; widen it for long formatted values. @default 48 */
  yAxisWidth?: number;
  /** Hover / keyboard tooltip. @default true */
  tooltip?: boolean;
  /** Shows the tooltip at this row on first render (docs, screenshots). */
  defaultTooltipIndex?: number;
}

export const CHART_MARGIN = { top: 8, right: 8, bottom: 0, left: 0 };

export type ChartContainerProps = ChartContainerOwnProps & Omit<HTMLAttributes<HTMLElement>, "children">;

/**
 * Wraps a Recharts chart: feeds series colors in as CSS variables, sizes it
 * responsively, and renders what a screen reader needs: a summary as the
 * figure's name and a visually hidden data table.
 */
export const ChartContainer = forwardRef<HTMLElement, ChartContainerProps>(function ChartContainer(
  { data, series, xKey, label, summary, valueFormatter = defaultFormat, xFormatter = String, size = "md", height, legend, children, tableData, tableSeries, className, style, ...rest },
  ref
) {
  const captionId = useId();
  const vars = useMemo(() => {
    const out: Record<string, string> = {};
    series.forEach((s, i) => (out[`--series-${s.key.replace(/[^\w-]/g, "_")}`] = seriesColor(s, i)));
    return out;
  }, [series]);
  const ctx = useMemo(() => ({ series, xKey, valueFormatter, xFormatter }), [series, xKey, valueFormatter, xFormatter]);
  const rows = tableData ?? data;
  const columns = tableSeries ?? series;
  const spoken = summary ?? summarize(label, rows, columns, xKey, valueFormatter, xFormatter);
  const showLegend = legend ?? series.length > 1;

  return (
    <ChartContext.Provider value={ctx}>
      <figure
        ref={ref}
        className={[styles.root, className].filter(Boolean).join(" ")}
        style={{ ...vars, ...style } as CSSProperties}
        aria-label={spoken}
        data-size={size}
        {...rest}
      >
        <div className={styles.plot} style={{ height: height ?? CHART_HEIGHT[size] }}>
          <ResponsiveContainer width="100%" height="100%">
            {children as never}
          </ResponsiveContainer>
        </div>
        {showLegend && <ChartLegend />}
        <table className={styles.srOnly} aria-labelledby={captionId}>
          <caption id={captionId}>{label}</caption>
          <thead>
            <tr>
              {xKey && <th scope="col">{xKey}</th>}
              {columns.map((s) => (
                <th key={s.key} scope="col">{s.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((d, r) => (
              <tr key={r}>
                {xKey && <th scope="row">{xFormatter(d[xKey])}</th>}
                {columns.map((s) => (
                  <td key={s.key}>{typeof d[s.key] === "number" ? valueFormatter(d[s.key] as number) : "—"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
    </ChartContext.Provider>
  );
});

ChartContainer.displayName = "ChartContainer";

/** Swatch + label per series, in text tokens: identity is never color alone. */
export function ChartLegend({ className }: { className?: string }) {
  const { series } = useChart();
  return (
    <ul className={[styles.legend, className].filter(Boolean).join(" ")} aria-hidden="true">
      {series.map((s) => (
        <li key={s.key}>
          <span className={styles.swatch} style={{ background: seriesVar(s.key) }} />
          {s.label}
        </li>
      ))}
    </ul>
  );
}

interface TooltipContentProps {
  active?: boolean;
  label?: unknown;
  payload?: ReadonlyArray<{ dataKey?: unknown; value?: unknown; name?: unknown; payload?: ChartDatum }>;
}

function ChartTooltipContent({ active, label, payload }: TooltipContentProps) {
  const { series, xKey, valueFormatter, xFormatter } = useChart();
  if (!active || !payload?.length) return null;
  const heading = xKey ? payload[0]?.payload?.[xKey] ?? label : null;
  return (
    <div className={styles.tooltip}>
      {heading != null && heading !== "" && <div className={styles.tooltipLabel}>{xKey ? xFormatter(heading) : String(heading)}</div>}
      <ul>
        {payload.map((p) => {
          const s = series.find((x) => x.key === p.dataKey) ?? series.find((x) => x.key === p.name);
          const key = s?.key ?? String(p.name ?? p.dataKey);
          return (
            <li key={key}>
              <span className={styles.swatch} style={{ background: seriesVar(key) }} />
              <span className={styles.tooltipName}>{s?.label ?? String(p.name ?? "")}</span>
              <span className={styles.tooltipValue}>{typeof p.value === "number" ? valueFormatter(p.value) : String(p.value ?? "—")}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const CURSOR = {
  line: { stroke: "var(--color-border-strong)", strokeWidth: 1 },
  band: { fill: "var(--color-chart-grid)", fillOpacity: 0.5 },
};

export interface ChartTooltipProps {
  /** A vertical line (line / area), a band behind the category (bar), or none (donut). @default "line" */
  cursor?: "line" | "band" | false;
  /** Shows the tooltip at this row on first render. */
  defaultIndex?: number;
}

/** Recharts Tooltip styled with Datum tokens; values use the container's formatter. */
export function ChartTooltip({ cursor = "line", defaultIndex }: ChartTooltipProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <Tooltip
      content={<ChartTooltipContent />}
      cursor={cursor ? CURSOR[cursor] : false}
      defaultIndex={defaultIndex}
      isAnimationActive={!reduced}
      wrapperStyle={{ outline: "none" }}
    />
  );
}

/** Shared axis styling: recessive lines, tick labels in the axis token. */
export const axisProps = {
  tick: { fill: "var(--color-chart-axis)", fontSize: 12 },
  tickLine: false,
  axisLine: false,
  tickMargin: 8,
} as const;

export const gridProps = { stroke: "var(--color-chart-grid)", strokeDasharray: "0", vertical: false } as const;

/**
 * Grid, axes and tooltip for a cartesian chart, from the shared props.
 * `horizontal` swaps the axes (bars that run left to right).
 */
export function cartesianScaffold(
  p: Pick<CartesianChartOwnProps, "grid" | "xAxis" | "yAxis" | "yAxisWidth" | "tooltip" | "defaultTooltipIndex" | "xKey" | "valueFormatter" | "xFormatter">,
  { cursor = "line", horizontal = false }: { cursor?: "line" | "band"; horizontal?: boolean } = {}
) {
  const { grid = true, xAxis = true, yAxis = true, yAxisWidth = 48, tooltip = true, defaultTooltipIndex, xKey, valueFormatter = defaultFormat, xFormatter = String } = p;
  const category = { dataKey: xKey, tickFormatter: (v: unknown) => xFormatter(v), minTickGap: 16 };
  const value = { tickFormatter: (v: number) => valueFormatter(v) };
  return [
    grid && <CartesianGrid key="grid" {...gridProps} vertical={horizontal} horizontal={!horizontal} />,
    xAxis && xKey && (horizontal
      ? <YAxis key="cat" type="category" width={yAxisWidth} {...axisProps} {...category} />
      : <XAxis key="cat" {...axisProps} {...category} />),
    yAxis && (horizontal
      ? <XAxis key="val" type="number" {...axisProps} {...value} />
      : <YAxis key="val" width={yAxisWidth} {...axisProps} {...value} />),
    tooltip && <ChartTooltip key="tip" cursor={cursor} defaultIndex={defaultTooltipIndex} />,
  ];
}
