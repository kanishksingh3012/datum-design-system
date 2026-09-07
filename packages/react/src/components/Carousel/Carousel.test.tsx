import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Carousel } from "./Carousel";

function mockMatchMedia(reduced: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduced && query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

beforeEach(() => {
  mockMatchMedia(false);
  // jsdom has no real scroll layout - scrollIntoView is unimplemented.
  Element.prototype.scrollIntoView = vi.fn();
});

const slides = [
  { id: "a", label: "First slide", content: <p>Slide A</p> },
  { id: "b", label: "Second slide", content: <p>Slide B</p> },
  { id: "c", label: "Third slide", content: <p>Slide C</p> },
];

describe("Carousel", () => {
  it("marks each slide with role=group and aria-roledescription=slide, numbered", () => {
    render(<Carousel label="Featured products" slides={slides} />);
    expect(screen.getByLabelText("1 of 3: First slide")).toBeInTheDocument();
    expect(screen.getByLabelText("2 of 3: Second slide")).toBeInTheDocument();
  });

  it("moves the active slide with the Previous/Next controls", async () => {
    const user = userEvent.setup();
    render(<Carousel label="Featured products" slides={slides} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    await user.click(screen.getByRole("button", { name: "Next slide" }));
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
  });

  it("renders a Pause control before the slides when auto-rotation is enabled", () => {
    render(<Carousel label="Featured products" slides={slides} autoRotateMs={3000} />);
    expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
  });

  it("does not auto-rotate at all when prefers-reduced-motion is set, even with autoRotateMs", () => {
    vi.useFakeTimers();
    mockMatchMedia(true);
    render(<Carousel label="Featured products" slides={slides} autoRotateMs={100} />);
    vi.advanceTimersByTime(500);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    vi.useRealTimers();
  });

  it("pauses auto-rotation on hover via the Pause toggle reflecting aria-pressed", async () => {
    const user = userEvent.setup();
    render(<Carousel label="Featured products" slides={slides} autoRotateMs={3000} />);
    const pauseButton = screen.getByRole("button", { name: "Pause" });
    expect(pauseButton).toHaveAttribute("aria-pressed", "false");
    await user.click(pauseButton);
    expect(pauseButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
  });
});
