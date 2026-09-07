import { useState } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangePicker, type DateRange } from "./DateRangePicker";

beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      if (!this.open) return;
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  }
});

function Harness() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  return <DateRangePicker label="Trip dates" value={range} onChange={setRange} />;
}

function dayButton(label: string) {
  return screen
    .getAllByRole("gridcell")
    .map((cell) => cell.querySelector("button")!)
    .find((btn) => btn.textContent === label && !btn.hasAttribute("data-outside"))!;
}

describe("DateRangePicker", () => {
  it("defaults the trigger's accessible name to 'Choose dates'", () => {
    render(<Harness />);
    expect(screen.getByRole("button", { name: "Choose dates" })).toBeInTheDocument();
  });

  it("first click sets start, second click (later date) sets end and closes", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Choose dates" }));
    await user.click(dayButton("10"));
    expect(screen.getByRole("button", { name: /^Change dates, .* to end date$/ })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^Change dates, / }));
    await user.click(dayButton("20"));
    expect(screen.getByRole("button", { name: /^Change dates, .* to .*$/ })).toBeInTheDocument();
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("swaps start/end so the range stays chronological when the second click lands earlier", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Choose dates" }));
    await user.click(dayButton("20"));
    await user.click(screen.getByRole("button", { name: /^Change dates, / }));
    await user.click(dayButton("10"));
    const label = screen.getByRole("button", { name: /^Change dates, / }).textContent!;
    const [, range] = label.split("Change dates, ");
    const [start, end] = range.split(" to ");
    expect(start < end).toBe(true);
  });
});
