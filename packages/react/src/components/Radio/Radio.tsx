import { forwardRef, type InputHTMLAttributes } from "react";
import styles from "./Radio.module.css";

export interface RadioOwnProps {
  /** Groups options - share the same name across every option in the set. */
  name: string;
  /** Rendered inside the same <label>, not a separate element. */
  label: string;
}

export type RadioProps = RadioOwnProps & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { name, label, className, ...rest },
  ref
) {
  return (
    <label className={[styles.root, className].filter(Boolean).join(" ")}>
      <input ref={ref} type="radio" name={name} {...rest} />
      <span className={styles.circle} />
      <span className={styles.label}>{label}</span>
    </label>
  );
});

Radio.displayName = "Radio";
