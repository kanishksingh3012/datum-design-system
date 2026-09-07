import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThinkingIndicator } from "./ThinkingIndicator";

describe("ThinkingIndicator", () => {
  it("uses role=status (implicit aria-live=polite) with real visible text, not dots alone", () => {
    render(<ThinkingIndicator />);
    expect(screen.getByRole("status")).toHaveTextContent("Thinking...");
  });

  it("hides the decorative dots from the accessibility tree", () => {
    const { container } = render(<ThinkingIndicator />);
    expect(container.querySelector('[class*="dots"]')).toHaveAttribute("aria-hidden", "true");
  });

  it("accepts a custom label", () => {
    render(<ThinkingIndicator label="Searching the web..." />);
    expect(screen.getByRole("status")).toHaveTextContent("Searching the web...");
  });
});
