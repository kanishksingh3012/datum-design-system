import { forwardRef, useRef, type HTMLAttributes } from "react";
import { createCalendar, type DateValue } from "@internationalized/date";
import { useButton, useDateRangePicker, useLocale, useObjectRef, useRangeCalendar, type AriaRangeCalendarProps } from "react-aria";
import { useDateRangePickerState, useRangeCalendarState } from "react-stately";
import { CalendarIcon } from "../../lib/formIcons";
import { CalendarPopover, CalendarView } from "../../lib/Calendar";
import { DateField, type DateConstraintProps, type DatePickerSize } from "../DatePicker/DatePicker";
import { FieldFrame, type FieldProps } from "../Field/Field";
import parts from "../../lib/fieldParts.module.css";
import styles from "./DateRangePicker.module.css";

/** A start and end date, both @internationalized/date values. */
export interface DateRange {
  start: DateValue;
  end: DateValue;
}

export interface DateRangePickerOwnProps extends FieldProps, Omit<DateConstraintProps, "name"> {
  /** 32 / 40 / 48px tall with a precise pointer, +4px on touch screens. @default "md" */
  size?: DatePickerSize;
  /** The range (controlled); null for none. */
  value?: DateRange | null;
  /** @default null */
  defaultValue?: DateRange | null;
  onValueChange?: (value: DateRange | null) => void;
  /** Whether the calendar is open (controlled). */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Form field names for the two dates. */
  startName?: string;
  endName?: string;
}

/** `className` and other props go on the field's root; `ref` goes on the field box. */
export type DateRangePickerProps = DateRangePickerOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange">;

/**
 * Two dates typed segment by segment, or picked as a range from a calendar:
 * the first press sets the start, the second the end, with the days between
 * shown as a band. Arrows move through the grid, Enter picks, Escape closes.
 */
export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(function DateRangePicker(
  {
    label,
    helpText,
    errorText,
    required = false,
    disabled = false,
    readOnly = false,
    size = "md",
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    minValue,
    maxValue,
    isDateUnavailable,
    startName,
    endName,
    className,
    ...rest
  },
  forwardedRef
) {
  const groupRef = useObjectRef(forwardedRef);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pickerProps = {
    label,
    description: errorText ? undefined : helpText,
    errorMessage: errorText,
    isInvalid: errorText ? true : undefined,
    isDisabled: disabled,
    isReadOnly: readOnly,
    isRequired: required,
    value,
    defaultValue,
    onChange: onValueChange as (value: DateRange | null) => void,
    isOpen: open,
    defaultOpen,
    onOpenChange,
    minValue,
    maxValue,
    isDateUnavailable,
    granularity: "day" as const,
    startName,
    endName,
  };
  const state = useDateRangePickerState(pickerProps);
  const { groupProps, labelProps, startFieldProps, endFieldProps, buttonProps, dialogProps, calendarProps, descriptionProps, errorMessageProps } =
    useDateRangePicker(pickerProps, state, groupRef);
  const { buttonProps: calendarButtonProps } = useButton(buttonProps, buttonRef);

  return (
    <FieldFrame
      label={label}
      labelAs="span"
      labelProps={labelProps}
      helpText={helpText}
      errorText={errorText}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      rootProps={rest}
      className={className}
    >
      <div
        {...groupProps}
        ref={groupRef}
        className={styles.box}
        data-control=""
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={errorText || state.isInvalid ? true : undefined}
        data-open={state.isOpen || undefined}
      >
        <span className={styles.dates}>
          <DateField {...startFieldProps} />
          <span className={styles.dash} aria-hidden="true">
            –
          </span>
          <DateField {...endFieldProps} />
        </span>
        <button {...calendarButtonProps} ref={buttonRef} className={parts.button}>
          <CalendarIcon />
        </button>
      </div>
      {state.isOpen && (
        <CalendarPopover state={state} triggerRef={groupRef} dialogProps={dialogProps}>
          <RangeCalendar {...(calendarProps as AriaRangeCalendarProps<DateValue>)} />
        </CalendarPopover>
      )}
    </FieldFrame>
  );
});

DateRangePicker.displayName = "DateRangePicker";

function RangeCalendar(props: AriaRangeCalendarProps<DateValue>) {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const state = useRangeCalendarState({ ...props, locale, createCalendar });
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useRangeCalendar(props, state, ref);
  return (
    <div ref={ref}>
      <CalendarView state={state} calendarProps={calendarProps} prevButtonProps={prevButtonProps} nextButtonProps={nextButtonProps} title={title} />
    </div>
  );
}
