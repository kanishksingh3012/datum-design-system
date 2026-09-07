import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";

const items = [
  { value: "one", label: "One" },
  { value: "two", label: "Two" },
  { value: "three", label: "Three", disabled: true },
];

describe("Tabs", () => {
  it("wires role=tablist/tab and aria-selected on the active tab", () => {
    render(<Tabs items={items} active="two" onChange={() => {}} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "false");
  });

  it("calls onChange when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={items} active="one" onChange={onChange} />);
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(onChange).toHaveBeenCalledWith("two");
  });

  it("moves focus and selection with ArrowRight, skipping disabled tabs", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Tabs items={items} active="two" onChange={onChange} />);
    screen.getByRole("tab", { name: "Two" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("one");
  });

  it("disables the disabled tab", () => {
    render(<Tabs items={items} active="one" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "Three" })).toBeDisabled();
  });
});
