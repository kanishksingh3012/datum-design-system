import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./Label";

describe("Label", () => {
  it("renders a real <label> and associates via htmlFor", () => {
    render(
      <>
        <Label htmlFor="custom-control">Volume</Label>
        <input id="custom-control" />
      </>
    );
    expect(screen.getByLabelText("Volume")).toBeInTheDocument();
  });

  it("shows a required marker that is hidden from assistive tech", () => {
    render(
      <>
        <Label htmlFor="email" required>Email</Label>
        <input id="email" required />
      </>
    );
    const marker = screen.getByText("*");
    expect(marker).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByLabelText(/Email/)).toBeRequired();
  });

  it("renders as a span to name a group", () => {
    render(<Label as="span" id="plan">Plan</Label>);
    expect(screen.getByText("Plan").tagName).toBe("SPAN");
  });
});
