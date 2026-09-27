import { describe, expect, it } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("defaults to intent=neutral, appearance=soft and size=md", () => {
    render(<Badge>Draft</Badge>);
    const badge = screen.getByText("Draft");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).toHaveAttribute("data-intent", "neutral");
    expect(badge).toHaveAttribute("data-appearance", "soft");
    expect(badge).toHaveAttribute("data-size", "md");
  });

  it("reflects every intent × appearance combination via data attributes", () => {
    const intents = ["accent", "neutral", "danger", "success", "warning", "info"] as const;
    const appearances = ["solid", "soft", "outline"] as const;
    for (const intent of intents) {
      for (const appearance of appearances) {
        render(<Badge intent={intent} appearance={appearance}>{`${intent}-${appearance}`}</Badge>);
        const badge = screen.getByText(`${intent}-${appearance}`);
        expect(badge).toHaveAttribute("data-intent", intent);
        expect(badge).toHaveAttribute("data-appearance", appearance);
      }
    }
  });

  it("renders a decorative leading dot only when dot is set", () => {
    const { rerender } = render(<Badge>Live</Badge>);
    expect(screen.getByText("Live").querySelector("[aria-hidden]")).toBeNull();
    rerender(<Badge dot size="sm">Live</Badge>);
    const badge = screen.getByText("Live");
    expect(badge).toHaveAttribute("data-size", "sm");
    expect(badge.firstElementChild).toHaveAttribute("aria-hidden", "true");
    expect(badge).toHaveTextContent(/^Live$/);
  });

  it("forwards its ref and merges className", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref} className="custom">New</Badge>);
    expect(ref.current).toBe(screen.getByText("New"));
    expect(ref.current?.className).toContain("custom");
  });
});
