import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Stack.module.css";

export type StackDirection = "vertical" | "horizontal";
export type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify = "start" | "center" | "end" | "between";

export interface StackOwnProps {
  /** @default "vertical" */
  direction?: StackDirection;
  /** 0 / 4 / 8 / 16 / 24 / 32px from the space scale. @default "md" */
  gap?: StackGap;
  /** Cross-axis alignment. @default "stretch" */
  align?: StackAlign;
  /** Main-axis distribution. @default "start" */
  justify?: StackJustify;
  /** Lets children wrap onto new lines. @default false */
  wrap?: boolean;
}

export type StackProps = StackOwnProps & HTMLAttributes<HTMLDivElement>;

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { direction = "vertical", gap = "md", align = "stretch", justify = "start", wrap = false, className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap || undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});

Stack.displayName = "Stack";
