import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputOTP } from "./InputOTP";

const cells = () => screen.getAllByRole("textbox");

describe("InputOTP", () => {
  it("renders a labelled group with one labelled cell per digit", () => {
    render(<InputOTP label="Verification code" length={4} />);
    expect(screen.getByRole("group", { name: "Verification code" })).toBeInTheDocument();
    expect(cells()).toHaveLength(4);
    expect(cells()[0]).toHaveAccessibleName("Digit 1 of 4");
    expect(cells()[0]).toHaveAttribute("autocomplete", "one-time-code");
  });

  it("keeps one cell in the tab order: the next empty one", () => {
    render(<InputOTP label="Code" length={4} defaultValue="12" />);
    expect(cells().map((c) => c.tabIndex)).toEqual([-1, -1, 0, -1]);
  });

  it("types forward, fires onValueChange and onComplete (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    const onComplete = vi.fn();
    render(<InputOTP label="Code" length={3} onValueChange={onValueChange} onComplete={onComplete} />);
    await userEvent.click(cells()[0]);
    await userEvent.keyboard("1a23");
    expect(onValueChange).toHaveBeenLastCalledWith("123");
    expect(onComplete).toHaveBeenCalledWith("123");
    expect(cells().map((c) => (c as HTMLInputElement).value)).toEqual(["1", "2", "3"]);
  });

  it("Backspace on an empty cell clears the one before and moves back", async () => {
    render(<InputOTP label="Code" length={4} defaultValue="12" />);
    await userEvent.click(cells()[2]);
    await userEvent.keyboard("{Backspace}");
    expect(cells()[1]).toHaveFocus();
    expect((cells()[1] as HTMLInputElement).value).toBe("");
  });

  it("fills every cell from a paste", async () => {
    const onValueChange = vi.fn();
    render(<InputOTP label="Code" length={4} onValueChange={onValueChange} />);
    await userEvent.click(cells()[0]);
    await userEvent.paste("12-34");
    expect(onValueChange).toHaveBeenCalledWith("1234");
  });

  it("follows a controlled value", () => {
    const { rerender } = render(<InputOTP label="Code" length={4} value="9" />);
    expect((cells()[0] as HTMLInputElement).value).toBe("9");
    rerender(<InputOTP label="Code" length={4} value="98" />);
    expect((cells()[1] as HTMLInputElement).value).toBe("8");
  });

  it("wires the error text, invalid state and size", () => {
    render(<InputOTP label="Code" errorText="That code has expired." size="lg" />);
    expect(cells()[0]).toHaveAttribute("aria-invalid", "true");
    expect(cells()[0]).toHaveAccessibleDescription("That code has expired.");
    expect(screen.getByRole("group").getAttribute("data-size")).toBe("lg");
  });

  it("read-only cells can't be edited; disabled cells can't be focused", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<InputOTP label="Code" length={2} defaultValue="12" readOnly onValueChange={onValueChange} />);
    await userEvent.click(cells()[1]);
    await userEvent.keyboard("{Backspace}5");
    expect(onValueChange).not.toHaveBeenCalled();
    rerender(<InputOTP label="Code" length={2} disabled />);
    cells().forEach((c) => expect(c).toBeDisabled());
  });

  it("submits the code under name", () => {
    const { container } = render(<InputOTP label="Code" name="otp" defaultValue="42" />);
    expect(container.querySelector('input[type="hidden"][name="otp"]')).toHaveValue("42");
  });
});
