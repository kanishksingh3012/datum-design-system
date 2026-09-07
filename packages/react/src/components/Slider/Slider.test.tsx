import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("renders a real <input type=range> associated with its label", () => {
    render(<Slider label="Volume" defaultValue={50} />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider.tagName).toBe("INPUT");
    expect(slider).toHaveAttribute("type", "range");
  });

  it("respects min/max/step", () => {
    render(<Slider label="Volume" min={0} max={10} step={2} defaultValue={4} />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "10");
    expect(slider).toHaveAttribute("step", "2");
  });
});
