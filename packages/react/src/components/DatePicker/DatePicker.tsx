import { forwardRef, useRef, type HTMLAttributes } from "react";
import { createCalendar, type DateValue } from "@internationalized/date";
import { useButton, useCalendar, useDateField, useDatePicker, useLocale, useObjectRef, type AriaCalendarProps } from "react-aria";
import { useCalendarState, useDateFieldState, useDatePickerState, type DatePickerState } from "react-stately";
import { CalendarIcon } from "../../lib/formIcons";
import { CalendarPopover, CalendarView, DateSegments } from "../../lib/Calendar";
import { FieldFrame, type FieldProps } from "../Field/Field";
import parts from "../../lib/fieldParts.module.css";
import styles from "./DatePicker.module.css";

export type DatePickerSize = "sm" | "md" | "lg";

/** Props DatePicker and DateRangePicker share. Dates are @internationalized/date values. */
export interface DateConstraintProps {
  /** The earliest date that can be chosen. */
  minValue?: DateValue;
  /** The latest date that can be chosen. */
  maxValue?: DateValue;
  /** Dates that show in the calendar, struck through, but can't be chosen. */
  isDateUnavailable?: (date: DateValue) => boolean;
  /** Form field name. */
  name?: string;
}

export interface DatePickerOwnProps extends FieldProps, DateConstraintProps {
  /** 32 / 40 / 48px tall with a precise pointer, +4px on touch screens. @default "md" */
  size?: DatePickerSize;
  /** The date (controlled), e.g. `parseDate("2026-09-28")`; null for none. */
  value?: DateValue | null;
  /** @default null */
  defaultValue?: DateValue | null;
  onValueChange?: (value: DateValue | null) => void;
  /** Whether the calendar is open (controlled). */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** `className` and other props go on the field's root; `ref` goes on the field box. */
export type DatePickerProps = DatePickerOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue" | "onChange">;

/**
 * A date typed segment by segment (arrows step a segment, digits fill it) or
 * picked from a calendar. The calendar is a grid: arrows move by day and
 * week, Page Up / Down by month, Enter picks, Escape closes.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
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
    name,
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
    onChange: onValueChange as (value: DateValue | null) => void,
    isOpen: open,
    defaultOpen,
    onOpenChange,
    minValue,
    maxValue,
    isDateUnavailable,
    granularity: "day" as const,
    name,
  };
  const state = useDatePickerState(pickerProps);
  const { groupProps, labelProps, fieldProps, buttonProps, dialogProps, calendarProps, descriptionProps, errorMessageProps } = useDatePicker(pickerProps, state, groupRef);
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
        <DateField {...fieldProps} />
        <button {...calendarButtonProps} ref={buttonRef} className={parts.button}>
          <CalendarIcon />
        </button>
      </div>
      {state.isOpen && (
        <CalendarPopover state={state} triggerRef={groupRef} dialogProps={dialogProps}>
          <Calendar {...(calendarProps as AriaCalendarProps<DateValue>)} />
        </CalendarPopover>
      )}
    </FieldFrame>
  );
});

DatePicker.displayName = "DatePicker";

/** Internal: the segmented date inside the field box. */
export function DateField(props: Parameters<typeof useDateField>[0]) {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const state = useDateFieldState({ ...props, locale, createCalendar });
  const { fieldProps, inputProps } = useDateField(props, state, ref);
  return (
    <>
      <DateSegments state={state} fieldProps={fieldProps} fieldRef={ref} />
      <input {...inputProps} />
    </>
  );
}

function Calendar(props: AriaCalendarProps<DateValue>) {
  const { locale } = useLocale();
  const state = useCalendarState<DateValue, "single">({ ...props, locale, createCalendar });
  const { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(props, state);
  return <CalendarView state={state} calendarProps={calendarProps} prevButtonProps={prevButtonProps} nextButtonProps={nextButtonProps} title={title} />;
}

export type { DatePickerState };
