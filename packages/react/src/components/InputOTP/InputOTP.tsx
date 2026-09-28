import { forwardRef, useRef, type ClipboardEvent, type HTMLAttributes, type KeyboardEvent } from "react";
import { useField } from "react-aria";
import { useControllableState } from "../../lib/useControllableState";
import { FieldFrame, type FieldProps } from "../Field/Field";
import styles from "./InputOTP.module.css";

export type InputOTPSize = "sm" | "md" | "lg";

export interface InputOTPOwnProps extends FieldProps {
  /** Number of digits. @default 6 */
  length?: number;
  /** 36 / 44 / 52px round cells; never under 44px on touch screens. @default "md" */
  size?: InputOTPSize;
  /** The code so far (controlled). */
  value?: string;
  /** The starting code (uncontrolled). @default "" */
  defaultValue?: string;
  /** Called with the code on every edit. */
  onValueChange?: (value: string) => void;
  /** Called once every digit is filled. */
  onComplete?: (value: string) => void;
  /** Submitted with a form, as one value. */
  name?: string;
}

/** `ref`, `className` and every other prop go on the field's root. */
export type InputOTPProps = InputOTPOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange">;

/**
 * A one-time code as a row of single-digit cells. Typing moves to the next
 * cell, Backspace to the previous one, arrow keys move freely, and pasting a
 * code fills every cell. The first cell offers `autocomplete="one-time-code"`
 * so phones can fill it from a text message. Label, help and error text are
 * wired by React Aria's `useField`; the cells form a labelled group.
 */
export const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(function InputOTP(
  {
    label,
    helpText,
    errorText,
    required = false,
    disabled = false,
    readOnly = false,
    length = 6,
    size = "md",
    value: valueProp,
    defaultValue = "",
    onValueChange,
    onComplete,
    name,
    className,
    ...rest
  },
  ref
) {
  const [value, setValue] = useControllableState(valueProp, defaultValue, onValueChange);
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } = useField({
    label,
    description: errorText ? undefined : helpText,
    errorMessage: errorText,
    isInvalid: Boolean(errorText),
  });
  const cells = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");
  const editable = !disabled && !readOnly;
  const focus = (i: number) => cells.current[Math.max(0, Math.min(length - 1, i))]?.focus();

  const commit = (next: string[]) => {
    // keep the code contiguous: a cleared cell closes the gap
    const code = next.join("").slice(0, length);
    setValue(code);
    if (code.length === length) onComplete?.(code);
  };

  const onInput = (i: number, raw: string) => {
    const typed = raw.replace(/\D/g, "");
    if (!typed) return;
    const next = digits.slice();
    // typing over a filled cell replaces it; more than one digit (autofill) spills forward
    typed.split("").forEach((d, k) => {
      if (i + k < length) next[i + k] = d;
    });
    commit(next);
    focus(Math.min(i + typed.length, length - 1));
  };

  const onKeyDown = (i: number, event: KeyboardEvent<HTMLInputElement>) => {
    const next = digits.slice();
    if (event.key === "Backspace" && editable) {
      event.preventDefault();
      const at = digits[i] ? i : i - 1;
      if (at < 0) return;
      next.splice(at, 1);
      commit(next);
      focus(at);
    } else if (event.key === "Delete" && editable) {
      event.preventDefault();
      next.splice(i, 1);
      commit(next);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focus(i - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focus(i + 1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      focus(event.key === "Home" ? 0 : length - 1);
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!editable) return;
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    commit(pasted.split(""));
    focus(pasted.length);
  };

  return (
    <FieldFrame
      ref={ref}
      label={label}
      labelAs="span"
      labelProps={{ id: labelProps.id }}
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
      <div role="group" aria-labelledby={labelProps.id} className={styles.cells} data-size={size}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(node) => {
              cells.current[i] = node;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            // one cell at a time in the tab order: the next empty one, like a single field
            tabIndex={i === Math.min(value.length, length - 1) ? 0 : -1}
            value={digit}
            disabled={disabled}
            readOnly={readOnly}
            required={required && i === 0 ? true : undefined}
            aria-label={`Digit ${i + 1} of ${length}`}
            aria-describedby={fieldProps["aria-describedby"]}
            aria-invalid={errorText ? true : undefined}
            className={styles.cell}
            data-control=""
            data-invalid={errorText ? true : undefined}
            data-readonly={readOnly || undefined}
            onChange={(event) => onInput(i, event.currentTarget.value.replace(digit, ""))}
            onKeyDown={(event) => onKeyDown(i, event)}
            onPaste={onPaste}
            onFocus={(event) => event.currentTarget.select()}
          />
        ))}
      </div>
      {name && <input type="hidden" name={name} value={value} />}
    </FieldFrame>
  );
});

InputOTP.displayName = "InputOTP";
