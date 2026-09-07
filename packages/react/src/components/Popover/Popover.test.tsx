import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "./Popover";

describe("Popover", () => {
  it("is closed until the trigger is clicked, then shows the content", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Panel content</p>
      </Popover>
    );
    expect(screen.queryByText("Panel content")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });

  it("sets aria-expanded on the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Panel content</p>
      </Popover>
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<button>Open</button>}>
        <p>Panel content</p>
      </Popover>
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Panel content")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on an outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Popover trigger={<button>Open</button>}>
          <p>Panel content</p>
        </Popover>
        <button>Outside</button>
      </div>
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByText("Panel content")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByText("Panel content")).not.toBeInTheDocument();
  });
});
