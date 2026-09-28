import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button/Button";
import { Popover } from "./Popover";

const trigger = <Button>Filters</Button>;

describe("Popover", () => {
  it("wires the trigger and opens a dialog named by its title", async () => {
    render(
      <Popover trigger={trigger} title="Filter results">
        <p>Panel content</p>
      </Popover>
    );
    const button = screen.getByRole("button", { name: "Filters" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Panel content")).not.toBeInTheDocument();
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    const dialog = screen.getByRole("dialog", { name: "Filter results" });
    expect(dialog).toHaveTextContent("Panel content");
    expect(button).toHaveAttribute("aria-controls", dialog.parentElement!.id || dialog.id);
  });

  it("without a title, the trigger names it", async () => {
    render(<Popover trigger={trigger}>Content</Popover>);
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
  });

  it("moves focus in, closes on Escape and returns focus to the trigger", async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover trigger={trigger} onOpenChange={onOpenChange}>
        <input aria-label="Min price" />
      </Popover>
    );
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await waitFor(() => expect(screen.getByRole("dialog")).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(screen.getByRole("button", { name: "Filters" })).toHaveFocus());
  });

  it("closes on a click outside", async () => {
    render(
      <>
        <Popover trigger={trigger} defaultOpen>Content</Popover>
        <p>Elsewhere</p>
      </>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Elsewhere"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is controlled by open", () => {
    const { rerender } = render(<Popover trigger={trigger} open={false}>Content</Popover>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(<Popover trigger={trigger} open>Content</Popover>);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("puts className and other props on the panel", () => {
    render(<Popover trigger={trigger} defaultOpen className="wide" data-testid="panel">Content</Popover>);
    expect(screen.getByTestId("panel")).toHaveClass("wide");
    expect(screen.getByTestId("panel")).toHaveAttribute("role", "dialog");
  });
});
