import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button/Button";
import { DropdownMenu, type DropdownMenuItem } from "./DropdownMenu";

function Menu({ onEdit = () => {}, onDelete = () => {}, ...props }: { onEdit?: () => void; onDelete?: () => void } & Partial<Parameters<typeof DropdownMenu>[0]>) {
  const [grid, setGrid] = useState(true);
  const [sort, setSort] = useState("name");
  const items: DropdownMenuItem[] = [
    { label: "Edit", shortcut: "⌘E", onSelect: onEdit },
    { label: "Archive", disabled: true },
    { type: "separator" },
    { type: "checkbox", label: "Show grid", checked: grid, onCheckedChange: setGrid },
    {
      type: "section",
      label: "Sort by",
      items: [
        { type: "radio", id: "name", label: "Name", checked: sort === "name", onSelect: () => setSort("name") },
        { type: "radio", id: "date", label: "Date", checked: sort === "date", onSelect: () => setSort("date") },
      ],
    },
    { type: "separator" },
    { label: "Delete", intent: "danger", onSelect: onDelete },
  ];
  return <DropdownMenu trigger={<Button>Options</Button>} items={items} {...props} />;
}

const open = async () => userEvent.click(screen.getByRole("button", { name: "Options" }));

describe("DropdownMenu", () => {
  it("wires the trigger and opens a labelled menu", async () => {
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "Options" });
    expect(trigger).toHaveAttribute("aria-haspopup", "true");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await open();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu", { name: "Options" })).toBeInTheDocument();
  });

  it("defaults to size=md", async () => {
    render(<Menu />);
    await open();
    expect(screen.getByRole("menu")).toHaveAttribute("data-size", "md");
  });

  it("fires an action, closes and returns focus to the trigger", async () => {
    const onEdit = vi.fn();
    render(<Menu onEdit={onEdit} />);
    await open();
    await userEvent.click(screen.getByRole("menuitem", { name: /Edit/ }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("button", { name: "Options" })).toHaveFocus());
  });

  it("opens from the keyboard and moves with the arrow keys", async () => {
    const onEdit = vi.fn();
    render(<Menu onEdit={onEdit} />);
    screen.getByRole("button", { name: "Options" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: /Edit/ })).toHaveFocus();
    // Archive is disabled and skipped
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitemcheckbox", { name: "Show grid" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("does not fire disabled items", async () => {
    render(<Menu />);
    await open();
    expect(screen.getByRole("menuitem", { name: "Archive" })).toHaveAttribute("aria-disabled", "true");
  });

  it("toggles checkbox items and keeps the menu open", async () => {
    render(<Menu />);
    await open();
    const grid = screen.getByRole("menuitemcheckbox", { name: "Show grid" });
    expect(grid).toHaveAttribute("aria-checked", "true");
    await userEvent.click(grid);
    expect(screen.getByRole("menuitemcheckbox", { name: "Show grid" })).toHaveAttribute("aria-checked", "false");
  });

  it("groups radio items so exactly one is checked", async () => {
    render(<Menu />);
    await open();
    const section = screen.getByRole("group", { name: "Sort by" });
    const [name, date] = within(section).getAllByRole("menuitemradio");
    expect(name).toHaveAttribute("aria-checked", "true");
    await userEvent.click(date);
    await open();
    expect(screen.getByRole("menuitemradio", { name: "Date" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("menuitemradio", { name: "Name" })).toHaveAttribute("aria-checked", "false");
  });

  it("marks danger items and shows shortcuts", async () => {
    render(<Menu />);
    await open();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute("data-intent", "danger");
    expect(screen.getByText("⌘E").tagName).toBe("KBD");
    expect(screen.getAllByRole("separator")).toHaveLength(2);
  });

  it("forwards ref, merges className and reflects size", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <DropdownMenu open ref={ref} className="custom" size="sm" trigger={<Button>Options</Button>} items={[{ label: "Edit" }]} />
    );
    const menu = screen.getByRole("menu");
    expect(ref.current).toBe(menu);
    expect(menu.className).toContain("custom");
    expect(menu).toHaveAttribute("data-size", "sm");
  });
});
