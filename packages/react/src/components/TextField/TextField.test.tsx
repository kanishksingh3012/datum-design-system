import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { TextField } from "./TextField";

const box = (input: HTMLElement) => input.closest("[data-control]")!;

describe("TextField", () => {
  it("labels the input and defaults to size=md, type=text", () => {
    render(<TextField label="Name" />);
    const input = screen.getByRole("textbox", { name: "Name" });
    expect(input).toHaveAttribute("type", "text");
    expect(box(input)).toHaveAttribute("data-size", "md");
  });

  it("reflects size and passes type through", () => {
    render(<TextField label="Email" size="lg" type="email" />);
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAttribute("type", "email");
    expect(box(input)).toHaveAttribute("data-size", "lg");
  });

  it("describes the input with help text, replaced by error text", () => {
    const { rerender } = render(<TextField label="Email" helpText="Work address" />);
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription("Work address");
    rerender(<TextField label="Email" helpText="Work address" errorText="Required" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Required");
    expect(box(input)).toHaveAttribute("data-invalid", "true");
  });

  it("holds its own value when uncontrolled and reports every edit", async () => {
    const onValueChange = vi.fn();
    render(<TextField label="City" defaultValue="Par" onValueChange={onValueChange} />);
    await userEvent.type(screen.getByRole("textbox"), "is");
    expect(screen.getByRole("textbox")).toHaveValue("Paris");
    expect(onValueChange).toHaveBeenLastCalledWith("Paris");
  });

  it("follows value when controlled", async () => {
    function Controlled() {
      const [value, setValue] = useState("");
      return <TextField label="Code" value={value} onValueChange={(v) => setValue(v.toUpperCase())} />;
    }
    render(<Controlled />);
    await userEvent.type(screen.getByRole("textbox"), "ab");
    expect(screen.getByRole("textbox")).toHaveValue("AB");
  });

  it("renders prefix and suffix inside the box", () => {
    render(<TextField label="Price" prefix="$" suffix="USD" />);
    const b = box(screen.getByRole("textbox"));
    expect(b).toHaveTextContent("$");
    expect(b).toHaveTextContent("USD");
  });

  it("shows Clear only while filled; clearing empties it and keeps focus", async () => {
    const onValueChange = vi.fn();
    render(<TextField label="Search" clearable onValueChange={onValueChange} />);
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    await userEvent.type(screen.getByRole("textbox"), "hats");
    await userEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.getByRole("textbox")).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("");
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("toggles a password between hidden and shown", async () => {
    render(<TextField label="Password" type="password" revealable defaultValue="secret" />);
    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  it("marks required, disabled and read-only", () => {
    render(
      <>
        <TextField label="A" required />
        <TextField label="B" disabled clearable defaultValue="x" />
        <TextField label="C" readOnly />
      </>
    );
    expect(screen.getByRole("textbox", { name: /A/ })).toBeRequired();
    expect(screen.getByRole("textbox", { name: "B" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
    const c = screen.getByRole("textbox", { name: "C" });
    expect(c).toHaveAttribute("readonly");
    expect(box(c)).toHaveAttribute("data-readonly", "true");
  });

  it("forwards ref to the input and className to the root", () => {
    let node: HTMLInputElement | null = null;
    const { container } = render(<TextField label="Name" className="extra" ref={(el) => (node = el)} />);
    expect(node).toBe(screen.getByRole("textbox"));
    expect(container.firstElementChild).toHaveClass("extra");
  });
});
