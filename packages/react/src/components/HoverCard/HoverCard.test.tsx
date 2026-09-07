import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HoverCard } from "./HoverCard";

describe("HoverCard", () => {
  it("is closed until hover, then opens after the open delay", async () => {
    const user = userEvent.setup();
    render(
      <HoverCard trigger={<a href="/profile">@jane</a>} openDelay={10} closeDelay={10}>
        Jane Doe - Product designer
      </HoverCard>
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await user.hover(screen.getByRole("link", { name: "@jane" }));
    await waitFor(() => expect(screen.getByRole("tooltip")).toHaveTextContent("Jane Doe - Product designer"));
  });

  it("closes after the close delay once the pointer leaves", async () => {
    const user = userEvent.setup();
    render(
      <HoverCard trigger={<a href="/profile">@jane</a>} openDelay={10} closeDelay={10}>
        Jane Doe
      </HoverCard>
    );
    const trigger = screen.getByRole("link", { name: "@jane" });
    await user.hover(trigger);
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());
    await user.unhover(trigger);
    await waitFor(() => expect(screen.queryByRole("tooltip")).not.toBeInTheDocument());
  });
});
