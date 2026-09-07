import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Resizable } from "./Resizable";

describe("Resizable", () => {
  it("renders both panes and a keyboard-focusable splitter", () => {
    render(<Resizable first={<div>Left</div>} second={<div>Right</div>} />);
    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByText("Right")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toHaveAttribute("tabindex", "0");
  });

  it("exposes the split as aria-valuenow, defaulting to 50", () => {
    render(<Resizable first={<div>Left</div>} second={<div>Right</div>} />);
    expect(screen.getByRole("separator")).toHaveAttribute("aria-valuenow", "50");
  });

  it("moves the split with ArrowRight, clamped to max", async () => {
    const user = userEvent.setup();
    render(<Resizable first={<div>Left</div>} second={<div>Right</div>} defaultSplit={88} max={90} />);
    const splitter = screen.getByRole("separator");
    splitter.focus();
    await user.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");
    expect(Number(splitter.getAttribute("aria-valuenow"))).toBeLessThanOrEqual(90);
  });
});
