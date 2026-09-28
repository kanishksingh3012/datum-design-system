import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "./Carousel";

function mockMatchMedia(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

const slides = [
  { id: "a", label: "Alpha", content: <a href="#a">Alpha link</a> },
  { id: "b", label: "Beta", content: "Beta" },
  { id: "c", label: "Gamma", content: "Gamma" },
];

beforeEach(() => mockMatchMedia(false));
afterEach(() => vi.useRealTimers());

describe("Carousel", () => {
  it("is a labelled carousel of slides; only the current one is exposed", () => {
    render(<Carousel label="Featured" slides={slides} />);
    expect(screen.getByRole("region", { name: "Featured" })).toHaveAttribute("aria-roledescription", "carousel");
    expect(screen.getByRole("group", { name: "1 of 3: Alpha" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "2 of 3: Beta" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Slide 1: Alpha" })).toHaveAttribute("aria-current", "true");
  });

  it("moves with next, previous and the slide buttons, and wraps", async () => {
    const onValueChange = vi.fn();
    render(<Carousel label="Featured" slides={slides} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Previous slide" }));
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    await userEvent.click(screen.getByRole("button", { name: "Slide 2: Beta" }));
    expect(screen.getByRole("group", { name: "2 of 3: Beta" })).toBeInTheDocument();
  });

  it("stops at the ends without loop, and is controlled by value", () => {
    const { rerender } = render(<Carousel label="Featured" slides={slides} loop={false} value={0} />);
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
    rerender(<Carousel label="Featured" slides={slides} loop={false} value={2} />);
    expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
    expect(screen.getByRole("group", { name: "3 of 3: Gamma" })).toBeInTheDocument();
  });

  it("autoplays with a pause button, and stops when paused", async () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(<Carousel label="Featured" slides={slides} autoplay={1000} onValueChange={onValueChange} />);
    act(() => vi.advanceTimersByTime(1000));
    expect(onValueChange).toHaveBeenLastCalledWith(1);
    act(() => screen.getByRole("button", { name: "Stop slide rotation" }).click());
    // clicking focused the button, which also pauses; blur to rule that out
    act(() => (document.activeElement as HTMLElement).blur());
    act(() => vi.advanceTimersByTime(3000));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Start slide rotation" })).toBeInTheDocument();
  });

  it("never autoplays under reduced motion", () => {
    mockMatchMedia(true);
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(<Carousel label="Featured" slides={slides} autoplay={1000} onValueChange={onValueChange} />);
    act(() => vi.advanceTimersByTime(5000));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByRole("button", { name: /slide rotation/ })).not.toBeInTheDocument();
  });
});
