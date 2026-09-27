import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stack } from "./Stack";

describe("Stack", () => {
  it("defaults to vertical, gap md, align stretch, justify start, no wrap", () => {
    render(<Stack data-testid="s" />);
    const el = screen.getByTestId("s");
    expect(el).toHaveAttribute("data-direction", "vertical");
    expect(el).toHaveAttribute("data-gap", "md");
    expect(el).toHaveAttribute("data-align", "stretch");
    expect(el).toHaveAttribute("data-justify", "start");
    expect(el).not.toHaveAttribute("data-wrap");
  });

  it("reflects every gap", () => {
    for (const gap of ["none", "xs", "sm", "md", "lg", "xl"] as const) {
      render(<Stack gap={gap} data-testid={gap} />);
      expect(screen.getByTestId(gap)).toHaveAttribute("data-gap", gap);
    }
  });

  it("reflects direction, align, justify and wrap", () => {
    render(<Stack direction="horizontal" align="baseline" justify="between" wrap data-testid="s" />);
    const el = screen.getByTestId("s");
    expect(el).toHaveAttribute("data-direction", "horizontal");
    expect(el).toHaveAttribute("data-align", "baseline");
    expect(el).toHaveAttribute("data-justify", "between");
    expect(el).toHaveAttribute("data-wrap", "true");
  });

  it("renders children in order", () => {
    render(
      <Stack data-testid="s">
        <span>One</span>
        <span>Two</span>
      </Stack>
    );
    expect(screen.getByTestId("s").textContent).toBe("OneTwo");
  });

  it("forwards its ref and merges className", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Stack ref={ref} className="extra" data-testid="s" />);
    expect(ref.current).toBe(screen.getByTestId("s"));
    expect(ref.current?.className).toContain("extra");
  });
});
