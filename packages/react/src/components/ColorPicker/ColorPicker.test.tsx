import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColorPicker } from "./ColorPicker";

describe("ColorPicker", () => {
  it("shows the color on a trigger named by the label and the value", () => {
    render(<ColorPicker label="Brand" defaultValue="#fc6e20" helpText="Used for buttons." />);
    const trigger = screen.getByRole("button", { name: "Brand #FC6E20" });
    expect(trigger).toHaveAccessibleDescription("Used for buttons.");
  });

  it("opens a panel with an area, a hue slider, a hex field and swatches", async () => {
    const onOpenChange = vi.fn();
    render(<ColorPicker label="Brand" defaultValue="#fc6e20" swatches={["#355695", "#007440"]} onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: /Brand/ }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("dialog", { name: "Brand" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /Hue/ })).toBeInTheDocument();
    expect(screen.getAllByRole("slider", { name: "Color picker" })[0]).toHaveAttribute("aria-roledescription", "2D slider");
    expect(screen.getByRole("textbox", { name: "Hex" })).toHaveValue("#FC6E20");
    expect(screen.getAllByRole("button", { pressed: false })).toHaveLength(2);
  });

  it("reports hex strings from swatches and the hex field", async () => {
    const onValueChange = vi.fn();
    render(<ColorPicker label="Brand" defaultValue="#fc6e20" swatches={["#355695"]} onValueChange={onValueChange} defaultOpen />);
    await userEvent.click(screen.getByRole("button", { pressed: false }));
    expect(onValueChange).toHaveBeenLastCalledWith("#355695");
    expect(screen.getByRole("button", { pressed: true })).toBeInTheDocument();
    const field = screen.getByRole("textbox", { name: "Hex" });
    await userEvent.clear(field);
    await userEvent.type(field, "007440{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith("#007440");
  });

  it("moves the hue with the keyboard", async () => {
    const onValueChange = vi.fn();
    render(<ColorPicker label="Brand" defaultValue="#ff0000" onValueChange={onValueChange} defaultOpen />);
    const hue = screen.getByRole("slider", { name: /Hue/ });
    act(() => hue.focus());
    fireEvent.keyDown(hue, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls[onValueChange.mock.calls.length - 1][0]).toMatch(/^#[0-9A-F]{6}$/);
  });

  it("is controlled, submits the hex, and marks errors and disabled", () => {
    const { rerender } = render(<ColorPicker label="Brand" value="#000000" name="brand" errorText="Too dark." />);
    expect(screen.getByRole("button", { name: "Brand #000000" })).toHaveAttribute("aria-invalid", "true");
    expect(document.querySelector('input[name="brand"]')).toHaveValue("#000000");
    rerender(<ColorPicker label="Brand" value="#ffffff" disabled />);
    expect(screen.getByRole("button", { name: "Brand #FFFFFF" })).toBeDisabled();
  });
});
