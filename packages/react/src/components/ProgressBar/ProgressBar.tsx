import { forwardRef, type HTMLAttributes } from "react";
import styles from "./ProgressBar.module.css";

export interface ProgressBarOwnProps {
  /** 0-100. Required - there's no meaningful default for how far along something is. */
  value: number;
  /** Becomes aria-label - without it, a screen reader has no idea what's progressing. */
  label: string;
}

export type ProgressBarProps = ProgressBarOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "role">;

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { value, label, className, ...rest },
  ref
) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <div className={styles.fill} style={{ width: `${clamped}%` }} />
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";
