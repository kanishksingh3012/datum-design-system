import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field } from "./Field";

describe("Field", () => {
  it("labels a custom control through a render function", () => {
    render(<Field label="Volume" helpText="0 to 11">{(control) => <input type="range" {...control} />}</Field>);
    const input = screen.getByRole("slider", { name: "Volume" });
    expect(input).toHaveAccessibleDescription("0 to 11");
  });

  it("merges the wiring into a single element child", () => {
    render(<Field label="Nickname" required><input /></Field>);
    const input = screen.getByRole("textbox", { name: /Nickname/ });
    expect(input).toBeRequired();
  });

  it("replaces help text with error text and marks the control invalid", () => {
    const { container } = render(
      <Field label="Email" helpText="We never share it" errorText="Enter an email address">
        <input />
      </Field>
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter an email address");
    expect(screen.queryByText("We never share it")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveAttribute("data-invalid", "true");
  });

  it("passes disabled and readOnly to the control and reflects them on the root", () => {
    const { container, rerender } = render(<Field label="Name" disabled><input /></Field>);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(container.firstElementChild).toHaveAttribute("data-disabled", "true");
    rerender(<Field label="Name" readOnly><input /></Field>);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
    expect(container.firstElementChild).toHaveAttribute("data-readonly", "true");
  });

  it("spreads remaining props onto the root", () => {
    render(<Field label="Name" data-testid="root" className="extra"><input /></Field>);
    expect(screen.getByTestId("root")).toHaveClass("extra");
  });
});
