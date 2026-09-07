import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

export interface SelectOwnProps {
  /** Never substitute with placeholder - placeholder-as-label is banned. */
  label: string;
  /** Shown below the field; replaced by errorText when present. */
  helpText?: string;
  /** Sets aria-invalid + aria-describedby. */
  errorText?: string;
}

export type SelectProps = SelectOwnProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id">;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, helpText, errorText, className, children, ...rest },
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
      <div className={styles.wrap}>
        <select
          ref={ref}
          id={inputId}
          className={styles.input}
          aria-invalid={errorText ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        >
          {children}
        </select>
        <svg
          className={styles.chevron}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 5 L12.5 10 L7 15" />
        </svg>
      </div>
      {message ? (
        <p className={styles.help} id={messageId}>
          {message}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = "Select";
