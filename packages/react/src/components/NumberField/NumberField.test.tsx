import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberField } from "./NumberField";

describe("NumberField", () => {
  it("labels a text input with a numeric keyboard and − / + steppers", () => {
    render(<NumberField label="Quantity" defaultValue={2} />);
    const input = screen.getByRole("textbox", { name: "Quantity" });
    expect(input).toHaveAttribute("inputmode", "numeric");
    expect(input).toHaveValue("2");
    expect(screen.getByRole("button", { name: "Decrease Quantity" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Increase Quantity" })).toBeInTheDocument();
  });

  it("steps with the buttons and arrow keys, clamped to min and max", async () => {
    const onValueChange = vi.fn();
    render(<NumberField label="Quantity" defaultValue={9} min={0} max={10} onValueChange={onValueChange} />);
    const increase = screen.getByRole("button", { name: "Increase Quantity" });
    await userEvent.click(increase);
    expect(onValueChange).toHaveBeenLastCalledWith(10);
    expect(increase).toBeDisabled();
    const input = screen.getByRole("textbox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(onValueChange).toHaveBeenLastCalledWith(8);
  });

  it("commits typed values on blur, snapped to the range", async () => {
    const onValueChange = vi.fn();
    render(<NumberField label="Quantity" min={0} max={10} onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole("textbox"), "42");
    await userEvent.tab();
    expect(onValueChange).toHaveBeenLastCalledWith(10);
  });

  it("follows a controlled value and formats it", () => {
    const { rerender } = render(<NumberField label="Price" value={5} formatOptions={{ style: "currency", currency: "USD" }} />);
    expect(screen.getByRole("textbox")).toHaveValue("$5.00");
    rerender(<NumberField label="Price" value={7} formatOptions={{ style: "currency", currency: "USD" }} />);
    expect(screen.getByRole("textbox")).toHaveValue("$7.00");
  });

  it("replaces help text with the error and marks it invalid", () => {
    render(<NumberField label="Quantity" helpText="Max 10" errorText="Too many" />);
    const input = screen.getByRole("textbox");
    expect(screen.queryByText("Max 10")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Too many");
  });

  it("read-only drops the steppers; disabled disables everything; size and hideSteppers", () => {
    const { rerender, container } = render(<NumberField label="Quantity" readOnly defaultValue={1} size="sm" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    expect(container.querySelector("[data-control]")).toHaveAttribute("data-size", "sm");
    rerender(<NumberField label="Quantity" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    screen.getAllByRole("button").forEach((b) => expect(b).toBeDisabled());
    rerender(<NumberField label="Quantity" hideSteppers />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
