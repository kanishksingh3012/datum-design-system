import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Separator.module.css";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorOwnProps {
  /** @default "horizontal" */
  orientation?: SeparatorOrientation;
}

export type SeparatorProps = SeparatorOwnProps & Omit<HTMLAttributes<HTMLHRElement>, "role">;

export const Separator = forwardRef<HTMLHRElement, SeparatorProps>(function Separator(
  { orientation = "horizontal", className, ...rest },
  ref
) {
  return (
    <hr
      ref={ref}
      data-orientation={orientation}
      aria-orientation={orientation === "vertical" ? "vertical" : undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});

Separator.displayName = "Separator";
