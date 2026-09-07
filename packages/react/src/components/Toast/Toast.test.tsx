import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toast } from "./Toast";

describe("Toast", () => {
  it("uses role=status, not role=alert, since it confirms rather than interrupts", () => {
    render(<Toast text="Changes saved" />);
    expect(screen.getByRole("status")).toHaveTextContent("Changes saved");
  });

  it("omits the dismiss button when onDismiss isn't passed", () => {
    render(<Toast text="Changes saved" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onDismiss when the dismiss button is clicked", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Toast text="Changes saved" onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
