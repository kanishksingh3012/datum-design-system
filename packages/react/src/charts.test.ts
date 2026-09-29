/// <reference types="vite/client" />
import { describe, expect, it } from "vitest";

// Recharts must stay behind the @datum-design/react/charts subpath.
const sources = import.meta.glob<string>(["./**/*.{ts,tsx}", "!./**/*.test.{ts,tsx}"], { query: "?raw", import: "default", eager: true });
const CHART = /\/components\/(ChartContainer|LineChart|AreaChart|BarChart|DonutChart|Sparkline)\/|^\.\/charts\.ts$/;

describe("charts entry", () => {
  it("the main entry exports no chart", () => {
    expect(sources["./index.ts"]).not.toMatch(/recharts|ChartContainer|LineChart|AreaChart|BarChart|DonutChart|Sparkline/);
  });

  it("nothing outside the chart folders imports recharts or a chart", () => {
    const offenders = Object.entries(sources)
      .filter(([path, src]) => !CHART.test(path) && /from "recharts"|\/(ChartContainer|LineChart|AreaChart|BarChart|DonutChart|Sparkline)\//.test(src))
      .map(([path]) => path);
    expect(offenders).toEqual([]);
    expect(Object.keys(sources).length).toBeGreaterThan(50);
  });
});
