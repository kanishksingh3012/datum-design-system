import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox, CheckboxGroup } from "./Checkbox";

const row = (el: HTMLElement) => el.closest("label")!;

describe("Checkbox", () => {
  it("is a native checkbox named by its label, md and unchecked by default", () => {
    render(<Checkbox label="Remember me" />);
    const box = screen.getByRole("checkbox", { name: "Remember me" });
    expect(box.tagName).toBe("INPUT");
    expect(box).not.toBeChecked();
    expect(row(box)).toHaveAttribute("data-size", "md");
    expect(row(box)).toHaveAttribute("data-state", "unchecked");
  });

  it("toggles uncontrolled from a click on the label and reports it", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Subscribe" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText("Subscribe"));
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("toggles with the Space key", async () => {
    render(<Checkbox label="Subscribe" defaultChecked />);
    await userEvent.tab();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("stays put when controlled", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Locked" checked={false} onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText("Locked"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("shows indeterminate as mixed, and a press checks it", async () => {
    render(<Checkbox label="All" defaultChecked="indeterminate" />);
    const box = screen.getByRole<HTMLInputElement>("checkbox");
    expect(box.indeterminate).toBe(true);
    expect(row(box)).toHaveAttribute("data-state", "indeterminate");
    await userEvent.click(screen.getByText("All"));
    expect(box).toBeChecked();
    expect(box.indeterminate).toBe(false);
  });

  it("describes itself with description, and reflects size, invalid and disabled", () => {
    render(<Checkbox label="Terms" description="Required to continue" size="sm" invalid disabled />);
    const box = screen.getByRole("checkbox");
    expect(box).toHaveAccessibleDescription("Required to continue");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toBeDisabled();
    expect(row(box)).toHaveAttribute("data-size", "sm");
  });
});

describe("CheckboxGroup", () => {
  const Toppings = (props: Partial<React.ComponentProps<typeof CheckboxGroup>>) => (
    <CheckboxGroup label="Toppings" {...props}>
      <Checkbox value="cheese" label="Cheese" />
      <Checkbox value="olives" label="Olives" />
      <Checkbox value="basil" label="Basil" disabled />
    </CheckboxGroup>
  );

  it("is a labelled group that holds an array value", async () => {
    const onValueChange = vi.fn();
    render(<Toppings defaultValue={["cheese"]} onValueChange={onValueChange} />);
    expect(screen.getByRole("group", { name: "Toppings" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Cheese" })).toBeChecked();
    await userEvent.click(screen.getByText("Olives"));
    expect(onValueChange).toHaveBeenCalledWith(["cheese", "olives"]);
  });

  it("defaults to vertical and passes size down", () => {
    const { container } = render(<Toppings orientation="horizontal" size="sm" />);
    expect(container.querySelector("[data-orientation]")).toHaveAttribute("data-orientation", "horizontal");
    expect(row(screen.getByRole("checkbox", { name: "Cheese" }))).toHaveAttribute("data-size", "sm");
  });

  it("shows error text, describes the group and marks every checkbox invalid", () => {
    render(<Toppings helpText="Pick any" errorText="Pick at least one" />);
    expect(screen.getByRole("group")).toHaveAccessibleDescription("Pick at least one");
    expect(row(screen.getByRole("checkbox", { name: "Cheese" }))).toHaveAttribute("data-invalid", "true");
    expect(screen.queryByText("Pick any")).not.toBeInTheDocument();
  });

  it("disables one option or the whole group", () => {
    const { rerender } = render(<Toppings />);
    expect(screen.getByRole("checkbox", { name: "Basil" })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "Cheese" })).toBeEnabled();
    rerender(<Toppings disabled />);
    expect(screen.getByRole("checkbox", { name: "Cheese" })).toBeDisabled();
  });
});

describe("Checkbox naming", () => {
  it("keeps the description out of the accessible name", () => {
    render(<Checkbox label="Terms" description="Required to continue" />);
    expect(screen.getByRole("checkbox", { name: "Terms" })).toHaveAccessibleDescription("Required to continue");
  });
});
