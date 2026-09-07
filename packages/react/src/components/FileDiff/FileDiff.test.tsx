import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { FileDiff, type DiffRow } from "./FileDiff";

const rows: DiffRow[] = [
  { kind: "hunk", content: "@@ -1,2 +1,2 @@" },
  { kind: "remove", oldLine: 1, content: "const x = 1;" },
  { kind: "add", newLine: 1, content: "const x = 2;" },
  { kind: "context", oldLine: 2, newLine: 2, content: "console.log(x);" },
];

describe("FileDiff", () => {
  it("renders as a real <table> inside a <details> disclosure, with real +/- marker text", () => {
    render(<FileDiff path="src/index.ts" rows={rows} />);
    expect(screen.getByText("src/index.ts").closest("details")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Changes to src/index.ts" })).toBeInTheDocument();
    const removedRow = screen.getByText("const x = 1;").closest("tr")!;
    expect(removedRow).toHaveTextContent("-");
  });

  it("shows live +/- counts derived from the rows", () => {
    render(<FileDiff path="src/index.ts" rows={rows} />);
    expect(screen.getByText("+1")).toBeInTheDocument();
    expect(screen.getByText("-1")).toBeInTheDocument();
  });

  it("stays open while streaming and settles closed shortly after", async () => {
    const { rerender } = render(<FileDiff path="src/index.ts" rows={rows} streaming />);
    const details = screen.getByText("src/index.ts").closest("details")!;
    expect(details).toHaveAttribute("open");
    rerender(<FileDiff path="src/index.ts" rows={rows} streaming={false} />);
    await waitFor(() => expect(details).not.toHaveAttribute("open"), { timeout: 1500 });
  });
});
