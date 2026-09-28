import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";

const items = [
  { value: "one", label: "One", content: "First panel" },
  { value: "two", label: "Two", content: "Second panel" },
  { value: "three", label: "Three", disabled: true },
  { value: "four", label: "Four" },
];

describe("Tabs", () => {
  it("defaults to appearance=underline, size=md, horizontal, first tab selected", () => {
    render(<Tabs items={items} aria-label="Views" data-testid="tabs" />);
    const root = screen.getByTestId("tabs");
    expect(root).toHaveAttribute("data-appearance", "underline");
    expect(root).toHaveAttribute("data-size", "md");
    expect(root).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByRole("tablist", { name: "Views" })).toHaveAttribute("aria-orientation", "horizontal");
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
  });

  it("reflects appearance, size, orientation and fullWidth", () => {
    render(<Tabs items={items} appearance="segmented" size="sm" orientation="vertical" fullWidth data-testid="tabs" />);
    const root = screen.getByTestId("tabs");
    expect(root).toHaveAttribute("data-appearance", "segmented");
    expect(root).toHaveAttribute("data-size", "sm");
    expect(root).toHaveAttribute("data-full-width", "true");
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("shows the selected tab's panel, labelled by its tab", async () => {
    render(<Tabs items={items} defaultValue="two" />);
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveTextContent("Second panel");
    expect(panel).toHaveAccessibleName("Two");
    await userEvent.click(screen.getByRole("tab", { name: "One" }));
    expect(screen.getByRole("tabpanel")).toHaveTextContent("First panel");
  });

  it("is controlled with value and reports changes through onValueChange", async () => {
    const onValueChange = vi.fn();
    render(<Tabs items={items} value="one" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Two" }));
    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute("aria-selected", "true");
  });

  it("moves and selects with arrow keys, skipping disabled tabs", async () => {
    const onValueChange = vi.fn();
    render(<Tabs items={items} defaultValue="two" onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Two" }));
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Four" })).toHaveFocus();
    expect(onValueChange).toHaveBeenLastCalledWith("four");
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();
  });

  it("marks disabled tabs and never selects them", async () => {
    render(<Tabs items={items} />);
    const tab = screen.getByRole("tab", { name: "Three" });
    expect(tab).toHaveAttribute("data-disabled", "true");
    await userEvent.click(tab);
    expect(tab).toHaveAttribute("aria-selected", "false");
  });

  it("renders no panel when items carry no content", () => {
    render(<Tabs items={[{ value: "a", label: "A" }]} />);
    expect(screen.queryByRole("tabpanel")).toBeNull();
  });
});
