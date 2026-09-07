import { useState } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sheet } from "./Sheet";

// Same jsdom showModal/close gap as Dialog.test.tsx - see there for the
// full rationale. jsdom also has no PointerEvent constructor at all
// (confirmed directly), which silently no-ops fireEvent.pointer* without
// this - a minimal MouseEvent-based polyfill is enough to exercise our
// own pointerdown/move/up drag wiring under jsdom.
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      if (!this.open) return;
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  }
  if (typeof window.PointerEvent === "undefined") {
    class PointerEventPolyfill extends MouseEvent {
      pointerId: number;
      constructor(type: string, params: PointerEventInit = {}) {
        super(type, params);
        this.pointerId = params.pointerId ?? 0;
      }
    }
    // @ts-expect-error - minimal test-only polyfill, not a full PointerEvent
    window.PointerEvent = PointerEventPolyfill;
  }
});

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open sheet</button>
      <Sheet open={open} title="Filters" onClose={() => setOpen(false)}>
        <p>Sheet content</p>
      </Sheet>
    </>
  );
}

describe("Sheet", () => {
  it("is closed until open=true, defaults to side=bottom", () => {
    const { rerender } = render(<Sheet open={false} title="Filters" onClose={() => {}} />);
    rerender(<Sheet open title="Filters" onClose={() => {}} />);
    const dialog = screen.getByText("Filters").closest("dialog")!;
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAttribute("data-side", "bottom");
  });

  it("always renders a real, tappable Close button regardless of the drag handle", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Open sheet" }));
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("closes and restores focus to the trigger when Close is clicked", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open sheet" });
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.getByText("Filters").closest("dialog")).not.toHaveAttribute("open");
    expect(trigger).toHaveFocus();
  });

  it("dismisses on a drag past the threshold, and snaps back below it", () => {
    render(<Sheet open title="Filters" onClose={() => {}} side="bottom" />);
    const dialog = screen.getByText("Filters").closest("dialog")!;
    const handle = dialog.querySelector('[class*="handleArea"]')!;

    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 0, clientY: 30, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientX: 0, clientY: 30, pointerId: 1 });
    expect(dialog).toHaveAttribute("open");

    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 0, clientY: 200, pointerId: 1 });
    fireEvent.pointerUp(handle, { clientX: 0, clientY: 200, pointerId: 1 });
    expect(dialog).not.toHaveAttribute("open");
  });

  it("supports side=left, anchoring accordingly", () => {
    render(<Sheet open title="Nav" onClose={() => {}} side="left" />);
    expect(screen.getByText("Nav").closest("dialog")).toHaveAttribute("data-side", "left");
  });
});
