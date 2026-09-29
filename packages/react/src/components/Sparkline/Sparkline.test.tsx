import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sparkline } from "./Sparkline";
import { setupChartDom } from "../ChartContainer/chartTestUtils";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Sparkline", () => {
  it("is a 40px line with no axes, grid or legend, and a spoken summary", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<Sparkline data={[3, 5, 2, 8]} label="Signups" />);
    const fig = screen.getByRole("figure");
    expect(fig).toHaveAccessibleName("Signups. Starts at 3, ends at 8. Low 2, high 8.");
    expect((container.querySelector("figure > div") as HTMLElement).style.height).toBe("40px");
    expect(container.querySelector(".recharts-xAxis, .recharts-cartesian-grid, figure > ul")).toBeNull();
    expect(container.querySelector("path.recharts-line-curve")).toHaveAttribute("data-check-graphic", "Signups");
  });

  it("colors by trend: up is success, down is danger", () => {
    setupChartDom({ reducedMotion: true });
    const { rerender } = render(<Sparkline data={[1, 4]} label="Up" color="trend" />);
    expect(screen.getByRole("figure").style.getPropertyValue("--series-value")).toBe("var(--color-border-success)");
    rerender(<Sparkline data={[4, 1]} label="Down" color="trend" />);
    expect(screen.getByRole("figure").style.getPropertyValue("--series-value")).toBe("var(--color-border-danger)");
  });

  it("area variant adds a tint", () => {
    setupChartDom({ reducedMotion: true });
    const { container } = render(<Sparkline data={[1, 2, 3]} label="Load" variant="area" />);
    expect(container.querySelector("path.recharts-area-area")).toHaveAttribute("fill-opacity", "0.16");
  });
});
