import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FileDiff, type DiffRow } from "./FileDiff";

const rows: DiffRow[] = [
  { kind: "hunk", content: "@@ -1,2 +1,2 @@" },
  { kind: "context", oldLine: 1, newLine: 1, content: "a" },
  { kind: "remove", oldLine: 2, content: "b" },
  { kind: "add", newLine: 2, content: "c" },
];

describe("FileDiff", () => {
  it("summarises the counts in its trigger", () => {
    render(<FileDiff path="src/a.ts" rows={rows} />);
    expect(screen.getByRole("button")).toHaveAccessibleName(/src\/a\.ts 1 added 1 removed/);
  });

  it("is a table whose markers are spoken as words", () => {
    render(<FileDiff path="src/a.ts" rows={rows} defaultOpen />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Added").closest("tr")).toHaveAttribute("data-kind", "add");
    expect(screen.getByText("Removed").closest("tr")).toHaveAttribute("data-kind", "remove");
  });

  it("stays open while streaming", () => {
    render(<FileDiff path="a" rows={rows} streaming />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });
});
