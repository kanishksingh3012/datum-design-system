import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextMenu, type ContextMenuItem } from "./ContextMenu";

const setup = (props: Partial<Parameters<typeof ContextMenu>[0]> = {}) => {
  const onCopy = vi.fn();
  const items: ContextMenuItem[] = [
    { label: "Copy", shortcut: "⌘C", onSelect: onCopy },
    { label: "Paste", disabled: true },
    { type: "separator" },
    { label: "Delete", intent: "danger" },
  ];
  render(
    <ContextMenu items={items} {...props}>
      <button>Target</button>
    </ContextMenu>
  );
  return { onCopy };
};

describe("ContextMenu", () => {
  it("is closed until a right-click opens a labelled menu, focused on the first item", async () => {
    setup();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    fireEvent.contextMenu(screen.getByText("Target"), { clientX: 40, clientY: 30 });
    expect(screen.getByRole("menu", { name: "Context menu" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("menuitem", { name: /Copy/ })).toHaveFocus());
    expect(screen.getByRole("menuitem", { name: /Paste/ })).toHaveAttribute("aria-disabled", "true");
  });

  it("opens with Shift+F10 from something focused inside", async () => {
    setup();
    screen.getByText("Target").focus();
    await userEvent.keyboard("{Shift>}{F10}{/Shift}");
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("runs an action, closes and hands focus back", async () => {
    const { onCopy } = setup();
    const target = screen.getByText("Target");
    target.focus();
    fireEvent.contextMenu(target, { clientX: 10, clientY: 10 });
    await userEvent.click(screen.getByRole("menuitem", { name: /Copy/ }));
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await waitFor(() => expect(target).toHaveFocus());
  });

  it("closes on Escape and reports open changes", async () => {
    const onOpenChange = vi.fn();
    setup({ onOpenChange });
    fireEvent.contextMenu(screen.getByText("Target"), { clientX: 10, clientY: 10 });
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await waitFor(() => expect(screen.getByRole("menuitem", { name: /Copy/ })).toHaveFocus());
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("disabled leaves the browser's menu alone; defaultOpen, size and menuLabel", () => {
    setup({ disabled: true });
    expect(fireEvent.contextMenu(screen.getAllByText("Target")[0], { clientX: 5, clientY: 5 })).toBe(true);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    setup({ defaultOpen: true, size: "sm", menuLabel: "Row actions" });
    expect(screen.getByRole("menu", { name: "Row actions" })).toHaveAttribute("data-size", "sm");
  });
});
