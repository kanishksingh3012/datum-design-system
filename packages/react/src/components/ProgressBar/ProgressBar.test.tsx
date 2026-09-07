import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("exposes value via aria-valuenow and the label prop", () => {
    render(<ProgressBar value={65} label="Upload progress" />);
    const bar = screen.getByRole("progressbar", { name: "Upload progress" });
    expect(bar).toHaveAttribute("aria-valuenow", "65");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps values outside 0-100", () => {
    render(<ProgressBar value={150} label="Test" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps negative values to 0", () => {
    render(<ProgressBar value={-10} label="Test" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });
});
