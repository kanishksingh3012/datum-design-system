import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CalendarDate, parseDate } from "@internationalized/date";
import { DatePicker, type DatePickerProps } from "./DatePicker";

const Due = (props: Partial<DatePickerProps>) => <DatePicker label="Due date" {...props} />;
const group = () => screen.getByRole("group", { name: "Due date" });
const button = () => within(group()).getByRole("button");
const day = (n: number) => within(screen.getByRole("grid")).getByRole("button", { name: new RegExp(`September ${n}, 2026`) });

describe("DatePicker", () => {
  it("renders a labelled group of date segments and a calendar button, size md", () => {
    render(<Due defaultValue={parseDate("2026-09-28")} helpText="Pick a weekday." />);
    expect(group()).toHaveAttribute("data-size", "md");
    const spins = within(group()).getAllByRole("spinbutton");
    expect(spins.map((s) => s.textContent)).toEqual(["9", "28", "2026"]);
    expect(spins[0]).toHaveAccessibleDescription(/Pick a weekday\./);
  });

  it("types a date segment by segment", async () => {
    const onValueChange = vi.fn();
    render(<Due onValueChange={onValueChange} />);
    await userEvent.click(within(group()).getAllByRole("spinbutton")[0]);
    await userEvent.keyboard("10152026");
    expect(onValueChange).toHaveBeenLastCalledWith(new CalendarDate(2026, 10, 15));
  });

  it("opens the calendar, moves with arrows and picks with Enter", async () => {
    const onValueChange = vi.fn();
    const onOpenChange = vi.fn();
    render(<Due defaultValue={parseDate("2026-09-10")} onValueChange={onValueChange} onOpenChange={onOpenChange} />);
    await userEvent.click(button());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(day(10)).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}{ArrowDown}");
    expect(day(18)).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenLastCalledWith(new CalendarDate(2026, 9, 18));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape, and pages months with the previous / next buttons", async () => {
    render(<Due defaultValue={parseDate("2026-09-10")} defaultOpen />);
    expect(screen.getByRole("heading", { hidden: true })).toHaveTextContent("September 2026");
    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { hidden: true })).toHaveTextContent("October 2026");
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("won't pick an unavailable or out-of-range day", async () => {
    const onValueChange = vi.fn();
    render(
      <Due
        defaultOpen
        defaultValue={parseDate("2026-09-10")}
        minValue={parseDate("2026-09-05")}
        isDateUnavailable={(d) => d.day === 12}
        onValueChange={onValueChange}
      />
    );
    expect(day(3)).toHaveAttribute("aria-disabled", "true");
    await userEvent.click(day(12));
    await userEvent.click(day(3));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("holds the value and open trios", () => {
    const { rerender } = render(<Due value={parseDate("2026-01-02")} open />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    rerender(<Due value={parseDate("2026-01-03")} open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(within(group()).getAllByRole("spinbutton")[1]).toHaveTextContent("3");
  });

  it("is invalid, read-only or disabled", () => {
    const { rerender } = render(<Due errorText="Choose a date." />);
    expect(group()).toHaveAttribute("data-invalid", "true");
    expect(within(group()).getAllByRole("spinbutton")[0]).toHaveAccessibleDescription("Choose a date.");
    rerender(<Due readOnly />);
    expect(button()).toBeDisabled();
    rerender(<Due disabled />);
    expect(within(group()).getAllByRole("spinbutton")[0]).toHaveAttribute("aria-disabled", "true");
  });

  describe("month and year selection", () => {
    const caption = () => within(screen.getByRole("heading", { hidden: true })).getByRole("button");
    const option = (name: string) => screen.getByRole("button", { name });

    it("picks a month from the caption's month grid", async () => {
      render(<Due defaultValue={parseDate("2026-09-10")} defaultOpen />);
      await userEvent.click(caption());
      expect(screen.queryByRole("grid")).not.toBeInTheDocument();
      expect(within(screen.getByRole("group", { name: "Months" })).getAllByRole("button")).toHaveLength(12);
      expect(option("Sep")).toHaveAttribute("aria-pressed", "true");
      expect(option("Sep")).toHaveFocus();
      await userEvent.click(option("Dec"));
      expect(caption()).toHaveTextContent("December 2026");
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("picks a year, then a month, and previous / next step years and pages", async () => {
      render(<Due defaultValue={parseDate("2026-09-10")} defaultOpen />);
      await userEvent.click(caption());
      await userEvent.click(screen.getByRole("button", { name: "Next year" }));
      expect(caption()).toHaveTextContent("2027");
      await userEvent.click(caption());
      expect(caption()).toHaveTextContent("2016 – 2027");
      await userEvent.click(screen.getByRole("button", { name: "Next years" }));
      await userEvent.click(option("2030"));
      expect(caption()).toHaveTextContent("2030");
      await userEvent.click(option("Feb"));
      expect(caption()).toHaveTextContent("February 2030");
    });

    it("moves with arrows, picks with Enter, and Escape returns to the days without closing", async () => {
      render(<Due defaultValue={parseDate("2026-09-10")} defaultOpen />);
      await userEvent.click(caption());
      await userEvent.keyboard("{ArrowRight}{ArrowDown}");
      expect(option("Dec")).toHaveFocus();
      await userEvent.keyboard("{ArrowUp}{ArrowLeft}{Enter}");
      expect(caption()).toHaveTextContent("August 2026");
      await userEvent.click(caption());
      await userEvent.keyboard("{Escape}");
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("keeps months and years inside minValue and maxValue", async () => {
      render(<Due defaultValue={parseDate("2026-09-10")} minValue={parseDate("2026-03-15")} maxValue={parseDate("2027-02-10")} defaultOpen />);
      await userEvent.click(caption());
      expect(option("Feb")).toBeDisabled();
      expect(option("Mar")).toBeEnabled();
      expect(screen.getByRole("button", { name: "Previous year" })).toBeDisabled();
      await userEvent.click(caption());
      expect(option("2025")).toBeDisabled();
      expect(screen.getByRole("button", { name: "Next years" })).toBeDisabled();
      await userEvent.click(option("2027"));
      // September 2027 is past the max, so the calendar lands on the max's month
      expect(option("Feb")).toHaveAttribute("aria-pressed", "true");
      expect(option("Mar")).toBeDisabled();
    });
  });
});
