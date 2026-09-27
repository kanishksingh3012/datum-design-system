import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("defaults to intent=info and appearance=soft, announced politely", () => {
    render(<Alert title="New version available" />);
    const alert = screen.getByRole("status");
    expect(alert).toHaveAttribute("data-intent", "info");
    expect(alert).toHaveAttribute("data-appearance", "soft");
    expect(alert).toHaveTextContent("New version available");
  });

  it("uses role=alert for danger, interrupting immediately", () => {
    render(<Alert intent="danger" title="Payment failed" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Payment failed");
  });

  it("reflects every intent × appearance combination via data attributes", () => {
    const intents = ["info", "success", "warning", "danger", "neutral"] as const;
    const appearances = ["soft", "outline", "solid"] as const;
    for (const intent of intents) {
      for (const appearance of appearances) {
        const { container, unmount } = render(<Alert intent={intent} appearance={appearance} title="t" />);
        const alert = container.firstElementChild!;
        expect(alert).toHaveAttribute("data-intent", intent);
        expect(alert).toHaveAttribute("data-appearance", appearance);
        expect(alert.querySelector("svg[aria-hidden='true']")).toBeInTheDocument();
        unmount();
      }
    }
  });

  it("keeps rounded ends unless fullBleed", () => {
    const { rerender } = render(<Alert appearance="solid" title="Banner" />);
    expect(screen.getByRole("status")).not.toHaveAttribute("data-full-bleed");
    rerender(<Alert appearance="solid" title="Banner" fullBleed />);
    expect(screen.getByRole("status")).toHaveAttribute("data-full-bleed", "true");
  });

  it("renders the description and the action", () => {
    render(<Alert title="Saved" description="Your changes were saved." action={<button>Undo</button>} />);
    expect(screen.getByText("Your changes were saved.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("has no dismiss button unless dismissible", () => {
    render(<Alert title="Heads up" />);
    expect(screen.queryByRole("button", { name: "Dismiss" })).not.toBeInTheDocument();
  });

  it("hides itself when dismissed (uncontrolled) and reports open=false", async () => {
    const onOpenChange = vi.fn();
    render(<Alert title="Heads up" dismissible onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByText("Heads up")).not.toBeInTheDocument();
  });

  it("stays visible when controlled until the owner closes it", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Alert title="Heads up" dismissible open onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    rerender(<Alert title="Heads up" dismissible open={false} onOpenChange={onOpenChange} />);
    expect(screen.queryByText("Heads up")).not.toBeInTheDocument();
  });

  it("starts hidden with defaultOpen=false", () => {
    render(<Alert title="Heads up" defaultOpen={false} />);
    expect(screen.queryByText("Heads up")).not.toBeInTheDocument();
  });
});
