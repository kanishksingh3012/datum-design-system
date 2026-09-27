import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container } from "./Container";

describe("Container", () => {
  it("defaults to size=xl and padded", () => {
    render(<Container data-testid="c">Content</Container>);
    const el = screen.getByTestId("c");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveAttribute("data-size", "xl");
    expect(el).toHaveAttribute("data-padded", "true");
  });

  it("reflects every size", () => {
    for (const size of ["sm", "md", "lg", "xl", "full"] as const) {
      render(<Container size={size} data-testid={size} />);
      expect(screen.getByTestId(size)).toHaveAttribute("data-size", size);
    }
  });

  it("drops the gutter when padded is false", () => {
    render(<Container padded={false} data-testid="c" />);
    expect(screen.getByTestId("c")).not.toHaveAttribute("data-padded");
  });

  it("forwards its ref, merges className and spreads the rest", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Container ref={ref} className="extra" id="main" data-testid="c" />);
    const el = screen.getByTestId("c");
    expect(ref.current).toBe(el);
    expect(el.className).toContain("extra");
    expect(el).toHaveAttribute("id", "main");
  });
});
