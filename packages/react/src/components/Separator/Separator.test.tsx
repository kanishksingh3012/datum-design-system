import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "./Separator";

describe("Separator", () => {
  it("renders a real <hr>, already role=separator for free", () => {
    render(<Separator />);
    expect(screen.getByRole("separator").tagName).toBe("HR");
  });

  it("defaults to horizontal orientation", () => {
    render(<Separator data-testid="sep" />);
    expect(screen.getByTestId("sep")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("reflects vertical orientation and sets aria-orientation", () => {
    render(<Separator orientation="vertical" data-testid="sep" />);
    const sep = screen.getByTestId("sep");
    expect(sep).toHaveAttribute("data-orientation", "vertical");
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
  });
});
