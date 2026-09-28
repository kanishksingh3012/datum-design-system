import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MessageScroller } from "./MessageScroller";

/** jsdom has no layout: give the viewport a scroll geometry. */
function geometry(el: HTMLElement, scrollHeight: number, clientHeight = 100) {
  Object.defineProperty(el, "scrollHeight", { configurable: true, get: () => scrollHeight });
  Object.defineProperty(el, "clientHeight", { configurable: true, get: () => clientHeight });
}

describe("MessageScroller", () => {
  it("is a labelled region around a log", () => {
    render(<MessageScroller label="Chat">x</MessageScroller>);
    expect(screen.getByRole("region", { name: "Chat" })).toBeInTheDocument();
    expect(screen.getByRole("log")).toHaveTextContent("x");
  });

  it("follows new content while pinned, and lets go when the reader scrolls up", () => {
    const onPinnedChange = vi.fn();
    const { rerender } = render(<MessageScroller onPinnedChange={onPinnedChange}><p>1</p></MessageScroller>);
    const viewport = screen.getByRole("region");
    geometry(viewport, 500);
    rerender(<MessageScroller onPinnedChange={onPinnedChange}><p>1</p><p>2</p></MessageScroller>);
    expect(viewport.scrollTop).toBe(500);

    viewport.scrollTop = 100;
    fireEvent.scroll(viewport);
    expect(onPinnedChange).toHaveBeenCalledWith(false);
    geometry(viewport, 800);
    rerender(<MessageScroller onPinnedChange={onPinnedChange}><p>1</p><p>2</p><p>3</p></MessageScroller>);
    expect(viewport.scrollTop).toBe(100);

    fireEvent.click(screen.getByRole("button", { name: "Jump to latest" }));
    expect(viewport.scrollTop).toBe(800);
    expect(onPinnedChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("can start unpinned, with the jump button showing", () => {
    render(<MessageScroller defaultPinned={false}>x</MessageScroller>);
    expect(screen.getByRole("button", { name: "Jump to latest" })).toBeInTheDocument();
  });
});
