import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Separator } from "./Separator";

describe("Separator", () => {
  it("renders a native <hr>, horizontal and subtle by default", () => {
    render(<Separator />);
    const sep = screen.getByRole("separator");
    expect(sep.tagName).toBe("HR");
    expect(sep).toHaveAttribute("data-orientation", "horizontal");
    expect(sep).toHaveAttribute("data-tone", "subtle");
    expect(sep).not.toHaveAttribute("aria-orientation");
  });

  it("exposes vertical orientation and tone", () => {
    render(<Separator orientation="vertical" tone="default" />);
    const sep = screen.getByRole("separator");
    expect(sep).toHaveAttribute("aria-orientation", "vertical");
    expect(sep).toHaveAttribute("data-tone", "default");
  });

  it("shows a label in the middle and uses it as the accessible name", () => {
    render(<Separator label="or" />);
    const sep = screen.getByRole("separator", { name: "or" });
    expect(sep.tagName).toBe("DIV");
    expect(sep).toHaveTextContent("or");
  });

  it("forwards its ref and merges className", () => {
    const ref = createRef<HTMLElement>();
    render(<Separator ref={ref} className="custom" />);
    expect(ref.current).toBe(screen.getByRole("separator"));
    expect(ref.current?.className).toContain("custom");
  });
});
