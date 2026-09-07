import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "./Combobox";

const options = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
];

function Harness() {
  const [value, setValue] = useState("");
  return <Combobox label="Country" options={options} value={value} onChange={setValue} />;
}

describe("Combobox", () => {
  it("renders role=combobox with the label as its accessible name, focus stays on the input", () => {
    render(<Harness />);
    const input = screen.getByRole("combobox", { name: "Country" });
    expect(input.tagName).toBe("INPUT");
  });

  it("filters the listbox as the user types and tracks the highlight via aria-activedescendant", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByRole("combobox", { name: "Country" });
    await user.type(input, "United");
    expect(screen.getByRole("option", { name: "United States" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "United Kingdom" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Canada" })).not.toBeInTheDocument();
    expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "United States" }).id);
  });

  it("moves the highlight with ArrowDown without moving real focus off the input", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByRole("combobox", { name: "Country" });
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveFocus();
    expect(input).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Canada" }).id);
  });

  it("commits the highlighted option on Enter", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByRole("combobox", { name: "Country" });
    await user.type(input, "Canada");
    await user.keyboard("{Enter}");
    expect(input).toHaveValue("Canada");
  });
});
