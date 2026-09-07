import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IconButton } from "./IconButton";

function Glyph() {
  return <svg data-testid="glyph" aria-hidden="true" />;
}

describe("IconButton", () => {
  it("renders a native button with the label as its accessible name", () => {
    render(
      <IconButton label="Close">
        <Glyph />
      </IconButton>
    );
    const button = screen.getByRole("button", { name: "Close" });
    expect(button.tagName).toBe("BUTTON");
  });

  it("renders the icon content inside the button", () => {
    render(
      <IconButton label="Close">
        <Glyph />
      </IconButton>
    );
    expect(screen.getByTestId("glyph")).toBeInTheDocument();
  });

  it("blocks clicks when disabled", async () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Close" disabled onClick={onClick}>
        <Glyph />
      </IconButton>
    );
    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires onClick when enabled", async () => {
    const onClick = vi.fn();
    render(
      <IconButton label="Close" onClick={onClick}>
        <Glyph />
      </IconButton>
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
