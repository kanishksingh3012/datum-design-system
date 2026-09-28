import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CommandPalette, type CommandPaletteItem, type CommandPaletteProps } from "./CommandPalette";

const make = (onSelect = vi.fn()): CommandPaletteItem[] => [
  { id: "new", label: "New file", group: "Files", shortcut: "⌘N", onSelect },
  { id: "open", label: "Open file", group: "Files", keywords: ["browse"] },
  { id: "theme", label: "Toggle theme", group: "View", description: "Light or dark" },
  { id: "zen", label: "Zen mode", group: "View", disabled: true },
];
const Palette = (props: Partial<CommandPaletteProps>) => <CommandPalette items={make()} {...props} />;
const search = () => screen.getByRole("combobox", { name: "Search commands" });
const labels = () => screen.queryAllByRole("option").map((o) => o.querySelector("span span")?.textContent ?? o.textContent);

describe("CommandPalette", () => {
  it("opens with ⌘K and Ctrl+K, focused on the search, and closes on Escape", async () => {
    const onOpenChange = vi.fn();
    render(<Palette onOpenChange={onOpenChange} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.keyboard("{Meta>}k{/Meta}");
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeInTheDocument();
    expect(search()).toHaveFocus();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await userEvent.keyboard("{Control>}k{/Control}");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("lists groups and filters by label and keywords, with an empty state", async () => {
    render(<Palette defaultOpen />);
    expect(within(screen.getByRole("listbox")).getByRole("group", { name: "View" })).toBeInTheDocument();
    await userEvent.type(search(), "browse");
    expect(labels()).toEqual(["Open file"]);
    await userEvent.clear(search());
    await userEvent.type(search(), "qqq");
    expect(labels()).toEqual([]);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("moves with arrows (skipping disabled, wrapping) and runs with Enter", async () => {
    const onSelect = vi.fn();
    const onAction = vi.fn();
    render(<CommandPalette items={make(onSelect)} onAction={onAction} defaultOpen />);
    const active = () => document.getElementById(search().getAttribute("aria-activedescendant") ?? "");
    expect(active()).toHaveTextContent("New file");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(active()).toHaveTextContent("Toggle theme");
    await userEvent.keyboard("{ArrowDown}");
    expect(active()).toHaveTextContent("New file");
    await userEvent.keyboard("{ArrowUp}");
    expect(active()).toHaveTextContent("Toggle theme");
    await userEvent.keyboard("{ArrowUp}{ArrowUp}{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith("new");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("runs an item on click, and holds the open trio", async () => {
    const onAction = vi.fn();
    const onOpenChange = vi.fn();
    const { rerender } = render(<Palette open onOpenChange={onOpenChange} onAction={onAction} />);
    await userEvent.click(screen.getByRole("option", { name: /Open file/ }));
    expect(onAction).toHaveBeenCalledWith("open");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    rerender(<Palette open={false} onOpenChange={onOpenChange} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("holds the search trio and clears it on close", async () => {
    const onSearchChange = vi.fn();
    render(<Palette defaultOpen defaultSearch="theme" onSearchChange={onSearchChange} />);
    expect(labels()).toEqual(["Toggle theme"]);
    await userEvent.keyboard("{Escape}");
    expect(onSearchChange).toHaveBeenLastCalledWith("");
  });

  it("ignores the hotkey when hotkey is false", async () => {
    render(<Palette hotkey={false} />);
    await userEvent.keyboard("{Meta>}k{/Meta}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
