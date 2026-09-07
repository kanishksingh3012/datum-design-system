import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("associates the label with the textarea via a real <label for>", () => {
    render(<Textarea label="Notes" />);
    expect(screen.getByLabelText("Notes").tagName).toBe("TEXTAREA");
  });

  it("shows help text when there is no error", () => {
    render(<Textarea label="Notes" helpText="Optional details" />);
    expect(screen.getByText("Optional details")).toBeInTheDocument();
  });

  it("replaces help text with the error and sets aria-invalid/aria-describedby", () => {
    render(<Textarea label="Notes" helpText="Optional details" errorText="Too long" />);
    const input = screen.getByLabelText("Notes");
    expect(screen.queryByText("Optional details")).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", screen.getByText("Too long").id);
  });
});
