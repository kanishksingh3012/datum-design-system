import { forwardRef, useId, type InputHTMLAttributes } from "react";
import styles from "./TextField.module.css";

export interface TextFieldOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  /** Shown below the field; replaced by errorText when present. */
  helpText?: string;
  /** Sets aria-invalid + aria-describedby. */
  errorText?: string;
}

export type TextFieldProps = TextFieldOwnProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
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

TextField.displayName = "TextField";
