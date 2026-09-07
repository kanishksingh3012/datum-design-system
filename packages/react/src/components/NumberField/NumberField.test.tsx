import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NumberField } from "./NumberField";

describe("NumberField", () => {
  it("renders a real <input type=number> associated with its label", () => {
    render(<NumberField label="Quantity" />);
    const input = screen.getByLabelText("Quantity");
    expect(input).toHaveAttribute("type", "number");
  });

  it("replaces help text with the error and sets aria-invalid/aria-describedby", () => {
    render(<NumberField label="Quantity" helpText="Max 10" errorText="Too many" />);
    const input = screen.getByLabelText("Quantity");
    expect(screen.queryByText("Max 10")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", screen.getByText("Too many").id);
  });

  it("respects min/max/step for the native stepper", () => {
    render(<NumberField label="Quantity" min={0} max={10} step={1} />);
    const input = screen.getByLabelText("Quantity");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "10");
  });
});
