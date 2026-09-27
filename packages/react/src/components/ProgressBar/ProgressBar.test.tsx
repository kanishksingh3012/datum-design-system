import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("exposes the value on a progressbar named by its visible label", () => {
    render(<ProgressBar value={42} label="Uploading" />);
    const bar = screen.getByRole("progressbar", { name: "Uploading" });
    expect(bar).toHaveAttribute("aria-valuenow", "42");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("clamps the value to 0–100", () => {
    const { rerender } = render(<ProgressBar value={140} aria-label="p" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    rerender(<ProgressBar value={-5} aria-label="p" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("is indeterminate when value is omitted: no aria-valuenow", () => {
    render(<ProgressBar label="Preparing" showValue />);
    const bar = screen.getByRole("progressbar", { name: "Preparing" });
    expect(bar).not.toHaveAttribute("aria-valuenow");
    expect(bar).toHaveAttribute("data-indeterminate", "true");
    expect(bar).not.toHaveTextContent("%");
  });

  it("defaults to size=md and intent=accent", () => {
    render(<ProgressBar value={10} aria-label="p" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("data-size", "md");
    expect(bar).toHaveAttribute("data-intent", "accent");
  });

  it("reflects size and intent via data attributes", () => {
    render(<ProgressBar value={10} size="sm" intent="danger" aria-label="p" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("data-size", "sm");
    expect(bar).toHaveAttribute("data-intent", "danger");
  });

  it("shows the rounded percentage with showValue", () => {
    render(<ProgressBar value={33.6} label="Syncing" showValue />);
    expect(screen.getByText("34%")).toBeInTheDocument();
  });

  it("accepts aria-label when there is no visible label", () => {
    render(<ProgressBar value={50} aria-label="Profile complete" />);
    expect(screen.getByRole("progressbar", { name: "Profile complete" })).toBeInTheDocument();
  });
});
