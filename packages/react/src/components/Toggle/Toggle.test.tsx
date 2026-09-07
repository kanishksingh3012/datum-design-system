import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle } from "./Toggle";

describe("Toggle", () => {
  it("sets aria-pressed to reflect the pressed prop", () => {
    render(<Toggle pressed>Bold</Toggle>);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
  });

  it("defaults to unpressed", () => {
    render(<Toggle>Bold</Toggle>);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onPressedChange with the flipped state on click", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle pressed={false} onPressedChange={onPressedChange}>
        Bold
      </Toggle>
    );
    await user.click(screen.getByRole("button", { name: "Bold" }));
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});
