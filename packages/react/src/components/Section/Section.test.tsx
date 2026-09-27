import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Section } from "./Section";

describe("Section", () => {
  it("renders a <section> with spacing md and tone default", () => {
    render(<Section data-testid="s" />);
    const el = screen.getByTestId("s");
    expect(el.tagName).toBe("SECTION");
    expect(el).toHaveAttribute("data-spacing", "md");
    expect(el).toHaveAttribute("data-tone", "default");
  });

  it("reflects spacing and tone", () => {
    render(<Section spacing="lg" tone="accent" data-testid="s" />);
    const el = screen.getByTestId("s");
    expect(el).toHaveAttribute("data-spacing", "lg");
    expect(el).toHaveAttribute("data-tone", "accent");
  });

  it("renders as div, header or footer", () => {
    for (const as of ["div", "header", "footer"] as const) {
      render(<Section as={as} data-testid={as} />);
      expect(screen.getByTestId(as).tagName).toBe(as.toUpperCase());
    }
  });

  it("forwards its ref, merges className and spreads the rest", () => {
    const ref = createRef<HTMLElement>();
    render(<Section ref={ref} className="extra" aria-label="Pricing" />);
    const el = screen.getByRole("region", { name: "Pricing" });
    expect(ref.current).toBe(el);
    expect(el.className).toContain("extra");
  });
});
