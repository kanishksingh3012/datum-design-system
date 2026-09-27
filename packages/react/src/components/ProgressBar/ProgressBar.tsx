import { forwardRef, useId, type HTMLAttributes } from "react";
import styles from "./ProgressBar.module.css";

export type ProgressBarSize = "sm" | "md";
export type ProgressBarIntent = "accent" | "success" | "warning" | "danger";

export interface ProgressBarOwnProps {
  /** 0–100. Omit for indeterminate progress (a sliding segment, no value announced). */
  value?: number;
  /** 4 / 8px track. @default "md" */
  size?: ProgressBarSize;
  /** Color of the fill. @default "accent" */
  intent?: ProgressBarIntent;
  /** Visible label above the track; also the accessible name. Without it, pass aria-label. */
  label?: string;
  /** Shows the rounded percentage opposite the label (determinate only). @default false */
  showValue?: boolean;
}

export type ProgressBarProps = ProgressBarOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "role" | "children">;

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(function ProgressBar(
  { value, size = "md", intent = "accent", label, showValue = false, className, ...rest },
  ref
) {
  const labelId = useId();
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value));
  const shownValue = showValue && !indeterminate;

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-labelledby={label ? labelId : undefined}
      aria-valuemin={indeterminate ? undefined : 0}
      aria-valuemax={indeterminate ? undefined : 100}
      aria-valuenow={indeterminate ? undefined : clamped}
      data-size={size}
      data-intent={intent}
      data-indeterminate={indeterminate || undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {label || shownValue ? (
        <div className={styles.header}>
          {label ? <span id={labelId} className={styles.label}>{label}</span> : null}
          {shownValue ? <span className={styles.value}>{`${Math.round(clamped)}%`}</span> : null}
        </div>
      ) : null}
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={indeterminate ? undefined : { transform: `translateX(${clamped - 100}%)` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";
