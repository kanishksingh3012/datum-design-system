import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio, RadioGroup, type RadioGroupProps } from "./Radio";

const Plans = (props: Partial<RadioGroupProps>) => (
  <RadioGroup label="Plan" {...props}>
    <Radio value="free" label="Free" description="For personal projects" />
    <Radio value="pro" label="Pro" />
    <Radio value="team" label="Team" disabled />
  </RadioGroup>
);
const row = (el: HTMLElement) => el.closest("label")!;

describe("RadioGroup", () => {
  it("is a labelled radiogroup of native radios sharing one name", () => {
    render(<Plans />);
    const group = screen.getByRole("radiogroup", { name: "Plan" });
    const radios = screen.getAllByRole("radio");
    expect(group).toHaveAttribute("aria-orientation", "vertical");
    expect(radios[0].tagName).toBe("INPUT");
    expect(radios[0].getAttribute("name")).toBe(radios[1].getAttribute("name"));
  });

  it("selects on click and reports the value", async () => {
    const onValueChange = vi.fn();
    render(<Plans onValueChange={onValueChange} />);
    await userEvent.click(screen.getByText("Pro"));
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("pro");
    expect(row(screen.getByRole("radio", { name: "Pro" }))).toHaveAttribute("data-state", "checked");
  });

  it("moves the selection with arrow keys, skipping disabled options", async () => {
    render(<Plans defaultValue="free" />);
    await userEvent.tab();
    expect(screen.getByRole("radio", { name: "Free" })).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Pro" })).toBeChecked();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Free" })).toBeChecked();
  });

  it("follows value when controlled", async () => {
    render(<Plans value="free" />);
    await userEvent.click(screen.getByText("Pro"));
    expect(screen.getByRole("radio", { name: "Free" })).toBeChecked();
  });

  it("passes size, appearance and orientation down", () => {
    render(<Plans size="sm" appearance="card" orientation="horizontal" />);
    const pro = row(screen.getByRole("radio", { name: "Pro" }));
    expect(pro).toHaveAttribute("data-size", "sm");
    expect(pro).toHaveAttribute("data-appearance", "card");
    expect(pro).toHaveAttribute("data-control");
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("describes an option with its description and the group with error text", () => {
    render(<Plans helpText="Change any time" errorText="Choose a plan" required />);
    expect(screen.getByRole("radio", { name: "Free" })).toHaveAccessibleDescription(/For personal projects/);
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("radiogroup")).toHaveAccessibleDescription("Choose a plan");
    expect(screen.getByRole("radiogroup")).toHaveAttribute("aria-required", "true");
  });

  it("throws outside a RadioGroup", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Radio value="x" label="X" />)).toThrow(/inside a RadioGroup/);
  });
});
