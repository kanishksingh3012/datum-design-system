import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { getCalendarWeeks, getWeekdayLabels, formatMonthYear, toISODate } from "../../lib/calendarMonth";
import styles from "./DateRangePicker.module.css";

export interface DateRange {
  start: string | null;
  end: string | null;
}

export interface DateRangePickerOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  value: DateRange;
  onChange: (range: DateRange) => void;
  disabled?: boolean;
}

export type DateRangePickerProps = DateRangePickerOwnProps;

/**
 * The same calendar grid as DatePicker, with two-click range selection
 * layered on: the first click sets `start` (clearing `end`), the second
 * click sets `end` (swapping the two if it lands before `start`, so the
 * range is always chronological regardless of click order).
 */
export function DateRangePicker({ label, value, onChange, disabled }: DateRangePickerProps) {
  const headingId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dayRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => (value.start ? new Date(`${value.start}T00:00:00`) : new Date()));
  const [focusedISO, setFocusedISO] = useState(() => toISODate(viewMonth));

  const weeks = getCalendarWeeks(viewMonth);

  function openPicker() {
    const base = value.start ? new Date(`${value.start}T00:00:00`) : new Date();
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

  function pickDay(iso: string) {
    if (!value.start || value.end) {
      onChange({ start: iso, end: null });
      return;
    }
    if (iso < value.start) {
      onChange({ start: iso, end: value.start });
    } else {
      onChange({ start: value.start, end: iso });
    }
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
      pickDay(iso);
    }
  }

  function changeMonth(offset: number) {
    setViewMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  function isInRange(iso: string) {
    if (!value.start || !value.end) return false;
    return iso > value.start && iso < value.end;
  }

  const triggerLabel =
    value.start && value.end
      ? `Change dates, ${value.start} to ${value.end}`
      : value.start
        ? `Change dates, ${value.start} to end date`
        : "Choose dates";

  return (
    <div className={styles.root}>
      <span className={styles.label}>{label}</span>
      <div className={styles.controls}>
        <button ref={triggerRef} type="button" disabled={disabled} className={styles.trigger} onClick={openPicker}>
          {triggerLabel}
        </button>
      </div>
      <dialog ref={dialogRef} className={styles.dialog} aria-label={`${label} calendar`}>
        <div className={styles.header}>
          <button
            type="button"
            aria-label="Previous month"
            className={styles.navButton}
            onClick={() => changeMonth(-1)}
          >
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
                  const isEndpoint = day.iso === value.start || day.iso === value.end;
                  return (
                    <td key={day.iso} role="gridcell">
                      <button
                        ref={(node) => {
                          if (node) dayRefs.current.set(day.iso, node);
                          else dayRefs.current.delete(day.iso);
                        }}
                        type="button"
                        tabIndex={day.iso === focusedISO ? 0 : -1}
                        aria-selected={isEndpoint}
                        data-outside={day.isOutsideMonth || undefined}
                        data-in-range={isInRange(day.iso) || undefined}
                        className={styles.day}
                        onClick={() => pickDay(day.iso)}
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
