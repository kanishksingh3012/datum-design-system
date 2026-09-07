import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("associates the label with the input via a real <label for>", () => {
    render(<TextField label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows help text when there is no error", () => {
    render(<TextField label="Email" helpText="We'll never share this" />);
    expect(screen.getByText("We'll never share this")).toBeInTheDocument();
  });

  it("replaces help text with the error and sets aria-invalid/aria-describedby", () => {
    render(<TextField label="Email" helpText="We'll never share this" errorText="Invalid email" />);
    const input = screen.getByLabelText("Email");
    expect(screen.queryByText("We'll never share this")).not.toBeInTheDocument();
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", screen.getByText("Invalid email").id);
  });
});
