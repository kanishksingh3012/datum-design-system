import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import styles from "./Textarea.module.css";

export interface TextareaOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  /** Shown below the field; replaced by errorText when present. */
  helpText?: string;
  /** Sets aria-invalid + aria-describedby. */
  errorText?: string;
}

export type TextareaProps = TextareaOwnProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
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
      <textarea
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

Textarea.displayName = "Textarea";
