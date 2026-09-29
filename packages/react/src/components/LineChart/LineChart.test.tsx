import { afterEach, describe, expect, it, vi } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { LineChart } from "./LineChart";
import { setupChartDom } from "../ChartContainer/chartTestUtils";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
];
const series = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("LineChart", () => {
  it("draws one 2px line per series in its token, marked for the checker", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<LineChart data={data} series={series} xKey="month" label="Visitors" />);
    const lines = container.querySelectorAll("path.recharts-line-curve");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveAttribute("stroke", "var(--series-desktop)");
    expect(lines[0]).toHaveAttribute("stroke-width", "2");
    expect(lines[1]).toHaveAttribute("data-check-graphic", "Mobile");
  });

  it("has no dots by default and one per point with dots", () => {
    setupChartDom({ reducedMotion: true });
    const { container, rerender } = render(<LineChart data={data} series={series} xKey="month" label="Visitors" />);
    expect(container.querySelectorAll(".recharts-line-dot")).toHaveLength(0);
    rerender(<LineChart data={data} series={series} xKey="month" label="Visitors" dots />);
    expect(container.querySelectorAll(".recharts-line-dot")).toHaveLength(6);
  });

  it("formats values in the data table and hides axes and grid on request", () => {
    // tick text needs real text measurement: the browser check measures it
    setupChartDom({ reducedMotion: true });
    const { container, rerender } = render(
      <LineChart data={data} series={series} xKey="month" label="Visitors" valueFormatter={(v) => `${v}k`} xFormatter={(m) => `${m}.`} />
    );
    expect(screen.getByRole("rowheader", { name: "Jan." })).toBeInTheDocument();
    expect(screen.getByText("305k")).toBeInTheDocument();
    expect(container.querySelector(".recharts-xAxis")).not.toBeNull();
    expect(container.querySelector(".recharts-cartesian-grid")).not.toBeNull();
    rerender(<LineChart data={data} series={series} xKey="month" label="Visitors" xAxis={false} yAxis={false} grid={false} />);
    expect(container.querySelector(".recharts-xAxis, .recharts-yAxis, .recharts-cartesian-grid")).toBeNull();
  });

  it("is a named figure with a data table and forwards its ref", () => {
    setupChartDom({ reducedMotion: true });
    const ref = createRef<HTMLElement>();
    render(<LineChart ref={ref} data={data} series={series} xKey="month" label="Visitors" />);
    expect(screen.getByRole("figure")).toBe(ref.current);
    expect(screen.getByRole("table", { name: "Visitors" })).toBeInTheDocument();
  });
});
