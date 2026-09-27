import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Heading.module.css";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = "display-lg" | "display-md" | "display-sm" | "xl" | "lg" | "md" | "sm";
export type HeadingTone = "primary" | "secondary" | "accent";

export interface HeadingOwnProps {
  /** Semantic level — renders `<h1>`–`<h6>`. @default 2 */
  level?: HeadingLevel;
  /**
   * Type role, independent of the level (a level 1 can look like
   * `display-md`). Defaults from the level: 1 → xl, 2 → lg, 3 → md, 4–6 → sm.
   */
  size?: HeadingSize;
  /** @default "primary" */
  tone?: HeadingTone;
}

export type HeadingProps = HeadingOwnProps & HTMLAttributes<HTMLHeadingElement>;

const sizeFromLevel: Record<HeadingLevel, HeadingSize> = { 1: "xl", 2: "lg", 3: "md", 4: "sm", 5: "sm", 6: "sm" };

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, size, tone = "primary", className, ...rest },
  ref
) {
  const Element = `h${level}` as const;
  return (
    <Element
      ref={ref}
      data-size={size ?? sizeFromLevel[level]}
      data-tone={tone}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});

Heading.displayName = "Heading";
