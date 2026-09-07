import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolCall } from "./ToolCall";

describe("ToolCall", () => {
  it("renders as a real <details>/<summary> disclosure with the tool name and status as real text", () => {
    render(
      <ToolCall name="search_web" status="running">
        Searching for "accessible date pickers"...
      </ToolCall>
    );
    expect(screen.getByText("search_web").closest("details")).toBeInTheDocument();
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("renders a real status word for every state - color is never the only signal", () => {
    const statuses = [
      ["pending", "Pending"],
      ["running", "Running"],
      ["complete", "Complete"],
      ["error", "Error"],
    ] as const;
    for (const [status, label] of statuses) {
      const { unmount } = render(<ToolCall name="tool" status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    }
  });

  it("respects defaultOpen", () => {
    render(<ToolCall name="tool" status="complete" defaultOpen />);
    expect(screen.getByText("tool").closest("details")).toHaveAttribute("open");
  });
});
