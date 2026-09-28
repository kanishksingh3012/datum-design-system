import { afterEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ScrollArea } from "./ScrollArea";

const size = (prop: "scrollHeight" | "clientHeight" | "scrollTop", value: number) =>
  Object.defineProperty(HTMLElement.prototype, prop, { configurable: true, get: () => value });

afterEach(() => {
  for (const prop of ["scrollHeight", "clientHeight", "scrollTop"]) delete (HTMLElement.prototype as unknown as Record<string, unknown>)[prop];
});

describe("ScrollArea", () => {
  it("puts className, style and props on the box, with orientation and padding", () => {
    render(<ScrollArea data-testid="box" className="notes" maxHeight={120}>Content</ScrollArea>);
    const box = screen.getByTestId("box");
    expect(box).toHaveClass("notes");
    expect(box).toHaveTextContent("Content");
    expect(box).toHaveAttribute("data-orientation", "vertical");
    expect(box).toHaveAttribute("data-padding", "md");
    expect(box).toHaveStyle({ maxHeight: "120px" });
  });

  it("scrolls in an inner region, which the label names", () => {
    render(<ScrollArea data-testid="box" label="Release notes" orientation="both" padding="sm">Notes</ScrollArea>);
    const region = screen.getByRole("region", { name: "Release notes" });
    expect(region.parentElement).toBe(screen.getByTestId("box"));
    expect(screen.getByTestId("box")).toHaveAttribute("data-padding", "sm");
  });

  it("is a tab stop only while content is hidden, and fades the edges it is hidden past", () => {
    const { unmount } = render(<ScrollArea data-testid="box" label="Short">Short</ScrollArea>);
    expect(screen.getByRole("region")).not.toHaveAttribute("tabindex");
    expect(screen.getByTestId("box")).not.toHaveAttribute("data-fade");
    unmount();

    size("scrollHeight", 500);
    size("clientHeight", 100);
    render(<ScrollArea data-testid="box" label="Long">Long</ScrollArea>);
    const region = screen.getByRole("region");
    expect(region).toHaveAttribute("tabindex", "0");
    expect(screen.getByTestId("box")).toHaveAttribute("data-fade", "bottom");
    size("scrollTop", 200);
    fireEvent.scroll(region);
    expect(screen.getByTestId("box")).toHaveAttribute("data-fade", "top bottom");
    size("scrollTop", 400);
    fireEvent.scroll(region);
    expect(screen.getByTestId("box")).toHaveAttribute("data-fade", "top");
  });

  it("doesn't fade with fade={false}", () => {
    size("scrollHeight", 500);
    size("clientHeight", 100);
    render(<ScrollArea data-testid="box" fade={false}>Long</ScrollArea>);
    expect(screen.getByTestId("box")).not.toHaveAttribute("data-fade");
  });
});
