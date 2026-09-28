import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox, type ComboboxOption, type ComboboxProps } from "./Combobox";

const options: ComboboxOption[] = [
  { value: "us", label: "United States", group: "Americas" },
  { value: "ca", label: "Canada", group: "Americas" },
  { value: "fr", label: "France", group: "Europe" },
  { value: "de", label: "Germany", group: "Europe", disabled: true },
];
const Country = (props: Partial<ComboboxProps>) => <Combobox label="Country" options={options} {...props} />;
const input = () => screen.getByRole("combobox", { name: "Country" });

describe("Combobox", () => {
  it("renders a labelled combobox in the field box, size md", () => {
    render(<Country helpText="Where you're based." />);
    expect(input()).toHaveAccessibleDescription("Where you're based.");
    expect(input().closest("[data-control]")).toHaveAttribute("data-size", "md");
    expect(input()).toHaveAttribute("aria-expanded", "false");
  });

  it("filters as you type, with group headings, and says so when nothing matches", async () => {
    render(<Country />);
    await userEvent.type(input(), "an");
    const listbox = screen.getByRole("listbox");
    expect(within(listbox).getByRole("group", { name: "Americas" })).toBeInTheDocument();
    expect(within(listbox).getAllByRole("option").map((o) => o.textContent)).toEqual(["Canada", "France", "Germany"]);
    await userEvent.type(input(), "zzz");
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("No results")).toBeInTheDocument();
  });

  it("moves through the list with arrows and picks with Enter", async () => {
    const onValueChange = vi.fn();
    render(<Country onValueChange={onValueChange} />);
    await userEvent.click(input());
    await userEvent.keyboard("{ArrowDown}");
    const [first] = screen.getAllByRole("option");
    expect(input()).toHaveAttribute("aria-activedescendant", first.id);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("ca");
    expect(input()).toHaveValue("Canada");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("skips disabled options and closes on Escape", async () => {
    render(<Country />);
    await userEvent.type(input(), "e");
    expect(screen.getByRole("option", { name: "Germany" })).toHaveAttribute("aria-disabled", "true");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("holds the value, input and open trios", async () => {
    const onOpenChange = vi.fn();
    const onInputChange = vi.fn();
    const { rerender } = render(<Country value="fr" open onOpenChange={onOpenChange} onInputChange={onInputChange} />);
    expect(input()).toHaveValue("France");
    expect(screen.getAllByRole("option")).toHaveLength(4);
    rerender(<Country value="fr" open={false} onOpenChange={onOpenChange} onInputChange={onInputChange} />);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    rerender(<Country value="fr" onOpenChange={onOpenChange} onInputChange={onInputChange} />);
    await userEvent.type(input(), "x");
    expect(onInputChange).toHaveBeenLastCalledWith("Francex");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it("opens filtered by defaultInputValue", () => {
    render(<Country defaultInputValue="ger" defaultOpen />);
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual(["Germany"]);
  });

  it("is invalid, read-only or disabled", async () => {
    const { rerender } = render(<Country errorText="Pick a country." />);
    expect(input()).toHaveAttribute("aria-invalid", "true");
    expect(input()).toHaveAccessibleDescription("Pick a country.");
    rerender(<Country readOnly value="ca" />);
    expect(input()).toHaveAttribute("readonly");
    await userEvent.type(input(), "x");
    expect(input()).toHaveValue("Canada");
    rerender(<Country disabled />);
    expect(input()).toBeDisabled();
  });
});
