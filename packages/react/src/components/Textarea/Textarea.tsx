import { forwardRef, useId, useLayoutEffect, type ChangeEvent, type TextareaHTMLAttributes } from "react";
import { mergeProps, useObjectRef } from "react-aria";
import { useControllableState } from "../../lib/useControllableState";
import { FieldFrame, useFieldWiring, type FieldProps } from "../Field/Field";
import styles from "./Textarea.module.css";

export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaOwnProps extends FieldProps {
  /** Type size and padding, matching TextField. @default "md" */
  size?: TextareaSize;
  /** Visible lines before it scrolls (or, with autoResize, its starting height). @default 3 */
  rows?: number;
  /** Grows with its content instead of scrolling; the manual resize handle goes away. @default false */
  autoResize?: boolean;
  /** Caps the length and shows a count under the field. */
  maxLength?: number;
  /** The value (controlled). */
  value?: string;
  /** The starting value (uncontrolled). @default "" */
  defaultValue?: string;
  /** Called with the new value on every edit. */
  onValueChange?: (value: string) => void;
}

/** `className` goes on the field's root; `ref` and every other prop go on the `<textarea>`. */
export type TextareaProps = TextareaOwnProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows" | "maxLength" | "value" | "defaultValue" | "id" | "children">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    helpText,
    errorText,
    required = false,
    disabled = false,
    readOnly = false,
    size = "md",
    rows = 3,
    autoResize = false,
    maxLength,
    value: valueProp,
    defaultValue = "",
    onValueChange,
    className,
    onChange,
    ...rest
  },
  forwardedRef
) {
  const ref = useObjectRef(forwardedRef);
  const counterId = useId();
  const [value, setValue] = useControllableState(valueProp, defaultValue, onValueChange);
  const { labelProps, control, descriptionProps, errorMessageProps } = useFieldWiring({ label, helpText, errorText, required, disabled, readOnly });
  const hasCounter = maxLength !== undefined;

  // Grow to fit: reset, then take the content's height (the border is included by box-sizing).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!autoResize || !el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`;
  }, [autoResize, value, rows, ref]);

  const describedBy = [control["aria-describedby"], hasCounter ? counterId : undefined].filter(Boolean).join(" ") || undefined;

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
      aside={
        hasCounter ? (
          <span id={counterId} className={styles.counter}>
            {value.length}/{maxLength}
          </span>
        ) : undefined
      }
    >
      <textarea
        {...mergeProps(rest, control)}
        aria-describedby={describedBy}
        ref={ref}
        className={styles.textarea}
        data-control=""
        data-size={size}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        data-invalid={errorText ? true : undefined}
        data-auto-resize={autoResize || undefined}
        rows={rows}
        maxLength={maxLength}
        value={value}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          onChange?.(event);
          setValue(event.target.value);
        }}
      />
    </FieldFrame>
  );
});

Textarea.displayName = "Textarea";
