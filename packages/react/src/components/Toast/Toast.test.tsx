import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastQueue } from "react-stately";
import { Toaster, toast, type ToastContent } from "./Toast";

// Each test runs its own queue so toasts don't leak between tests.
const setup = (props: { position?: "top-center" | "top-end" | "bottom-center" | "bottom-end" } = {}) => {
  const queue = new ToastQueue<ToastContent>({ maxVisibleToasts: 5 });
  render(<Toaster queue={queue} {...props} />);
  return queue;
};

afterEach(() => {
  vi.useRealTimers();
});

describe("Toast", () => {
  it("renders nothing until a toast is added", () => {
    setup();
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("shows a toast inside a Notifications landmark, bottom-end by default", () => {
    const queue = setup();
    act(() => void toast({ title: "Saved", description: "Your changes are live.", duration: null }, queue));
    const region = screen.getByRole("region", { name: "Notifications" });
    expect(region).toHaveAttribute("data-position", "bottom-end");
    const dialog = screen.getByRole("alertdialog", { name: "Saved" });
    expect(dialog).toHaveAccessibleDescription("Your changes are live.");
    expect(dialog).toHaveAttribute("data-intent", "neutral");
  });

  it("reflects position on the region", () => {
    const queue = setup({ position: "top-center" });
    act(() => void toast({ title: "Hi", duration: null }, queue));
    expect(screen.getByRole("region")).toHaveAttribute("data-position", "top-center");
  });

  it("shows an icon for every intent except neutral", () => {
    const queue = setup();
    act(() => {
      toast({ title: "Plain", duration: null }, queue);
      toast({ title: "Failed", intent: "danger", duration: null }, queue);
    });
    expect(screen.getByRole("alertdialog", { name: "Plain" }).querySelector("svg[aria-hidden='true'] path[d^='M12 22']")).toBeNull();
    const danger = screen.getByRole("alertdialog", { name: "Failed" });
    expect(danger).toHaveAttribute("data-intent", "danger");
    expect(danger.querySelector("path[d^='M12 22']")).toBeInTheDocument();
  });

  it("closes from its close button and calls onClose", async () => {
    const queue = setup();
    const onClose = vi.fn();
    act(() => void toast({ title: "Saved", duration: null, onClose }, queue));
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalled();
  });

  it("runs the action and then closes", async () => {
    const queue = setup();
    const onAction = vi.fn();
    act(() => void toast({ title: "Deleted", action: { label: "Undo", onAction }, duration: null }, queue));
    await userEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes itself after the duration (5000ms by default)", () => {
    vi.useFakeTimers();
    const queue = setup();
    act(() => void toast({ title: "Saved" }, queue));
    act(() => void vi.advanceTimersByTime(4900));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(200));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes by key with toast.close", () => {
    const queue = setup();
    let key = "";
    act(() => void (key = toast({ title: "Syncing", duration: null }, queue)));
    act(() => toast.close(key, queue));
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});
