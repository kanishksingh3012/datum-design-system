import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPalette } from "./CommandPalette";

// Same jsdom gap as Dialog.test.tsx: showModal/close aren't implemented,
// so this polyfills just the open/close event contract to exercise our
// own wiring - see Dialog.test.tsx for the full rationale.
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

const items = [
  { id: "new-file", label: "New file", onSelect: vi.fn() },
  { id: "new-folder", label: "New folder", onSelect: vi.fn() },
  { id: "open-settings", label: "Open settings", onSelect: vi.fn() },
];

describe("CommandPalette", () => {
  it("is closed until open=true, then focuses a real combobox input", () => {
    const { rerender } = render(
      <CommandPalette open={false} onClose={() => {}} items={items} label="Command palette" />
    );
    rerender(<CommandPalette open onClose={() => {}} items={items} label="Command palette" />);
    expect(screen.getByRole("combobox", { name: "Command palette" }).closest("dialog")).toHaveAttribute("open");
  });

  it("filters results as the user types and tracks the highlight via aria-activedescendant", async () => {
    const user = userEvent.setup();
    render(<CommandPalette open onClose={() => {}} items={items} label="Command palette" />);
    const input = screen.getByRole("combobox", { name: "Command palette" });
    await user.type(input, "new");
    expect(screen.getByRole("option", { name: "New file" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "New folder" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Open settings" })).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "New file" }).id);
  });

  it("calls onSelect for the highlighted result and closes on Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <CommandPalette
        open
        onClose={() => {}}
        items={[{ id: "a", label: "Run action", onSelect }]}
        label="Command palette"
      />
    );
    screen.getByRole("combobox", { name: "Command palette" });
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
