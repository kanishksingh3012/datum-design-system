import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./Switch.module.css";

export interface SwitchOwnProps {
  /** Rendered inside the same <label>, not a separate element. */
  label: string;
}

export type SwitchProps = SwitchOwnProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "role">;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, className, ...rest },
  ref
) {
  return (
    <label className={[styles.root, className].filter(Boolean).join(" ")}>
      <input ref={ref} type="checkbox" role="switch" {...rest} />
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
      <span className={styles.label}>{label}</span>
    </label>
  );
});

Switch.displayName = "Switch";
