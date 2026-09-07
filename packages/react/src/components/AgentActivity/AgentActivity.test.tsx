import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AgentActivity } from "./AgentActivity";

describe("AgentActivity", () => {
  it("renders a real, labeled list of steps", () => {
    render(
      <AgentActivity
        label="Working on your request"
        items={[
          { kind: "trace", status: "complete", label: "Started" },
        ]}
      />
    );
    expect(screen.getByRole("list", { name: "Working on your request" })).toBeInTheDocument();
  });

  it("renders a reasoning step by delegating to Reasoning, not reimplementing it", () => {
    render(
      <AgentActivity
        items={[{ kind: "reasoning", status: "running", label: "Thinking it through", children: "Step 1..." }]}
      />
    );
    const details = screen.getByText("Thinking it through").closest("details")!;
    expect(details).toHaveAttribute("open");
    expect(screen.getByText("Step 1...")).toBeInTheDocument();
  });

  it("renders a tool step by delegating to ToolCall, with real status text", () => {
    render(
      <AgentActivity
        items={[{ kind: "tool", status: "error", label: "read_file", children: "File not found" }]}
      />
    );
    expect(screen.getByText("read_file").closest("details")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders a step with no children as a plain status line, nothing to disclose", () => {
    render(<AgentActivity items={[{ kind: "search", status: "complete", label: "Searched the docs" }]} />);
    expect(screen.getByText("Searched the docs").closest("details")).not.toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("renders a search/trace step with children as its own disclosure", () => {
    render(
      <AgentActivity
        items={[{ kind: "search", status: "complete", label: "Searched the docs", children: "3 results found" }]}
      />
    );
    expect(screen.getByText("Searched the docs").closest("details")).toBeInTheDocument();
    expect(screen.getByText("3 results found")).toBeInTheDocument();
  });
});
