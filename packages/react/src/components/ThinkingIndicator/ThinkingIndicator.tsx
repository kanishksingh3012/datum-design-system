import { forwardRef, type HTMLAttributes } from "react";
import styles from "./ThinkingIndicator.module.css";

export interface ThinkingIndicatorOwnProps {
  /** @default "Thinking..." - always rendered as real visible text, never dots alone. */
  label?: string;
}

export type ThinkingIndicatorProps = ThinkingIndicatorOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "role">;

/**
 * role="status" carries an implicit aria-live="polite" - the universal
 * typing-indicator dots are decorative (aria-hidden), the actual
 * announcement is the real visible label text next to them. Dots alone
 * would tell a screen reader user nothing.
 */
export const ThinkingIndicator = forwardRef<HTMLDivElement, ThinkingIndicatorProps>(function ThinkingIndicator(
  { label = "Thinking...", className, ...rest },
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
