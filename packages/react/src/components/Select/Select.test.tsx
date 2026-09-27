import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, type SelectOption, type SelectProps } from "./Select";

const options: SelectOption[] = [
  { value: "us", label: "United States", group: "Americas" },
  { value: "ca", label: "Canada", group: "Americas", description: "Bilingual support" },
  { value: "fr", label: "France", group: "Europe" },
  { value: "de", label: "Germany", group: "Europe", disabled: true },
];
const Country = (props: Partial<SelectProps>) => <Select label="Country" options={options} {...props} />;
const trigger = () => screen.getByRole("button", { name: /Country/ });

describe("Select", () => {
  it("renders a labelled trigger with the placeholder, size md", () => {
    render(<Country />);
    expect(trigger()).toHaveTextContent("Select…");
    expect(trigger()).toHaveAttribute("data-size", "md");
    expect(trigger()).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("opens a listbox with group headings and picks an option", async () => {
    const onValueChange = vi.fn();
    render(<Country onValueChange={onValueChange} />);
    await userEvent.click(trigger());
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getByRole("group", { name: "Europe" })).toBeInTheDocument();
    expect(within(listbox).getByRole("option", { name: "Germany" })).toHaveAttribute("aria-disabled", "true");
    expect(within(listbox).getByRole("option", { name: "Canada" })).toHaveAccessibleDescription("Bilingual support");
    await userEvent.click(within(listbox).getByRole("option", { name: "France" }));
    expect(onValueChange).toHaveBeenCalledWith("fr");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveTextContent("France");
  });

  it("works from the keyboard", async () => {
    render(<Country defaultValue="us" />);
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(trigger()).toHaveTextContent("Canada");
  });

  it("stays on the controlled value", async () => {
    render(<Country value="us" />);
    await userEvent.click(trigger());
    await userEvent.click(screen.getByRole("option", { name: "France" }));
    expect(trigger()).toHaveTextContent("United States");
  });

  it("describes the trigger with help text, replaced by error text", () => {
    const { rerender } = render(<Country helpText="Where you live" />);
    expect(trigger()).toHaveAccessibleDescription("Where you live");
    rerender(<Country helpText="Where you live" errorText="Choose a country" />);
    expect(trigger()).toHaveAccessibleDescription("Choose a country");
    expect(trigger()).toHaveAttribute("data-invalid", "true");
  });

  it("never opens when read-only, and is disabled when disabled", async () => {
    const { rerender } = render(<Country readOnly defaultValue="us" />);
    await userEvent.click(trigger());
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-readonly", "true");
    rerender(<Country disabled />);
    expect(trigger()).toBeDisabled();
  });

  it("submits through a hidden native select", () => {
    const { container } = render(<Country name="country" defaultValue="ca" />);
    expect(container.querySelector<HTMLSelectElement>("select[name=country]")!.value).toBe("ca");
  });

  it("reports open changes", async () => {
    const onOpenChange = vi.fn();
    render(<Country onOpenChange={onOpenChange} />);
    await userEvent.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});
