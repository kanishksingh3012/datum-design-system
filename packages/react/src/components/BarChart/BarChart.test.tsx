import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BarChart } from "./BarChart";
import { setupChartDom } from "../ChartContainer/chartTestUtils";

const data = [
  { region: "North", q1: 40, q2: 55 },
  { region: "South", q1: 30, q2: 20 },
];
const series = [
  { key: "q1", label: "Q1" },
  { key: "q2", label: "Q2" },
];
const bars = (c: HTMLElement) => [...c.querySelectorAll(".recharts-bar-rectangle path")];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("BarChart", () => {
  it("groups bars side by side, one rect per value, in series tokens", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<BarChart data={data} series={series} xKey="region" label="Sales" />);
    expect(bars(container)).toHaveLength(4);
    expect(bars(container)[0]).toHaveAttribute("fill", "var(--series-q1)");
    expect(bars(container)[3]).toHaveAttribute("data-check-graphic", "Q2");
  });

  it("stacks with a surface gap between segments", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<BarChart data={data} series={series} xKey="region" label="Sales" stacked />);
    expect(bars(container)[0]).toHaveAttribute("stroke", "var(--chart-surface)");
    expect(bars(container)[0]).toHaveAttribute("stroke-width", "2");
  });

  it("runs bars left to right when horizontal", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<BarChart data={data} series={series} xKey="region" label="Sales" orientation="horizontal" />);
    expect(screen.getByRole("figure")).toHaveAttribute("data-orientation", "horizontal");
    // North's Q2 bar (55) is the longest: wider than it is tall
    const box = (p: Element) => (p.getAttribute("d") ?? "").match(/-?[\d.]+/g)!.map(Number);
    const widest = bars(container).map((p) => { const n = box(p); const xs = n.filter((_, i) => i % 2 === 0); return Math.max(...xs) - Math.min(...xs); });
    expect(Math.max(...widest)).toBeGreaterThan(100);
  });
});
