import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HoverCard } from "./HoverCard";

const card = (props: Partial<Parameters<typeof HoverCard>[0]> = {}) => (
  <HoverCard trigger={<a href="/ada">@ada</a>} openDelay={10} closeDelay={10} {...props}>
    Ada Lovelace — first programmer
  </HoverCard>
);

describe("HoverCard", () => {
  it("opens after the delay on hover and describes the trigger", async () => {
    render(card());
    const link = screen.getByRole("link", { name: "@ada" });
    expect(screen.queryByText(/first programmer/)).not.toBeInTheDocument();
    await userEvent.hover(link);
    await waitFor(() => expect(screen.getByText(/first programmer/)).toBeInTheDocument());
    expect(link).toHaveAccessibleDescription("Ada Lovelace — first programmer");
  });

  it("closes after the pointer leaves, but stays while it is on the card", async () => {
    render(card());
    const link = screen.getByRole("link");
    await userEvent.hover(link);
    const body = await screen.findByText(/first programmer/);
    await userEvent.hover(body);
    await new Promise((r) => setTimeout(r, 30));
    expect(screen.getByText(/first programmer/)).toBeInTheDocument();
    await userEvent.unhover(body);
    await waitFor(() => expect(screen.queryByText(/first programmer/)).not.toBeInTheDocument());
  });

  it("opens on keyboard focus and closes on Escape", async () => {
    const onOpenChange = vi.fn();
    render(card({ onOpenChange }));
    await userEvent.tab();
    await waitFor(() => expect(screen.getByText(/first programmer/)).toBeInTheDocument());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByText(/first programmer/)).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("stays open while keyboard focus is inside the card, and Tab past it moves on", async () => {
    render(
      <>
        <HoverCard trigger={<a href="/ada">@ada</a>} openDelay={10} closeDelay={10}>
          <a href="/profile">View profile</a>
        </HoverCard>
        <a href="/next">Next</a>
      </>
    );
    await userEvent.tab();
    await screen.findByRole("link", { name: "View profile" });
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "View profile" })).toHaveFocus();
    await new Promise((r) => setTimeout(r, 40));
    expect(screen.getByRole("link", { name: "View profile" })).toBeInTheDocument();
    await userEvent.tab();
    expect(screen.getByRole("link", { name: "Next" })).toHaveFocus();
    await waitFor(() => expect(screen.queryByRole("link", { name: "View profile" })).not.toBeInTheDocument());
  });

  it("is controlled by open, with className and props on the card", () => {
    const { rerender } = render(card({ open: false }));
    expect(screen.queryByText(/first programmer/)).not.toBeInTheDocument();
    rerender(card({ open: true, className: "profile", "data-testid": "card" } as never));
    expect(screen.getByTestId("card")).toHaveClass("profile");
  });
});
