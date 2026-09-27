import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Grid } from "./Grid";

const vars = (el: HTMLElement) => ({
  base: el.style.getPropertyValue("--_cols"),
  md: el.style.getPropertyValue("--_cols-md"),
  lg: el.style.getPropertyValue("--_cols-lg"),
});

describe("Grid", () => {
  it("defaults to one column and gap md", () => {
    render(<Grid data-testid="g" />);
    const el = screen.getByTestId("g");
    expect(el).toHaveAttribute("data-gap", "md");
    expect(vars(el)).toEqual({ base: "1", md: "1", lg: "1" });
  });

  it("applies a number at every breakpoint", () => {
    render(<Grid columns={3} data-testid="g" />);
    expect(vars(screen.getByTestId("g"))).toEqual({ base: "3", md: "3", lg: "3" });
  });

  it("switches a responsive object at md and lg, each step inheriting the one below", () => {
    render(<Grid columns={{ base: 1, md: 2 }} data-testid="a" />);
    expect(vars(screen.getByTestId("a"))).toEqual({ base: "1", md: "2", lg: "2" });
    render(<Grid columns={{ lg: 4 }} data-testid="b" />);
    expect(vars(screen.getByTestId("b"))).toEqual({ base: "1", md: "1", lg: "4" });
  });

  it("auto-fits with minItemWidth, taking numbers as px and strings as-is", () => {
    render(<Grid minItemWidth={240} columns={3} data-testid="a" />);
    const a = screen.getByTestId("a");
    expect(a).toHaveAttribute("data-auto-fit", "true");
    expect(a.style.getPropertyValue("--_min")).toBe("240px");
    expect(a.style.getPropertyValue("--_cols")).toBe("");
    render(<Grid minItemWidth="16rem" data-testid="b" />);
    expect(screen.getByTestId("b").style.getPropertyValue("--_min")).toBe("16rem");
  });

  it("keeps the consumer's own style", () => {
    render(<Grid columns={2} style={{ marginTop: 8 }} data-testid="g" />);
    const el = screen.getByTestId("g");
    expect(el.style.marginTop).toBe("8px");
    expect(el.style.getPropertyValue("--_cols")).toBe("2");
  });

  it("forwards its ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Grid ref={ref} className="extra" gap="xl" data-testid="g" />);
    expect(ref.current).toBe(screen.getByTestId("g"));
    expect(ref.current?.className).toContain("extra");
    expect(ref.current).toHaveAttribute("data-gap", "xl");
  });
});
