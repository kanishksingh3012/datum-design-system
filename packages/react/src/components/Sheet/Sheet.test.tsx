import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button/Button";
import { DialogBody, DialogHeader } from "../Dialog/Dialog";
import { Sheet } from "./Sheet";

const content = (
  <>
    <DialogHeader>Filters</DialogHeader>
    <DialogBody>
      <Button>Apply</Button>
    </DialogBody>
  </>
);

describe("Sheet", () => {
  it("defaults to side=right and size=md", () => {
    render(<Sheet open>{content}</Sheet>);
    const sheet = screen.getByRole("dialog", { name: "Filters" });
    expect(sheet).toHaveAttribute("data-side", "right");
    expect(sheet).toHaveAttribute("data-size", "md");
  });

  it("reflects every side and size", () => {
    for (const side of ["top", "right", "bottom", "left"] as const) {
      for (const size of ["sm", "md", "lg"] as const) {
        const { unmount } = render(
          <Sheet open side={side} size={size}>
            {content}
          </Sheet>
        );
        const sheet = screen.getByRole("dialog");
        expect(sheet).toHaveAttribute("data-side", side);
        expect(sheet).toHaveAttribute("data-size", size);
        unmount();
      }
    }
  });

  it("opens from a trigger, closes on Escape and returns focus", async () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet trigger={<Button>Filters</Button>} onOpenChange={onOpenChange}>
        {content}
      </Sheet>
    );
    const trigger = screen.getByRole("button", { name: "Filters" });
    await userEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("always has a close button", async () => {
    const onOpenChange = vi.fn();
    render(
      <Sheet open onOpenChange={onOpenChange}>
        {content}
      </Sheet>
    );
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("forwards ref and merges className", () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <Sheet open ref={ref} className="custom">
        {content}
      </Sheet>
    );
    expect(ref.current).toBe(screen.getByRole("dialog"));
    expect(ref.current?.className).toContain("custom");
  });
});
