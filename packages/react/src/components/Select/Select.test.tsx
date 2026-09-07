import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "./Select";

describe("Select", () => {
  it("associates the label with the select via a real <label for>", () => {
    render(
      <Select label="Country">
        <option value="us">United States</option>
        <option value="ca">Canada</option>
      </Select>
    );
    expect(screen.getByLabelText("Country").tagName).toBe("SELECT");
  });

  it("replaces help text with the error and sets aria-invalid/aria-describedby", () => {
    render(
      <Select label="Country" helpText="Pick one" errorText="Required">
        <option value="us">United States</option>
      </Select>
    );
    const select = screen.getByLabelText("Country");
    expect(screen.queryByText("Pick one")).not.toBeInTheDocument();
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("aria-describedby", screen.getByText("Required").id);
  });

  it("hides the decorative chevron from the accessibility tree", () => {
    const { container } = render(
      <Select label="Country">
        <option value="us">United States</option>
      </Select>
    );
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
