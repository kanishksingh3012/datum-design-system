import { forwardRef, useId, type InputHTMLAttributes } from "react";
import styles from "./NumberField.module.css";

export interface NumberFieldOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  /** Shown below the field; replaced by errorText when present. */
  helpText?: string;
  /** Sets aria-invalid + aria-describedby. */
  errorText?: string;
}

export type NumberFieldProps = NumberFieldOwnProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type">;

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  { label, helpText, errorText, className, ...rest },
  ref
) {
  const inputId = useId();
  const messageId = useId();
  const message = errorText ?? helpText;

  return (
    <div className={[styles.root, errorText ? styles.error : "", className].filter(Boolean).join(" ")}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        type="number"
        className={styles.input}
        aria-invalid={errorText ? true : undefined}
        aria-describedby={message ? messageId : undefined}
        {...rest}
      />
      {message ? (
        <p className={styles.help} id={messageId}>
          {message}
        </p>
      ) : null}
    </div>
  );
});

NumberField.displayName = "NumberField";
