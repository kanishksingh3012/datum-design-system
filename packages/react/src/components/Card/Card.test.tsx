import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("defaults to variant=flat", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card")).toHaveAttribute("data-variant", "flat");
  });

  it("reflects the elevated variant", () => {
    render(
      <Card variant="elevated" data-testid="card">
        Content
      </Card>
    );
    expect(screen.getByTestId("card")).toHaveAttribute("data-variant", "elevated");
  });

  it("renders children", () => {
    render(<Card>Hello</Card>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
