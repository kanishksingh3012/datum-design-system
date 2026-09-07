import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropdownMenu } from "./DropdownMenu";

const items = [
  { label: "Edit", onSelect: vi.fn() },
  { label: "Duplicate", onSelect: vi.fn() },
  { label: "Delete", onSelect: vi.fn(), disabled: true },
];

describe("DropdownMenu", () => {
  it("is closed until the trigger opens it, then shows real menuitems", async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Actions</button>} items={items} />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
  });

  it("focuses the first item on open and moves with ArrowDown/ArrowUp", async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Actions</button>} items={items} />);
    await user.click(screen.getByRole("button", { name: "Actions" }));
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveFocus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus();
  });

  it("calls onSelect and closes, returning focus to the trigger, on Enter", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<DropdownMenu trigger={<button>Actions</button>} items={[{ label: "Edit", onSelect }]} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    await user.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<DropdownMenu trigger={<button>Actions</button>} items={items} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
