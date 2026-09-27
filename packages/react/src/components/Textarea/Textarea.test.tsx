import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("labels the textarea and defaults to size=md, rows=3", () => {
    render(<Textarea label="Message" />);
    const textarea = screen.getByRole("textbox", { name: "Message" });
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("rows", "3");
    expect(textarea).toHaveAttribute("data-size", "md");
  });

  it("replaces help text with error text", () => {
    render(<Textarea label="Bio" helpText="A few lines" errorText="Too short" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAccessibleDescription("Too short");
  });

  it("shows a counter with maxLength and includes it in the description", async () => {
    render(<Textarea label="Bio" helpText="Shown on your profile" maxLength={20} />);
    const textarea = screen.getByRole("textbox");
    expect(screen.getByText("0/20")).toBeInTheDocument();
    await userEvent.type(textarea, "Hello");
    expect(screen.getByText("5/20")).toBeInTheDocument();
    expect(textarea).toHaveAttribute("maxlength", "20");
    expect(textarea).toHaveAccessibleDescription("Shown on your profile 5/20");
  });

  it("reports edits through onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<Textarea label="Note" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole("textbox"), "hi");
    expect(onValueChange).toHaveBeenLastCalledWith("hi");
  });

  it("marks autoResize, read-only and disabled", () => {
    render(
      <>
        <Textarea label="A" autoResize />
        <Textarea label="B" readOnly />
        <Textarea label="C" disabled />
      </>
    );
    expect(screen.getByRole("textbox", { name: "A" })).toHaveAttribute("data-auto-resize", "true");
    expect(screen.getByRole("textbox", { name: "B" })).toHaveAttribute("readonly");
    expect(screen.getByRole("textbox", { name: "C" })).toBeDisabled();
  });
});
