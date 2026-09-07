import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { getCalendarWeeks, getWeekdayLabels, formatMonthYear, toISODate } from "../../lib/calendarMonth";
import styles from "./DatePicker.module.css";

export interface DatePickerOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  /** ISO date string ("2026-03-14") or null for no selection. */
  value: string | null;
  onChange: (iso: string) => void;
  disabled?: boolean;
}

export type DatePickerProps = DatePickerOwnProps;

/**
 * Built on the APG Date Picker Dialog example: a text input + trigger
 * button opens a native <dialog> containing a real calendar grid
 * (role="grid", day cells are real buttons). The trigger's own
 * accessible name changes from "Choose date" to "Change date, <DATE>"
 * after a pick, so a screen reader confirms the selection out loud when
 * the dialog closes - not just a visual checkmark.
 */
export function DatePicker({ label, value, onChange, disabled }: DatePickerProps) {
  const inputId = useId();
  const headingId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => selectedDate ?? new Date());
  const [focusedISO, setFocusedISO] = useState(() => toISODate(selectedDate ?? new Date()));

  const weeks = getCalendarWeeks(viewMonth);

  function openPicker() {
    const base = selectedDate ?? new Date();
    setViewMonth(base);
    setFocusedISO(toISODate(base));
    setOpen(true);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    dayRefs.current.get(focusedISO)?.focus();
  }, [open, focusedISO, viewMonth]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function handleClose() {
      setOpen(false);
      triggerRef.current?.focus();
    }
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  function selectDay(iso: string) {
    onChange(iso);
    dialogRef.current?.close();
  }

  function moveFocus(deltaDays: number) {
    const current = new Date(`${focusedISO}T00:00:00`);
    current.setDate(current.getDate() + deltaDays);
    const nextISO = toISODate(current);
    setFocusedISO(nextISO);
    if (current.getMonth() !== viewMonth.getMonth() || current.getFullYear() !== viewMonth.getFullYear()) {
      setViewMonth(current);
    }
  }

  function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, iso: string) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveFocus(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveFocus(-1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      moveFocus(7);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveFocus(-7);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectDay(iso);
    }
  }

  function changeMonth(offset: number) {
    setViewMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  const triggerLabel = selectedDate
    ? `Change date, ${selectedDate.toLocaleDateString("en-US", { dateStyle: "long" })}`
    : "Choose date";

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <div className={styles.controls}>
        <input
          id={inputId}
          type="text"
          readOnly
          disabled={disabled}
          value={value ?? ""}
          aria-describedby={`${inputId}-format`}
          className={styles.input}
        />
        <span id={`${inputId}-format`} className={styles.visuallyHidden}>
          Date format: YYYY-MM-DD
        </span>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          className={styles.trigger}
          onClick={openPicker}
        >
          {triggerLabel}
        </button>
      </div>
      <dialog ref={dialogRef} className={styles.dialog} aria-label={`${label} calendar`}>
        <div className={styles.header}>
          <button type="button" aria-label="Previous month" className={styles.navButton} onClick={() => changeMonth(-1)}>
            &#8249;
          </button>
          <h2 id={headingId} className={styles.heading} aria-live="polite">
            {formatMonthYear(viewMonth)}
          </h2>
          <button type="button" aria-label="Next month" className={styles.navButton} onClick={() => changeMonth(1)}>
            &#8250;
          </button>
        </div>
        <table role="grid" aria-labelledby={headingId} className={styles.grid}>
          <thead>
            <tr>
              {getWeekdayLabels().map((day) => (
                <th key={day} scope="col" className={styles.weekday}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week) => (
              <tr key={week[0].iso} role="row">
                {week.map((day) => {
                  const isSelected = value === day.iso;
                  return (
                    <td key={day.iso} role="gridcell">
                      <button
                        ref={(node) => {
                          if (node) dayRefs.current.set(day.iso, node);
                          else dayRefs.current.delete(day.iso);
                        }}
                        type="button"
                        tabIndex={day.iso === focusedISO ? 0 : -1}
                        aria-selected={isSelected}
                        data-outside={day.isOutsideMonth || undefined}
                        className={styles.day}
                        onClick={() => selectDay(day.iso)}
                        onKeyDown={(event) => handleDayKeyDown(event, day.iso)}
                      >
                        {day.label}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </dialog>
    </div>
  );
}
