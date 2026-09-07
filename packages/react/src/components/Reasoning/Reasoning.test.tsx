import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Reasoning } from "./Reasoning";

function getDetails() {
  return screen.getByText("Reasoning").closest("details")!;
}

describe("Reasoning", () => {
  it("renders as a real <details>/<summary> disclosure, closed by default", () => {
    render(<Reasoning>Working through the steps...</Reasoning>);
    expect(getDetails()).not.toHaveAttribute("open");
  });

  it("opens automatically while streaming", () => {
    render(<Reasoning streaming>Working through the steps...</Reasoning>);
    expect(getDetails()).toHaveAttribute("open");
  });

  it("settles closed shortly after streaming ends", async () => {
    const { rerender } = render(<Reasoning streaming>Working...</Reasoning>);
    expect(getDetails()).toHaveAttribute("open");
    rerender(<Reasoning streaming={false}>Working...</Reasoning>);
    await waitFor(() => expect(getDetails()).not.toHaveAttribute("open"), { timeout: 1500 });
  });

  it("never overrides a manual toggle with the auto-collapse timer", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Reasoning streaming>Working...</Reasoning>);
    rerender(<Reasoning streaming={false}>Working...</Reasoning>);
    // Reader manually keeps it open before the auto-collapse timer fires.
    await user.click(screen.getByText("Reasoning"));
    await user.click(screen.getByText("Reasoning"));
    await new Promise((resolve) => setTimeout(resolve, 700));
    expect(getDetails()).toHaveAttribute("open");
  });
});
