import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollArea } from "./ScrollArea";

describe("ScrollArea", () => {
  it("renders its children in a scrolling box, vertical by default", () => {
    render(<ScrollArea data-testid="area" maxHeight={120}>Content</ScrollArea>);
    const area = screen.getByTestId("area");
    expect(area).toHaveTextContent("Content");
    expect(area).toHaveAttribute("data-orientation", "vertical");
    expect(area).toHaveStyle({ maxHeight: "120px" });
  });

  it("is a named region when labelled", () => {
    render(<ScrollArea label="Release notes" orientation="both">Notes</ScrollArea>);
    expect(screen.getByRole("region", { name: "Release notes" })).toHaveAttribute("data-orientation", "both");
  });

  it("is a tab stop only while its content overflows", () => {
    const { rerender } = render(<ScrollArea data-testid="area">Short</ScrollArea>);
    expect(screen.getByTestId("area")).not.toHaveAttribute("tabindex");
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", { configurable: true, get: () => 500 });
    rerender(<ScrollArea data-testid="area" orientation="horizontal">Short</ScrollArea>);
    expect(screen.getByTestId("area")).not.toHaveAttribute("tabindex");
    rerender(<ScrollArea data-testid="area" orientation="vertical">Long</ScrollArea>);
    expect(screen.getByTestId("area")).toHaveAttribute("tabindex", "0");
    delete (HTMLElement.prototype as { scrollHeight?: number }).scrollHeight;
  });
});
