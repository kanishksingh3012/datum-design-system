import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { DonutChart, PieChart } from "./DonutChart";
import { setupChartDom } from "../ChartContainer/chartTestUtils";

const data = [
  { browser: "chrome", visitors: 275 },
  { browser: "safari", visitors: 200 },
  { browser: "firefox", visitors: 125 },
];
const series = [
  { key: "chrome", label: "Chrome" },
  { key: "safari", label: "Safari" },
  { key: "firefox", label: "Firefox" },
];
const props = { data, series, nameKey: "browser", valueKey: "visitors", label: "Browsers" };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("DonutChart", () => {
  it("summarizes each slice with its share", () => {
    setupChartDom({ reducedMotion: true });
    render(<DonutChart {...props} />);
    expect(screen.getByRole("figure")).toHaveAccessibleName("Browsers. Chrome 275 (46%), Safari 200 (33%), Firefox 125 (21%).");
  });

  it("draws one sector per slice, each marked with its own label, and the total in the middle", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<DonutChart {...props} />);
    const sectors = [...container.querySelectorAll("path.recharts-sector")];
    expect(sectors.map((s) => s.getAttribute("data-check-graphic"))).toEqual(["Chrome", "Safari", "Firefox"]);
    expect(sectors[1]).toHaveAttribute("fill", "var(--series-safari)");
    expect(container.querySelector(".recharts-label")?.textContent).toBe("600");
  });

  it("tables slices by label and always shows the legend", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<DonutChart {...props} />);
    const table = screen.getByRole("table", { name: "Browsers" });
    expect(within(table).getByText("Safari")).toBeInTheDocument();
    expect(container.querySelector("figure > ul")?.textContent).toBe("ChromeSafariFirefox");
  });

  it("PieChart fills the middle and has no center label", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<PieChart {...props} />);
    expect(screen.getByRole("figure")).toHaveAttribute("data-variant", "pie");
    expect(container.querySelector(".recharts-label")).toBeNull();
  });
});
