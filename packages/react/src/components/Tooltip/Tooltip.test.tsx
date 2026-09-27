import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button/Button";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  // first: React Aria skips the delay while another tooltip was just open
  it("waits for the delay on hover (default 500ms)", async () => {
    render(
      <Tooltip content="Search the docs">
        <Button>Search</Button>
      </Tooltip>
    );
    // React Aria only opens on hover once it has seen the pointer being used
    await userEvent.click(document.body);
    const start = Date.now();
    await userEvent.hover(screen.getByRole("button", { name: "Search" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await screen.findByRole("tooltip", undefined, { timeout: 1500 });
    expect(Date.now() - start).toBeGreaterThanOrEqual(450);
  });

  it("is hidden until the trigger is focused, then describes it", async () => {
    render(
      <Tooltip content="Search the docs">
        <Button>Search</Button>
      </Tooltip>
    );
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    await userEvent.tab();
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toHaveTextContent("Search the docs");
    expect(screen.getByRole("button", { name: "Search" })).toHaveAccessibleDescription("Search the docs");
  });

  it("hides on Escape", async () => {
    render(
      <Tooltip content="Search the docs">
        <Button>Search</Button>
      </Tooltip>
    );
    await userEvent.tab();
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("defaults to placement=top and forwards ref, className and props", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Tooltip content="Hint" open ref={ref} className="custom" data-testid="t">
        <Button>Trigger</Button>
      </Tooltip>
    );
    const tooltip = screen.getByTestId("t");
    expect(ref.current).toBe(tooltip);
    expect(tooltip.className).toContain("custom");
    expect(tooltip).toHaveAttribute("data-placement", "top");
  });
});
