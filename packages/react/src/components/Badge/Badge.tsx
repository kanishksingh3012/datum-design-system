import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Badge.module.css";

export type BadgeIntent = "accent" | "neutral" | "danger" | "success" | "warning" | "info";
export type BadgeAppearance = "solid" | "soft" | "outline";
export type BadgeSize = "sm" | "md";

export interface BadgeOwnProps {
  /** What the color means. `neutral` + `solid` is ink. @default "neutral" */
  intent?: BadgeIntent;
  /** How much fill. @default "soft" */
  appearance?: BadgeAppearance;
  /** 20 / 24px tall. @default "md" */
  size?: BadgeSize;
  /** Leading status dot, in the badge's text color. Decorative — the label says the status. @default false */
  dot?: boolean;
}

export type BadgeProps = BadgeOwnProps & HTMLAttributes<HTMLSpanElement>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { intent = "neutral", appearance = "soft", size = "md", dot = false, className, children, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      data-intent={intent}
      data-appearance={appearance}
      data-size={size}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {children}
    </span>
  );
});

Badge.displayName = "Badge";
