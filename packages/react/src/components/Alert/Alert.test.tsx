import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("uses role=alert for the danger variant, interrupting immediately", () => {
    render(<Alert variant="danger" title="Payment failed" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Payment failed");
  });

  it("uses role=status for warning and success, announcing politely", () => {
    render(<Alert variant="warning" title="Storage almost full" />);
    expect(screen.getByRole("status")).toHaveTextContent("Storage almost full");
  });

  it("renders body text when provided", () => {
    render(<Alert variant="success" title="Saved" body="Your changes were saved." />);
    expect(screen.getByText("Your changes were saved.")).toBeInTheDocument();
  });
});
