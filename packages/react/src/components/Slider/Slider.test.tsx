import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("labels a native range input and shows the value", () => {
    render(<Slider label="Volume" defaultValue={50} />);
    const slider = screen.getByRole("slider", { name: "Volume" });
    expect(slider).toHaveAttribute("type", "range");
    expect(slider).toHaveValue("50");
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("respects min, max and step, and steps with the arrow keys", async () => {
    const onValueChange = vi.fn();
    render(<Slider label="Volume" min={0} max={10} step={2} defaultValue={4} onValueChange={onValueChange} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "10");
    expect(slider).toHaveAttribute("step", "2");
    await userEvent.click(slider);
    fireEvent.change(slider, { target: { value: "6" } });
    expect(onValueChange).toHaveBeenLastCalledWith(6);
  });

  it("follows a controlled value", () => {
    const { rerender } = render(<Slider label="Volume" value={10} />);
    expect(screen.getByRole("slider")).toHaveValue("10");
    rerender(<Slider label="Volume" value={30} />);
    expect(screen.getByRole("slider")).toHaveValue("30");
  });

  it("two values make a range with two named thumbs", () => {
    const onValueChange = vi.fn();
    render(<Slider label="Price" defaultValue={[20, 80]} onValueChange={onValueChange} />);
    const [low, high] = screen.getAllByRole("slider");
    expect(low).toHaveAccessibleName(/Minimum/);
    expect(high).toHaveAccessibleName(/Maximum/);
    expect(screen.getByText("20 – 80")).toBeInTheDocument();
    fireEvent.change(high, { target: { value: "70" } });
    expect(onValueChange).toHaveBeenLastCalledWith([20, 70]);
  });

  it("formats the value it shows and announces", () => {
    render(<Slider label="Opacity" defaultValue={0.4} min={0} max={1} step={0.1} formatOptions={{ style: "percent" }} />);
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "40%");
  });

  it("disabled, size and aria-label without a visible label", () => {
    render(<Slider aria-label="Zoom" disabled size="sm" />);
    const slider = screen.getByRole("slider", { name: "Zoom" });
    expect(slider).toBeDisabled();
    expect(screen.getByRole("group")).toHaveAttribute("data-size", "sm");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
