import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Spinner.module.css";

export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerTone = "current" | "accent";

export interface SpinnerOwnProps {
  /** 16 / 20 / 24px. @default "md" */
  size?: SpinnerSize;
  /** `current` inherits the surrounding text color; `accent` uses text.accent. @default "current" */
  tone?: SpinnerTone;
  /** Screen-reader text, announced politely. @default "Loading" */
  label?: string;
}

export type SpinnerProps = SpinnerOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, "role" | "children">;

/** Indeterminate loading indicator. The ring is decorative; the label is what assistive tech hears. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { size = "md", tone = "current", label = "Loading", className, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      role="status"
      data-size={size}
      data-tone={tone}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <span className={styles.ring} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </span>
  );
});

Spinner.displayName = "Spinner";
