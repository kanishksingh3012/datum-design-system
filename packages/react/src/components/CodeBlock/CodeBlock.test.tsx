import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "./CodeBlock";

describe("CodeBlock", () => {
  it("renders plain code with hidden line numbers", () => {
    const { container } = render(<CodeBlock code={"a\nb"} language="ts" />);
    expect(container.querySelectorAll("[aria-hidden=true]")).toHaveLength(2 + 1); // two numbers + the copy icon
    expect(screen.getByText("ts")).toBeInTheDocument();
  });

  it("styles tokens by kind, never by color", () => {
    const { container } = render(<CodeBlock lines={[{ tokens: [{ text: "const", kind: "keyword" }, { text: " x" }] }]} />);
    const keyword = screen.getByText("const");
    expect(keyword).toHaveAttribute("data-kind", "keyword");
    expect(container.querySelector("[style]")).toBeNull();
  });

  it("copies only the code and announces it", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CodeBlock code={"a\nb"} />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("a\nb");
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
  });
});
