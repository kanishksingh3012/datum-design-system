import { useState } from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "./Dialog";

/**
 * jsdom 25 renders a real <dialog> element but doesn't implement
 * .showModal()/.close() (confirmed: HTMLDialogElement.prototype.showModal
 * is undefined) or the native focus trap / :modal state that come with it.
 * This polyfills just enough of the open/close contract - toggling the
 * `open` attribute and firing the `close` event - to exercise our own
 * open/close/focus-restore wiring, which is real app code either way.
 * The native focus trap and Escape-to-close themselves are browser
 * behavior we rely on rather than reimplement, so they aren't (and can't
 * be) asserted here.
 */
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
});

describe("Dialog", () => {
  it("is closed until open=true", () => {
    render(<Dialog open={false} title="Delete this item?" onClose={() => {}} />);
    expect(screen.getByText("Delete this item?").closest("dialog")).not.toHaveAttribute("open");
  });

  it("calls showModal (native focus trap + Escape-to-close) when open becomes true", () => {
    const { rerender } = render(<Dialog open={false} title="Delete this item?" onClose={() => {}} />);
    rerender(<Dialog open title="Delete this item?" onClose={() => {}} />);
    expect(screen.getByText("Delete this item?").closest("dialog")).toHaveAttribute("open");
  });

  it("does not close on a click on the dialog element itself (safe default, no backdrop-dismiss)", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Dialog open title="Delete this item?" onClose={onClose} />);
    const dialog = screen.getByText("Delete this item?").closest("dialog")!;
    await user.click(dialog);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("fires onClose and restores focus to the trigger when the dialog's close event fires", async () => {
    function Harness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open dialog</button>
          <Dialog open={open} title="Delete this item?" onClose={() => setOpen(false)}>
            <button
              onClick={(e) => {
                e.currentTarget.closest("dialog")?.close();
              }}
            >
              Cancel
            </button>
          </Dialog>
        </>
      );
    }
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    trigger.focus();
    await user.click(trigger);
    expect(screen.getByText("Delete this item?").closest("dialog")).toHaveAttribute("open");

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByText("Delete this item?").closest("dialog")).not.toHaveAttribute("open");
    expect(document.activeElement).toBe(trigger);
  });
});
