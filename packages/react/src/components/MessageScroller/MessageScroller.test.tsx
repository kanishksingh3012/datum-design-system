import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MessageScroller } from "./MessageScroller";

// jsdom has no real scroll geometry (scrollHeight/scrollTop/clientHeight
// always read 0) and no scrollTo at all - confirmed directly, the same
// class of gap as PointerEvent/matchMedia/showModal elsewhere in this
// project. Geometry is faked via defineProperty per test and scrollTo is
// polyfilled here so the pin-detection and scroll-to-bottom logic can
// actually be exercised.
beforeAll(() => {
  if (!Element.prototype.scrollTo) {
    Element.prototype.scrollTo = vi.fn();
  }
});

function setGeometry(el: HTMLElement, { scrollHeight, scrollTop, clientHeight }: Record<string, number>) {
  Object.defineProperty(el, "scrollHeight", { value: scrollHeight, configurable: true });
  Object.defineProperty(el, "scrollTop", { value: scrollTop, configurable: true });
  Object.defineProperty(el, "clientHeight", { value: clientHeight, configurable: true });
}

describe("MessageScroller", () => {
  it("renders a real role=log container", () => {
    render(
      <MessageScroller>
        <p>Message one</p>
      </MessageScroller>
    );
    expect(screen.getByRole("log")).toBeInTheDocument();
  });

  it("scrolls to the live edge when new content arrives while pinned", () => {
    const scrollToSpy = vi.spyOn(Element.prototype, "scrollTo");
    const { rerender } = render(
      <MessageScroller>
        <p key="1">Message one</p>
      </MessageScroller>
    );
    scrollToSpy.mockClear();
    rerender(
      <MessageScroller>
        <p key="1">Message one</p>
        <p key="2">Message two</p>
      </MessageScroller>
    );
    expect(scrollToSpy).toHaveBeenCalled();
    scrollToSpy.mockRestore();
  });

  it("stops following once the reader scrolls away, and calls onPinnedChange", () => {
    const onPinnedChange = vi.fn();
    const scrollToSpy = vi.spyOn(Element.prototype, "scrollTo");
    const { rerender } = render(
      <MessageScroller onPinnedChange={onPinnedChange}>
        <p key="1">Message one</p>
      </MessageScroller>
    );
    const log = screen.getByRole("log");
    setGeometry(log, { scrollHeight: 1000, scrollTop: 0, clientHeight: 400 });
    fireEvent.scroll(log);
    expect(onPinnedChange).toHaveBeenCalledWith(false);

    scrollToSpy.mockClear();
    rerender(
      <MessageScroller onPinnedChange={onPinnedChange}>
        <p key="1">Message one</p>
        <p key="2">Message two</p>
      </MessageScroller>
    );
    expect(scrollToSpy).not.toHaveBeenCalled();
    scrollToSpy.mockRestore();
  });
});
