import { forwardRef, useRef, type InputHTMLAttributes, type ReactNode } from "react";
import { mergeProps, useButton, useLocale, useNumberField, useObjectRef, type AriaButtonProps } from "react-aria";
import { useNumberFieldState } from "react-stately";
import { MinusIcon, PlusIcon } from "../../lib/formIcons";
import { FieldFrame, type FieldProps } from "../Field/Field";
import styles from "./NumberField.module.css";

export type NumberFieldSize = "sm" | "md" | "lg";

export interface NumberFieldOwnProps extends FieldProps {
  /** 32 / 40 / 48px tall with a precise pointer, +4px on touch screens. @default "md" */
  size?: NumberFieldSize;
  /** The value (controlled). `NaN` is empty. */
  value?: number;
  /** The starting value (uncontrolled). @default NaN (empty) */
  defaultValue?: number;
  /** Called with the new value when it is committed (on blur, Enter, a step or a stepper press); `NaN` when cleared. */
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  /** Arrow keys, Page Up / Down and the steppers move by this much. @default 1 */
  step?: number;
  /** How the value is shown and parsed: currency, percent, units, decimals. */
  formatOptions?: Intl.NumberFormatOptions;
  /** Hides the − and + buttons; arrow keys still step. @default false */
  hideSteppers?: boolean;
  /** Submitted with a form. */
  name?: string;
}

/** `className` goes on the field's root; `ref` and every other prop go on the `<input>`. */
export type NumberFieldProps = NumberFieldOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "value" | "defaultValue" | "min" | "max" | "step" | "id" | "children">;

/**
 * A number with − and + steppers, on React Aria's `useNumberField`: typing is
 * limited to what the format allows, the value is clamped and snapped to
 * `step` on commit, and arrow keys, Page Up / Down, Home and End step it.
 */
export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
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
    min,
    max,
    step,
    formatOptions,
    hideSteppers = false,
    name,
    className,
    ...rest
  },
  forwardedRef
) {
  const inputRef = useObjectRef(forwardedRef);
  const { locale } = useLocale();
  const props = {
    label,
    description: errorText ? undefined : helpText,
    errorMessage: errorText,
    isInvalid: Boolean(errorText),
    isRequired: required,
    isDisabled: disabled,
    isReadOnly: readOnly,
    value,
    defaultValue,
    onChange: onValueChange,
    minValue: min,
    maxValue: max,
    step,
    formatOptions,
    name,
    validationBehavior: "aria" as const,
  };
  const state = useNumberFieldState({ ...props, locale });
  const { labelProps, groupProps, inputProps, incrementButtonProps, decrementButtonProps, descriptionProps, errorMessageProps } = useNumberField(
    props,
    state,
    inputRef
  );
  const steppers = !hideSteppers && !readOnly;

  return (
    <FieldFrame
      label={label}
      labelProps={labelProps}
      helpText={helpText}
      errorText={errorText}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      descriptionProps={descriptionProps}
      errorMessageProps={errorMessageProps}
      className={className}
    >
      <div
        {...groupProps}
        className={styles.box}
        data-control=""
        data-size={size}
        data-steppers={steppers || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={errorText ? true : undefined}
      >
        {steppers && <Stepper {...decrementButtonProps} icon={<MinusIcon />} />}
        <input {...mergeProps(rest, inputProps)} ref={inputRef} className={styles.input} />
        {steppers && <Stepper {...incrementButtonProps} icon={<PlusIcon />} />}
      </div>
    </FieldFrame>
  );
});

NumberField.displayName = "NumberField";

function Stepper({ icon, ...props }: AriaButtonProps & { icon: ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  return (
    <button {...buttonProps} ref={ref} className={styles.stepper}>
      {icon}
    </button>
  );
}
