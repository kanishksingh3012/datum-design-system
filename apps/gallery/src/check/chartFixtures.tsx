import type { CSSProperties, ReactNode } from "react";
import { AreaChart, BarChart, DonutChart, LineChart, PieChart, Sparkline } from "@datum-design/react/charts";

// Six series so every categorical token is measured against page and surface in every combo.
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const six = [
  { key: "search", label: "Search" },
  { key: "direct", label: "Direct" },
  { key: "social", label: "Social" },
  { key: "email", label: "Email" },
  { key: "referral", label: "Referral" },
  { key: "ads", label: "Ads" },
];
const traffic = months.map((month, i) => ({
  month,
  search: 420 + i * 30, direct: 360 + ((i * 47) % 90), social: 300 - i * 12,
  email: 220 + ((i * 31) % 60), referral: 160 + i * 18, ads: 100 + ((i * 53) % 80),
}));
const two = six.slice(0, 2);
const three = six.slice(0, 3);
const regions = [
  { region: "North America", q1: 42, q2: 51, q3: 38 },
  { region: "Europe", q1: 35, q2: 30, q3: 44 },
  { region: "Asia Pacific", q1: 28, q2: 36, q3: 40 },
  { region: "Latin America", q1: 14, q2: 18, q3: 21 },
];
const quarters = [
  { key: "q1", label: "Q1" },
  { key: "q2", label: "Q2" },
  { key: "q3", label: "Q3" },
];
const browsers = [
  { browser: "chrome", visitors: 4200 },
  { browser: "safari", visitors: 2600 },
  { browser: "edge", visitors: 1100 },
  { browser: "firefox", visitors: 700 },
  { browser: "other", visitors: 400 },
];
const browserSeries = [
  { key: "chrome", label: "Chrome" },
  { key: "safari", label: "Safari" },
  { key: "edge", label: "Edge" },
  { key: "firefox", label: "Firefox" },
  { key: "other", label: "Other", color: "neutral" as const },
];
const k = (v: number) => `${v}k`;

export const CHART_VARIANTS: Record<string, string[]> = {
  LineChart: ["default", "on surface", "dots", "mobile"],
  AreaChart: ["default", "stacked", "on surface", "mobile"],
  BarChart: ["grouped", "stacked", "horizontal", "on surface", "mobile"],
  DonutChart: ["donut", "pie", "on surface", "mobile"],
  Sparkline: ["default", "on surface", "mobile"],
};

function Surface({ on, children }: { on: boolean; children: ReactNode }) {
  if (!on) return <div>{children}</div>;
  const style = { padding: 16, borderRadius: 16, background: "var(--color-bg-surface)", "--chart-surface": "var(--color-bg-surface)" } as CSSProperties;
  return <div style={style}>{children}</div>;
}

export function ChartFixture({ chart, variant }: { chart: string; variant: string }) {
  const surface = variant === "on surface";
  let body: ReactNode = null;
  if (chart === "LineChart") {
    body = <LineChart data={traffic} series={variant === "mobile" ? three : six} xKey="month" label="Visits by channel" valueFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))} dots={variant === "dots"} defaultTooltipIndex={variant === "default" ? 2 : undefined} />;
  } else if (chart === "AreaChart") {
    body = <AreaChart data={traffic} series={variant === "stacked" ? three : two} stacked={variant === "stacked"} xKey="month" label="Visits" defaultTooltipIndex={variant === "default" ? 3 : undefined} />;
  } else if (chart === "BarChart") {
    body = (
      <BarChart
        data={regions}
        series={quarters}
        xKey="region"
        label="Revenue by region"
        valueFormatter={k}
        stacked={variant === "stacked"}
        orientation={variant === "horizontal" ? "horizontal" : "vertical"}
        yAxisWidth={variant === "horizontal" ? 104 : undefined}
        defaultTooltipIndex={variant === "grouped" ? 1 : undefined}
      />
    );
  } else if (chart === "DonutChart") {
    const Comp = variant === "pie" ? PieChart : DonutChart;
    body = <Comp data={browsers} series={browserSeries} nameKey="browser" valueKey="visitors" nameLabel="Browser" valueLabel="Visitors" label="Visitors by browser" size="lg" {...(variant === "pie" ? {} : { centerCaption: "Visitors" })} />;
  } else if (chart === "Sparkline") {
    body = (
      <div style={{ display: "grid", gap: 16, maxWidth: 240 }}>
        <Sparkline data={[12, 14, 11, 18, 21, 19, 24]} label="Signups, last 7 days" />
        <Sparkline data={[30, 28, 31, 26, 22, 24, 19]} label="Churn, last 7 days" color="trend" variant="area" />
        <Sparkline data={[5, 9, 7, 12, 10, 15, 14]} label="Revenue, last 7 days" color="trend" />
      </div>
    );
  }
  return <Surface on={surface}>{body}</Surface>;
}
