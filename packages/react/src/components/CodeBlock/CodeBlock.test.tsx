import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "./CodeBlock";
import { linesFromCode, linesText } from "../../lib/codeTokens";

describe("CodeBlock", () => {
  it("renders one line per source line with aria-hidden line numbers", () => {
    render(<CodeBlock code={"const a = 1;\nconst b = 2;"} language="typescript" />);
    expect(screen.getByText("const a = 1;")).toBeInTheDocument();
    expect(screen.getByText("const b = 2;")).toBeInTheDocument();
    expect(screen.getByText("1")).toHaveAttribute("aria-hidden", "true");
  });

  it("renders pre-tokenized lines with per-token styling", () => {
    render(
      <CodeBlock
        lines={[{ tokens: [{ text: "const ", color: "#ff0000" }, { text: "x" }] }]}
      />
    );
    expect(screen.getByText("const")).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("extracts plain-text source from lines - what a copy should contain, not the gutter", () => {
    expect(linesText(linesFromCode("line one\nline two"))).toBe("line one\nline two");
  });

  it("shows a real 'Copied' confirmation after clicking Copy", async () => {
    const user = userEvent.setup();
    render(<CodeBlock lines={linesFromCode("line one\nline two")} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });
});
