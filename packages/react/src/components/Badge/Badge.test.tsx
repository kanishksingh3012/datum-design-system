import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("defaults to variant=neutral", () => {
    render(<Badge>Draft</Badge>);
    expect(screen.getByText("Draft")).toHaveAttribute("data-variant", "neutral");
  });

  it("reflects the variant prop", () => {
    render(<Badge variant="danger">Failed</Badge>);
    expect(screen.getByText("Failed")).toHaveAttribute("data-variant", "danger");
  });

  it("renders as a span, not an interactive element", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New").tagName).toBe("SPAN");
  });
});
