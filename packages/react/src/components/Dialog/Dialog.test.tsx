import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button/Button";
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "./Dialog";

function Controlled(props: Partial<Parameters<typeof Dialog>[0]>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Dialog open={open} onOpenChange={setOpen} {...props}>
        <DialogHeader description="This can't be undone.">Delete project?</DialogHeader>
        <DialogBody>All files will be removed.</DialogBody>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

describe("Dialog", () => {
  it("renders nothing until open", () => {
    render(<Controlled />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is named by DialogHeader and described by its description", async () => {
    render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByRole("dialog", { name: "Delete project?" });
    expect(dialog).toHaveAccessibleDescription("This can't be undone.");
  });

  it("defaults to size=md and role=dialog, and supports alertdialog", async () => {
    const { unmount } = render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toHaveAttribute("data-size", "md");
    unmount();
    render(<Controlled role="alertdialog" size="sm" />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("alertdialog")).toHaveAttribute("data-size", "sm");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Controlled />);
    const trigger = screen.getByRole("button", { name: "Open" });
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("closes from the header's close button", async () => {
    render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("ignores Escape and hides the close button when dismissible=false", async () => {
    render(<Controlled dismissible={false} />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("moves focus inside and keeps Tab there", async () => {
    render(<Controlled />);
    await userEvent.click(screen.getByRole("button", { name: "Open" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.contains(document.activeElement)).toBe(true);
    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("opens from a trigger and passes close to function children", async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog trigger={<Button>Edit</Button>} onOpenChange={onOpenChange}>
        {(close) => (
          <>
            <DialogHeader>Edit name</DialogHeader>
            <DialogFooter>
              <Button onClick={close}>Done</Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    );
    const trigger = screen.getByRole("button", { name: "Edit" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.click(screen.getByRole("button", { name: "Done" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("forwards ref, merges className and spreads props onto the dialog", () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <Dialog open ref={ref} className="custom" data-testid="d">
        <DialogHeader>Title</DialogHeader>
      </Dialog>
    );
    const dialog = screen.getByTestId("d");
    expect(ref.current).toBe(dialog);
    expect(dialog.className).toContain("custom");
  });
});
