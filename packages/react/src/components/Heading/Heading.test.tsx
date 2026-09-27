import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("defaults to an <h2> with size lg and tone primary", () => {
    render(<Heading>Pricing</Heading>);
    const el = screen.getByRole("heading", { name: "Pricing", level: 2 });
    expect(el.tagName).toBe("H2");
    expect(el).toHaveAttribute("data-size", "lg");
    expect(el).toHaveAttribute("data-tone", "primary");
  });

  it("derives the size from the level", () => {
    const expected = { 1: "xl", 2: "lg", 3: "md", 4: "sm", 5: "sm", 6: "sm" } as const;
    for (const level of [1, 2, 3, 4, 5, 6] as const) {
      render(<Heading level={level}>{`Level ${level}`}</Heading>);
      expect(screen.getByRole("heading", { level })).toHaveAttribute("data-size", expected[level]);
    }
  });

  it("keeps the semantic level when the size is overridden", () => {
    render(
      <Heading level={1} size="display-md">
        Build faster
      </Heading>
    );
    const el = screen.getByRole("heading", { name: "Build faster", level: 1 });
    expect(el).toHaveAttribute("data-size", "display-md");
  });

  it("reflects tone", () => {
    render(<Heading tone="accent">New</Heading>);
    expect(screen.getByRole("heading", { name: "New" })).toHaveAttribute("data-tone", "accent");
  });

  it("forwards its ref, merges className and spreads the rest", () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Heading ref={ref} className="extra" id="title">
        Title
      </Heading>
    );
    const el = screen.getByRole("heading", { name: "Title" });
    expect(ref.current).toBe(el);
    expect(el.className).toContain("extra");
    expect(el).toHaveAttribute("id", "title");
  });
});
