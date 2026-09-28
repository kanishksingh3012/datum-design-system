import { useRef, useState, type HTMLAttributes, type ReactNode, type RefObject } from "react";
import { getWeeksInMonth, isSameDay, isToday, type CalendarDate, type DateValue } from "@internationalized/date";
import {
  DismissButton,
  Overlay,
  mergeProps,
  useButton,
  useCalendarCell,
  useCalendarGrid,
  useDateSegment,
  useDialog,
  useFocusRing,
  useLocale,
  usePopover,
  type AriaButtonProps,
  type AriaDialogProps,
} from "react-aria";
import type { CalendarState, DateFieldState, DateSegment, OverlayTriggerState, RangeCalendarState } from "react-stately";
import { ChevronLeftIcon, ChevronRightIcon } from "./formIcons";
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

/** Internal: a month — title, previous / next, and the day grid. */
export function CalendarView({ state, calendarProps, prevButtonProps, nextButtonProps, title }: CalendarViewProps) {
  return (
    <div {...calendarProps} className={styles.calendar}>
      <div className={styles.header}>
        <NavButton {...prevButtonProps}>
          <ChevronLeftIcon />
        </NavButton>
        <h2 className={styles.title} aria-hidden="true">
          {title}
        </h2>
        <NavButton {...nextButtonProps}>
          <ChevronRightIcon />
        </NavButton>
      </div>
      <CalendarGrid state={state} />
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
