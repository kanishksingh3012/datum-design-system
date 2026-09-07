import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContextMenu } from "./ContextMenu";

const items = [
  { label: "Copy", onSelect: vi.fn() },
  { label: "Paste", onSelect: vi.fn() },
];

describe("ContextMenu", () => {
  it("is closed until a right-click opens it at the cursor", () => {
    render(
      <ContextMenu items={items}>
        <p>Right-click me</p>
      </ContextMenu>
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    fireEvent.contextMenu(screen.getByText("Right-click me"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
  });

  it("opens via Shift+F10 as the real Windows/Linux keyboard equivalent", () => {
    render(
      <ContextMenu items={items}>
        <p>Focus target</p>
      </ContextMenu>
    );
    const anchor = screen.getByText("Focus target").parentElement!;
    fireEvent.keyDown(anchor, { key: "F10", shiftKey: true });
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("calls onSelect and closes on click", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ContextMenu items={[{ label: "Copy", onSelect }]}>
        <p>Right-click me</p>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Right-click me"));
    await user.click(screen.getByRole("menuitem", { name: "Copy" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu items={items}>
        <p>Right-click me</p>
      </ContextMenu>
    );
    fireEvent.contextMenu(screen.getByText("Right-click me"));
    expect(screen.getByRole("menu")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
