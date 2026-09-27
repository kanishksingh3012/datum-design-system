import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("is a status with the default label \"Loading\"", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
  });

  it("uses a custom label as its screen-reader text", () => {
    render(<Spinner label="Saving draft" />);
    expect(screen.getByRole("status")).toHaveTextContent("Saving draft");
  });

  it("defaults to size=md and tone=current", () => {
    render(<Spinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("data-size", "md");
    expect(spinner).toHaveAttribute("data-tone", "current");
  });

  it("reflects size and tone via data attributes", () => {
    render(<Spinner size="lg" tone="accent" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("data-size", "lg");
    expect(spinner).toHaveAttribute("data-tone", "accent");
  });

  it("hides the ring from assistive tech", () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });
});
