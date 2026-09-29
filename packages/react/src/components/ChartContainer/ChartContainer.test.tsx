import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within, renderHook } from "@testing-library/react";
import { LineChart, Line, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, seriesColor, usePrefersReducedMotion } from "./ChartContainer";
import { setupChartDom } from "./chartTestUtils";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
];
const series = [
  { key: "desktop", label: "Desktop" },
  { key: "mobile", label: "Mobile" },
];

function Demo(props: Partial<React.ComponentProps<typeof ChartContainer>>) {
  return (
    <ChartContainer data={data} series={series} xKey="month" label="Visitors" {...props}>
      <LineChart data={data} accessibilityLayer>
        <XAxis dataKey="month" />
        <Line dataKey="desktop" stroke="var(--series-desktop)" />
        <ChartTooltip />
      </LineChart>
    </ChartContainer>
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ChartContainer", () => {
  it("names the figure with a generated summary of range and each series", () => {
    setupChartDom();
    render(<Demo />);
    expect(screen.getByRole("figure")).toHaveAccessibleName(
      "Visitors. Jan to Mar. Desktop from 186 to 305. Mobile from 80 to 200."
    );
  });

  it("uses a given summary instead", () => {
    setupChartDom();
    render(<Demo summary="Desktop peaked in February." />);
    expect(screen.getByRole("figure")).toHaveAccessibleName("Desktop peaked in February.");
  });

  it("renders a data table with a caption, headers and formatted values", () => {
    setupChartDom();
    render(<Demo valueFormatter={(v) => `${v} visits`} />);
    const table = screen.getByRole("table", { name: "Visitors" });
    expect(within(table).getAllByRole("columnheader").map((c) => c.textContent)).toEqual(["month", "Desktop", "Mobile"]);
    expect(within(table).getByRole("rowheader", { name: "Feb" })).toBeInTheDocument();
    expect(within(table).getByText("305 visits")).toBeInTheDocument();
  });

  it("feeds each series its categorical token through a CSS variable, in order", () => {
    setupChartDom();
    render(<Demo />);
    const fig = screen.getByRole("figure");
    expect(fig.style.getPropertyValue("--series-desktop")).toBe("var(--color-chart-1)");
    expect(fig.style.getPropertyValue("--series-mobile")).toBe("var(--color-chart-2)");
  });

  it("maps explicit and trend colors, and never cycles past slot 6", () => {
    expect(seriesColor({ key: "a", label: "A", color: 4 }, 0)).toBe("var(--color-chart-4)");
    expect(seriesColor({ key: "a", label: "A", color: "up" }, 0)).toBe("var(--color-border-success)");
    expect(seriesColor({ key: "a", label: "A", color: "down" }, 0)).toBe("var(--color-border-danger)");
    expect(seriesColor({ key: "g", label: "G" }, 6)).toBe("var(--color-border-strong)");
  });

  it("shows a legend for two or more series only, unless told otherwise", () => {
    setupChartDom();
    const { container, rerender } = render(<Demo />);
    expect(container.querySelector("ul")?.textContent).toBe("DesktopMobile");
    rerender(<Demo series={[series[0]]} />);
    expect(container.querySelector("ul")).toBeNull();
    rerender(<Demo series={[series[0]]} legend />);
    expect(container.querySelector("ul")).not.toBeNull();
  });

  it("sizes the plot by size, or an exact height", () => {
    setupChartDom();
    const { container, rerender } = render(<Demo size="lg" />);
    const plot = () => container.querySelector("figure > div") as HTMLElement;
    expect(plot().style.height).toBe("320px");
    rerender(<Demo height={48} />);
    expect(plot().style.height).toBe("48px");
  });

  it("enables Recharts' keyboard layer on the chart surface", () => {
    setupChartDom();
    const { container } = render(<Demo />);
    expect(container.querySelector("svg.recharts-surface, .recharts-wrapper [tabindex]")).not.toBeNull();
  });

  it("reports prefers-reduced-motion", () => {
    setupChartDom({ reducedMotion: true });
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(true);
    setupChartDom({ reducedMotion: false });
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(false);
  });
});
