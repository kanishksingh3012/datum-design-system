import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { AreaChart } from "./AreaChart";
import { setupChartDom } from "../ChartContainer/chartTestUtils";

const data = [
  { day: "Mon", a: 4, b: 2 },
  { day: "Tue", a: 6, b: 3 },
  { day: "Wed", a: 5, b: 4 },
];
const series = [
  { key: "a", label: "Organic" },
  { key: "b", label: "Paid" },
];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("AreaChart", () => {
  it("draws a line and a gradient fill per series, both marked as one mark", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<AreaChart data={data} series={series} xKey="day" label="Sessions" />);
    const tint = container.querySelector("path.recharts-area-area");
    const line = container.querySelector("path.recharts-area-curve");
    const stops = container.querySelectorAll("linearGradient")[0].querySelectorAll("stop");
    expect(tint?.getAttribute("fill")).toBe(`url(#${container.querySelectorAll("linearGradient")[0].id})`);
    expect(stops[0]).toHaveAttribute("stop-color", "var(--series-a)");
    expect([stops[0].getAttribute("stop-opacity"), stops[1].getAttribute("stop-opacity")]).toEqual(["0.4", "0"]);
    expect(line).toHaveAttribute("stroke", "var(--series-a)");
    expect(tint?.getAttribute("data-check-graphic")).toBe(line?.getAttribute("data-check-graphic"));
  });

  it("stacks series when stacked: the top edge is the total", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<AreaChart data={data} series={series} xKey="day" label="Sessions" stacked yAxis={false} />);
    expect(container.querySelector("linearGradient stop:last-child")).toHaveAttribute("stop-opacity", "0.15");
    // Tue: 6 + 3 = 9 is the highest point, so the stacked series' line reaches the top margin
    const tops = [...container.querySelectorAll("path.recharts-area-curve")].map((p) => Math.min(...(p.getAttribute("d") ?? "").match(/[\d.]+(?=[,\sLC]|$)/g)!.map(Number).filter((_, i) => i % 2 === 1)));
    expect(tops[1]).toBeLessThan(tops[0]);
  });
});
