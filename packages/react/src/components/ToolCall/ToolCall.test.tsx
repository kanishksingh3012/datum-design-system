import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolCall } from "./ToolCall";

describe("ToolCall", () => {
  it.each([
    ["pending", "Pending"],
    ["running", "Running"],
    ["success", "Done"],
    ["error", "Failed"],
  ] as const)("names the %s status in words", (status, word) => {
    render(<ToolCall name="search_web" status={status} />);
    expect(screen.getByRole("button")).toHaveAccessibleName(`search_web ${word}`);
  });

  it("shows input and output, or the error when it failed", async () => {
    const { rerender } = render(<ToolCall name="read_file" status="success" input="a.ts" output="ok" error="nope" defaultOpen />);
    expect(screen.getByText("Output")).toBeInTheDocument();
    expect(screen.queryByText("nope")).toBeNull();
    rerender(<ToolCall name="read_file" status="error" input="a.ts" output="ok" error="nope" defaultOpen />);
    expect(screen.getByText("nope")).toBeInTheDocument();
    expect(screen.queryByText("Output")).toBeNull();
  });

  it("toggles its details", async () => {
    render(<ToolCall name="x" status="success" output="ok" />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });
});
