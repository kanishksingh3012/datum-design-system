import { forwardRef, useRef, type ChangeEvent, type InputHTMLAttributes, type PointerEvent, type ReactNode } from "react";
import { mergeProps, useObjectRef } from "react-aria";
import { useToggleState } from "react-stately";
import { CloseIcon } from "../../lib/statusIcons";
import { EyeIcon, EyeOffIcon } from "../../lib/formIcons";
import { useControllableState } from "../../lib/useControllableState";
import { FieldFrame, useFieldWiring, type FieldProps } from "../Field/Field";
import styles from "./TextField.module.css";

export type TextFieldSize = "sm" | "md" | "lg";
export type TextFieldType = "text" | "email" | "password" | "search" | "url" | "tel" | "number";

export interface TextFieldOwnProps extends FieldProps {
  /** 32 / 40 / 48px tall with a precise pointer, +4px on touch screens. @default "md" */
  size?: TextFieldSize;
  /** @default "text" */
  type?: TextFieldType;
  /** Icon or text inside the field, before the value. */
  prefix?: ReactNode;
  /** Icon or text inside the field, after the value. */
  suffix?: ReactNode;
  /** Shows a Clear button while the field has a value. @default false */
  clearable?: boolean;
  /** With `type="password"`: a Show / Hide password toggle. @default false */
  revealable?: boolean;
  /** The value (controlled). */
  value?: string;
  /** The starting value (uncontrolled). @default "" */
  defaultValue?: string;
  /** Called with the new value on every edit, and with "" when cleared. */
  onValueChange?: (value: string) => void;
}

/** `className` goes on the field's root; `ref` and every other prop go on the `<input>`. */
export type TextFieldProps = TextFieldOwnProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type" | "prefix" | "value" | "defaultValue" | "id" | "children">;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    helpText,
    errorText,
    required = false,
    disabled = false,
    readOnly = false,
    size = "md",
    type = "text",
    prefix,
    suffix,
    clearable = false,
    revealable = false,
    value: valueProp,
    defaultValue = "",
    onValueChange,
    className,
    onChange,
    ...rest
  },
  forwardedRef
) {
  const inputRef = useObjectRef(forwardedRef);
  const [value, setValue] = useControllableState(valueProp, defaultValue, onValueChange);
  const revealed = useToggleState();
  const { labelProps, control, descriptionProps, errorMessageProps } = useFieldWiring({ label, helpText, errorText, required, disabled, readOnly });
  const editable = !disabled && !readOnly;
  const showClear = clearable && editable && value !== "";
  const canReveal = revealable && type === "password";
  const boxRef = useRef<HTMLDivElement>(null);

  // A press anywhere on the box (a prefix, the padding) puts the caret in the input.
  const focusInput = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target === boxRef.current || !(event.target as HTMLElement).closest("input, button")) {
      event.preventDefault();
      inputRef.current?.focus();
    }
  };

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
        ref={boxRef}
        className={styles.box}
        data-control=""
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={errorText ? true : undefined}
        onPointerDown={focusInput}
      >
        {prefix && <span className={styles.affix}>{prefix}</span>}
        <input
          {...mergeProps(rest, control)}
          ref={inputRef}
          className={styles.input}
          type={canReveal && revealed.isSelected ? "text" : type}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            onChange?.(event);
            setValue(event.target.value);
          }}
        />
        {showClear && (
          <button
            type="button"
            className={styles.action}
            aria-label="Clear"
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
          >
            <CloseIcon />
          </button>
        )}
        {canReveal && (
          <button
            type="button"
            className={styles.action}
            aria-label="Show password"
            aria-pressed={revealed.isSelected}
            disabled={disabled}
            onClick={revealed.toggle}
          >
            {revealed.isSelected ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
        {suffix && <span className={styles.affix}>{suffix}</span>}
      </div>
    </FieldFrame>
  );
});

TextField.displayName = "TextField";
