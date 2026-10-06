import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarDate, parseDate } from "@internationalized/date";
import { DateRangePicker, type DateRangePickerProps } from "./DateRangePicker";

const Trip = (props: Partial<DateRangePickerProps>) => <DateRangePicker label="Trip" {...props} />;
const group = () => screen.getByRole("group", { name: "Trip" });
const button = () => within(group()).getByRole("button");
const day = (n: number) => within(screen.getByRole("grid")).getByRole("button", { name: new RegExp(`(^|, )\\w+day, September ${n}, 2026( selected)?$`) });
const range = { start: parseDate("2026-09-08"), end: parseDate("2026-09-11") };

describe("DateRangePicker", () => {
  it("renders start and end segments and a calendar button, size md", () => {
    render(<Trip defaultValue={range} />);
    expect(group()).toHaveAttribute("data-size", "md");
    expect(within(group()).getAllByRole("spinbutton").map((s) => s.textContent)).toEqual(["9", "8", "2026", "9", "11", "2026"]);
  });

  it("marks the range: ends selected, the days between in the band", () => {
    render(<Trip defaultValue={range} defaultOpen />);
    expect(day(8)).toHaveAttribute("data-selected");
    expect(day(11)).toHaveAttribute("data-selected");
    expect(day(9)).not.toHaveAttribute("data-selected");
    expect(day(9).closest("td")).toHaveAttribute("data-in-range");
    expect(day(8).closest("td")).toHaveAttribute("data-range-start");
    expect(day(11).closest("td")).toHaveAttribute("data-range-end");
  });

  it("picks a range from the keyboard: arrows move, Enter sets start then end", async () => {
    const onValueChange = vi.fn();
    render(<Trip defaultValue={range} onValueChange={onValueChange} />);
    await userEvent.click(button());
    expect(day(8)).toHaveFocus();
    // Enter sets the start and (React Aria, for ranges) moves focus on a day
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(day(16)).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    // mid-selection: the band follows focus
    expect(day(15).closest("td")).toHaveAttribute("data-range-start");
    expect(day(16).closest("td")).toHaveAttribute("data-in-range");
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith({ start: new CalendarDate(2026, 9, 15), end: new CalendarDate(2026, 9, 17) });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape and holds the open trio", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Trip defaultValue={range} open onOpenChange={onOpenChange} />);
    await userEvent.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    rerender(<Trip defaultValue={range} open={false} onOpenChange={onOpenChange} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is invalid, read-only or disabled", () => {
    const { rerender } = render(<Trip errorText="Choose your dates." />);
    expect(group()).toHaveAttribute("data-invalid", "true");
    rerender(<Trip readOnly />);
    expect(button()).toBeDisabled();
    rerender(<Trip disabled />);
    expect(within(group()).getAllByRole("spinbutton")[0]).toHaveAttribute("aria-disabled", "true");
  });

  it("jumps months and years from the caption", async () => {
    render(<Trip defaultValue={range} defaultOpen />);
    const caption = () => within(screen.getByRole("heading", { hidden: true })).getByRole("button");
    await userEvent.click(caption());
    await userEvent.click(caption());
    await userEvent.click(screen.getByRole("button", { name: "2025" }));
    await userEvent.click(screen.getByRole("button", { name: "Jan" }));
    expect(caption()).toHaveTextContent("January 2025");
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
