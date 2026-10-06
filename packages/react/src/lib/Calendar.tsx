import { useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import { endOfMonth, getWeeksInMonth, isSameDay, isToday, startOfMonth, toCalendarDate, today, type CalendarDate, type DateValue } from "@internationalized/date";
import {
  DismissButton,
  Overlay,
  mergeProps,
  useButton,
  useCalendarCell,
  useCalendarGrid,
  useDateFormatter,
  useDateSegment,
  useDialog,
  useFocusRing,
  useLocale,
  usePopover,
  type AriaButtonProps,
  type AriaDialogProps,
} from "react-aria";
import type { CalendarState, DateFieldState, DateSegment, OverlayTriggerState, RangeCalendarState } from "react-stately";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "./formIcons";
import styles from "./calendar.module.css";

type AnyCalendarState = CalendarState | RangeCalendarState;

/** Internal: the editable segments of a date (month / day / year), for DatePicker and DateRangePicker. */
export function DateSegments({ state, fieldProps, fieldRef }: { state: DateFieldState; fieldProps: HTMLAttributes<HTMLElement>; fieldRef: RefObject<HTMLDivElement> }) {
  return (
    <div {...fieldProps} ref={fieldRef} className={styles.segments}>
      {state.segments.map((segment, i) => (
        <Segment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
}

function Segment({ segment, state }: { segment: DateSegment; state: DateFieldState }) {
  const ref = useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);
  const [focused, setFocused] = useState(false);
  return (
    <div
      {...mergeProps(segmentProps, { onFocus: () => setFocused(true), onBlur: () => setFocused(false) })}
      ref={ref}
      className={styles.segment}
      data-segment={segment.type}
      data-placeholder={segment.isPlaceholder || undefined}
      data-focused={(focused && segment.isEditable) || undefined}
    >
      {segment.text}
    </div>
  );
}

/** Internal: the lifted panel a calendar opens in, anchored to the field box. */
export function CalendarPopover({
  state,
  triggerRef,
  dialogProps,
  children,
}: {
  state: OverlayTriggerState;
  triggerRef: RefObject<HTMLElement | null>;
  dialogProps: AriaDialogProps;
  children: ReactNode;
}) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { popoverProps } = usePopover({ triggerRef, popoverRef, placement: "bottom start", offset: 4 }, state);
  const { dialogProps: dialog } = useDialog(dialogProps, dialogRef);
  return (
    <Overlay>
      <div {...popoverProps} ref={popoverRef} className={styles.popover}>
        <DismissButton onDismiss={state.close} />
        <div {...dialog} ref={dialogRef} className={styles.dialog}>
          {children}
        </div>
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
}

interface CalendarViewProps {
  state: AnyCalendarState;
  calendarProps: HTMLAttributes<HTMLElement>;
  prevButtonProps: AriaButtonProps;
  nextButtonProps: AriaButtonProps;
  title: string;
}

type CalendarViewMode = "days" | "months" | "years";
const YEARS_PER_PAGE = 12;

/**
 * Internal: a month — caption, previous / next, and the day grid. The caption is a button:
 * it swaps the days for a month grid, then a year grid, both bounded by minValue / maxValue.
 * Picking a year returns to the months, picking a month returns to the days; Escape returns
 * to the days from either. Previous / next step a month, a year, or a page of years.
 */
export function CalendarView({ state, calendarProps, prevButtonProps, nextButtonProps, title }: CalendarViewProps) {
  const [view, setView] = useState<CalendarViewMode>("days");
  const focused = state.focusedDate;
  const min = state.minValue ? toCalendarDate(state.minValue) : null;
  const max = state.maxValue ? toCalendarDate(state.maxValue) : null;
  const [pageStart, setPageStart] = useState(() => focused.year - (focused.year % YEARS_PER_PAGE));
  const monthFormatter = useDateFormatter({ month: "short", timeZone: state.timeZone, calendar: focused.calendar.identifier });
  const yearFormatter = useDateFormatter({ year: "numeric", timeZone: state.timeZone, calendar: focused.calendar.identifier });
  const now = today(state.timeZone);

  const clamp = (date: CalendarDate) => (min && date.compare(min) < 0 ? min : max && date.compare(max) > 0 ? max : date);
  const go = (date: CalendarDate, next: CalendarViewMode) => {
    state.setFocusedDate(clamp(date));
    setView(next);
    // back on the days, the focused day takes keyboard focus again
    if (next === "days") state.setFocused(true);
  };
  const yearOk = (year: number) => (!min || year >= min.year) && (!max || year <= max.year);
  const monthOk = (month: number) => {
    const first = startOfMonth(focused.set({ month }));
    return (!min || endOfMonth(first).compare(min) >= 0) && (!max || first.compare(max) <= 0);
  };

  const caption =
    view === "days" ? title : view === "months" ? yearFormatter.format(focused.toDate(state.timeZone)) : `${pageStart} – ${pageStart + YEARS_PER_PAGE - 1}`;
  const captionLabel = view === "days" ? `${title}, choose a month` : view === "months" ? `${caption}, choose a year` : `${caption}, back to the days`;
  const prev: AriaButtonProps =
    view === "days"
      ? prevButtonProps
      : view === "months"
        ? { "aria-label": "Previous year", isDisabled: !yearOk(focused.year - 1), onPress: () => state.setFocusedDate(clamp(focused.subtract({ years: 1 }))) }
        : { "aria-label": "Previous years", isDisabled: !yearOk(pageStart - 1), onPress: () => setPageStart(pageStart - YEARS_PER_PAGE) };
  const next: AriaButtonProps =
    view === "days"
      ? nextButtonProps
      : view === "months"
        ? { "aria-label": "Next year", isDisabled: !yearOk(focused.year + 1), onPress: () => state.setFocusedDate(clamp(focused.add({ years: 1 }))) }
        : { "aria-label": "Next years", isDisabled: !yearOk(pageStart + YEARS_PER_PAGE), onPress: () => setPageStart(pageStart + YEARS_PER_PAGE) };

  return (
    <div {...calendarProps} className={styles.calendar}>
      <div className={styles.header}>
        <NavButton {...prev}>
          <ChevronLeftIcon />
        </NavButton>
        <h2 className={styles.title}>
          <button
            type="button"
            className={styles.caption}
            aria-label={captionLabel}
            aria-expanded={view !== "days"}
            data-open={view !== "days" || undefined}
            onClick={() => {
              if (view === "months") setPageStart(focused.year - (focused.year % YEARS_PER_PAGE));
              setView(view === "days" ? "months" : view === "months" ? "years" : "days");
              if (view === "years") state.setFocused(true);
            }}
          >
            {caption}
            <ChevronDownIcon />
          </button>
        </h2>
        <NavButton {...next}>
          <ChevronRightIcon />
        </NavButton>
      </div>
      {view === "days" && <CalendarGrid state={state} />}
      {view === "months" && (
        <OptionGrid
          label="Months"
          onEscape={() => go(focused, "days")}
          options={[...Array(focused.calendar.getMonthsInYear(focused)).keys()].map((i) => ({
            key: i + 1,
            label: monthFormatter.format(focused.set({ month: i + 1, day: 1 }).toDate(state.timeZone)),
            selected: i + 1 === focused.month,
            current: i + 1 === now.month && focused.year === now.year,
            disabled: !monthOk(i + 1),
          }))}
          onPick={(month) => go(focused.set({ month }), "days")}
        />
      )}
      {view === "years" && (
        <OptionGrid
          label="Years"
          onEscape={() => go(focused, "days")}
          options={[...Array(YEARS_PER_PAGE).keys()].map((i) => ({
            key: pageStart + i,
            label: String(pageStart + i),
            selected: pageStart + i === focused.year,
            current: pageStart + i === now.year,
            disabled: !yearOk(pageStart + i),
          }))}
          onPick={(year) => go(focused.set({ year }), "months")}
        />
      )}
    </div>
  );
}

interface GridOption {
  key: number;
  label: string;
  selected: boolean;
  current: boolean;
  disabled: boolean;
}

/** Three columns of months or years. One option is in the tab order; arrows, Home and End move between the enabled ones. */
function OptionGrid({ label, options, onPick, onEscape }: { label: string; options: GridOption[]; onPick: (key: number) => void; onEscape: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = options.filter((o) => !o.disabled);
  const tabStop = (enabled.find((o) => o.selected) ?? enabled[0])?.key;
  const first = options[0]?.key;
  // keyboard focus lands on the chosen option when the grid opens or its page changes
  useEffect(() => {
    ref.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [first]);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      // back to the days; the popover stays open
      e.preventDefault();
      e.stopPropagation();
      onEscape();
      return;
    }
    const buttons = [...(ref.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? [])];
    const i = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 }[e.key];
    const target = e.key === "Home" ? 0 : e.key === "End" ? buttons.length - 1 : step != null && i >= 0 ? i + step : null;
    if (target == null) return;
    e.preventDefault();
    buttons[Math.max(0, Math.min(buttons.length - 1, target))]?.focus();
  };
  return (
    <div ref={ref} role="group" aria-label={label} className={styles.options} onKeyDown={onKeyDown}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          className={styles.option}
          disabled={o.disabled}
          tabIndex={o.key === tabStop ? 0 : -1}
          aria-pressed={o.selected}
          data-selected={o.selected || undefined}
          data-today={o.current || undefined}
          onClick={() => onPick(o.key)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function NavButton(props: AriaButtonProps & { children: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  return (
    <button {...buttonProps} ref={ref} className={styles.nav}>
      {props.children}
    </button>
  );
}

function CalendarGrid({ state }: { state: AnyCalendarState }) {
  const { locale } = useLocale();
  const { gridProps, headerProps, weekDays } = useCalendarGrid({}, state);
  const weeks = getWeeksInMonth(state.visibleRange.start, locale);
  return (
    <table {...gridProps} className={styles.grid}>
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, i) => (
            <th key={i} className={styles.weekday}>
              {day}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(weeks).keys()].map((week) => (
          <tr key={week}>
            {state.getDatesInWeek(week).map((date, i) => (date ? <Cell key={i} state={state} date={date} /> : <td key={i} />))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Cell({ state, date }: { state: AnyCalendarState; date: CalendarDate }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { cellProps, buttonProps, isSelected, isOutsideVisibleRange, isDisabled, isUnavailable, formattedDate } = useCalendarCell({ date }, state, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  const range = "highlightedRange" in state ? state.highlightedRange : null;
  const inRange = Boolean(range && isSelected && !isOutsideVisibleRange);
  const start = inRange && isSameDay(date, range!.start as DateValue);
  const end = inRange && isSameDay(date, range!.end as DateValue);
  return (
    <td
      {...cellProps}
      className={styles.cell}
      data-in-range={inRange && !start && !end ? "" : undefined}
      data-range-start={start && !end ? "" : undefined}
      data-range-end={end && !start ? "" : undefined}
    >
      <button
        type="button"
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className={styles.day}
        data-selected={(isSelected && (!range || start || end)) || undefined}
        data-today={isToday(date, state.timeZone) || undefined}
        data-outside={isOutsideVisibleRange || undefined}
        data-disabled={isDisabled || undefined}
        data-unavailable={isUnavailable || undefined}
        data-focus-visible={isFocusVisible || undefined}
      >
        {formattedDate}
      </button>
    </td>
  );
}
