import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("defaults to one animated text line, hidden from assistive tech", () => {
    render(<Skeleton data-testid="sk" />);
    const sk = screen.getByTestId("sk");
    expect(sk).toHaveAttribute("data-shape", "text");
    expect(sk).toHaveAttribute("data-animated", "true");
    expect(sk).toHaveAttribute("aria-hidden", "true");
    expect(sk.children).toHaveLength(1);
  });

  it("renders one bar per line for text", () => {
    render(<Skeleton lines={3} data-testid="sk" />);
    expect(screen.getByTestId("sk").children).toHaveLength(3);
  });

  it("ignores lines for rect and circle", () => {
    render(<Skeleton shape="circle" lines={3} data-testid="sk" />);
    const sk = screen.getByTestId("sk");
    expect(sk).toHaveAttribute("data-shape", "circle");
    expect(sk.children).toHaveLength(0);
  });

  it("stops animating with animated=false", () => {
    render(<Skeleton animated={false} data-testid="sk" />);
    expect(screen.getByTestId("sk")).not.toHaveAttribute("data-animated");
  });

  it("applies width, and height for a rect", () => {
    render(<Skeleton shape="rect" width="60%" height={200} data-testid="sk" />);
    expect(screen.getByTestId("sk")).toHaveStyle({ width: "60%", height: "200px" });
  });
});
