import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./Checkbox.module.css";

export interface CheckboxOwnProps {
  /** Rendered inside the same <label>, not a separate element. */
  label: string;
}

export type CheckboxProps = CheckboxOwnProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, className, id, ...rest },
  ref
) {
  return (
    <label className={[styles.root, className].filter(Boolean).join(" ")}>
      <input ref={ref} type="checkbox" id={id} {...rest} />
      <span className={styles.box}>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="miter" aria-hidden="true">
          <path d="M4 10.5 L8.5 15 L16.5 5" />
        </svg>
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
});

Checkbox.displayName = "Checkbox";
