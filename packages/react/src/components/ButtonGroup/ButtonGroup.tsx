import { forwardRef, type HTMLAttributes } from "react";
import styles from "./ButtonGroup.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupOwnProps {
  /** @default "horizontal" */
  orientation?: ButtonGroupOrientation;
}

export type ButtonGroupProps = ButtonGroupOwnProps & HTMLAttributes<HTMLDivElement>;

/**
 * Visually merges adjacent Buttons into a single segmented control via
 * CSS on direct children — it doesn't clone or inspect its children, so
 * any Button-shaped element works, including ones rendered via `render`.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = "horizontal", role = "group", className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      role={role}
      data-orientation={orientation}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});

ButtonGroup.displayName = "ButtonGroup";
