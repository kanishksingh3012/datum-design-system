import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Reasoning } from "./Reasoning";

const trigger = () => screen.getByRole("button");

describe("Reasoning", () => {
  it("is a disclosure button, closed by default", () => {
    render(<Reasoning>Steps</Reasoning>);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveTextContent("Reasoning");
  });

  it("opens while streaming, with the streaming title and a busy polite region", () => {
    render(<Reasoning streaming>Steps</Reasoning>);
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    expect(trigger()).toHaveTextContent("Thinking…");
    const region = screen.getByText("Steps").closest("[aria-live]")!;
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-busy", "true");
  });

  it("settles closed after streaming ends", () => {
    vi.useFakeTimers();
    const { rerender } = render(<Reasoning streaming>Steps</Reasoning>);
    rerender(<Reasoning streaming={false}>Steps</Reasoning>);
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    act(() => vi.advanceTimersByTime(700));
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    vi.useRealTimers();
  });

  it("never overrides a manual toggle", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Reasoning streaming>Steps</Reasoning>);
    await user.click(trigger());
    await user.click(trigger());
    rerender(<Reasoning streaming={false}>Steps</Reasoning>);
    await new Promise((r) => setTimeout(r, 700));
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("supports the open trio", async () => {
    const onOpenChange = vi.fn();
    render(<Reasoning open={false} onOpenChange={onOpenChange}>Steps</Reasoning>);
    await userEvent.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });
});
