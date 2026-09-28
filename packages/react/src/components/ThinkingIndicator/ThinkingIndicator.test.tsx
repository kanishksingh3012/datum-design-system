import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThinkingIndicator } from "./ThinkingIndicator";

describe("ThinkingIndicator", () => {
  it("is a status with a visible label and decorative dots", () => {
    const { container } = render(<ThinkingIndicator />);
    expect(screen.getByRole("status")).toHaveTextContent("Thinking…");
    expect(container.querySelector("[aria-hidden=true]")!.children).toHaveLength(3);
  });

  it("takes a custom label", () => {
    render(<ThinkingIndicator label="Searching the web" />);
    expect(screen.getByRole("status")).toHaveTextContent("Searching the web");
  });
});
