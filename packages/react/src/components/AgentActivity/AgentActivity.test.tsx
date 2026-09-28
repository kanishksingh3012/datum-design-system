import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AgentActivity } from "./AgentActivity";

describe("AgentActivity", () => {
  it("renders a labelled ordered list of steps", () => {
    render(
      <AgentActivity
        items={[
          { kind: "reasoning", status: "success", label: "Planned", children: "trace" },
          { kind: "search", status: "running", label: "Searching docs" },
          { kind: "tool", status: "error", label: "run_tests", children: "exit 1" },
          { kind: "trace", status: "pending", label: "Log", children: "…" },
        ]}
      />
    );
    const list = screen.getByRole("list", { name: "Agent activity" });
    expect(list.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.getByText("Searching docs").closest("[data-status]")).toHaveAttribute("data-status", "running");
    expect(screen.getByRole("button", { name: /run_tests Failed/ })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(3);
  });
});
