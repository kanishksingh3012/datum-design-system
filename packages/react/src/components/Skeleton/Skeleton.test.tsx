import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("defaults to shape=text", () => {
    render(<Skeleton data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveAttribute("data-shape", "text");
  });

  it("reflects the avatar shape", () => {
    render(<Skeleton shape="avatar" data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveAttribute("data-shape", "avatar");
  });

  it("applies a custom width", () => {
    render(<Skeleton width="60%" data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveStyle({ width: "60%" });
  });
});
