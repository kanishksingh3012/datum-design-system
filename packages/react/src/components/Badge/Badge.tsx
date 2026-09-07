import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Badge.module.css";

export type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "danger";

export interface BadgeOwnProps {
  /** @default "neutral" */
  variant?: BadgeVariant;
}

export type BadgeProps = BadgeOwnProps & HTMLAttributes<HTMLSpanElement>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = "neutral", className, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      data-variant={variant}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});

Badge.displayName = "Badge";
