import { forwardRef, type HTMLAttributes } from "react";
import styles from "./ThinkingIndicator.module.css";

export interface ThinkingIndicatorOwnProps {
  /** Always shown as real text beside the dots. @default "Thinking…" */
  label?: string;
}

export type ThinkingIndicatorProps = ThinkingIndicatorOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "role">;

/**
 * role="status" (a polite live region): the label is what is announced; the
 * three dots are decorative. Under reduced motion the dots hold still.
 */
export const ThinkingIndicator = forwardRef<HTMLDivElement, ThinkingIndicatorProps>(function ThinkingIndicator(
  { label = "Thinking…", className, ...rest },
  ref
) {
  return (
    <div ref={ref} role="status" className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <span className={styles.dots} aria-hidden="true">
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </span>
      <span>{label}</span>
    </div>
  );
});

ThinkingIndicator.displayName = "ThinkingIndicator";
