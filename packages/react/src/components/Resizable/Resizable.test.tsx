import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Resizable } from "./Resizable";

const panels = (props: Partial<Parameters<typeof Resizable>[0]> = {}) => <Resizable first="Files" second="Editor" data-testid="root" {...props} />;

describe("Resizable", () => {
  it("names the handle and announces the first panel's share", () => {
    render(panels({ defaultValue: 30 }));
    const handle = screen.getByRole("slider", { name: "Resize panels" });
    expect(handle).toHaveAttribute("aria-valuetext", "30%");
    expect(handle).toHaveAttribute("min", "10");
    expect(handle).toHaveAttribute("max", "90");
    expect(screen.getByTestId("root").style.gridTemplateColumns).toBe("minmax(0, 30fr) auto minmax(0, 70fr)");
  });

  it("moves with the arrow keys and stops at min and max", async () => {
    const onValueChange = vi.fn();
    render(panels({ defaultValue: 50, min: 20, max: 80, step: 5, onValueChange }));
    const handle = screen.getByRole("slider");
    await userEvent.click(handle);
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenLastCalledWith(55);
    fireEvent.keyDown(handle, { key: "End" });
    expect(onValueChange).toHaveBeenLastCalledWith(80);
    fireEvent.keyDown(handle, { key: "Home" });
    expect(onValueChange).toHaveBeenLastCalledWith(20);
  });

  it("stacks vertically, where ArrowDown grows the top panel", async () => {
    const onValueChange = vi.fn();
    render(panels({ orientation: "vertical", defaultValue: 40, onValueChange }));
    const handle = screen.getByRole("slider");
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
    expect(screen.getByTestId("root").style.gridTemplateRows).toBe("minmax(0, 40fr) auto minmax(0, 60fr)");
    await userEvent.click(handle);
    fireEvent.keyDown(handle, { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenLastCalledWith(41);
  });

  it("is controlled by value, and disabled leaves the tab order", () => {
    const { rerender } = render(panels({ value: 25 }));
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "25%");
    rerender(panels({ value: 60, disabled: true }));
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuetext", "60%");
    expect(screen.getByRole("slider")).toBeDisabled();
  });
});
