import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import styles from "./Grid.module.css";

export type GridColumnCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridColumns = GridColumnCount | { base?: GridColumnCount; md?: GridColumnCount; lg?: GridColumnCount };
export type GridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";

export interface GridOwnProps {
  /**
   * Equal columns. A number applies at every width; an object switches at
   * the md (768px) and lg (1024px) breakpoints, each step inheriting the one
   * below it. Ignored when `minItemWidth` is set. @default 1
   */
  columns?: GridColumns;
  /**
   * Auto-fit: as many columns as fit, each at least this wide (a number is
   * px). Items never overflow a narrow container.
   */
  minItemWidth?: number | string;
  /** 0 / 4 / 8 / 16 / 24 / 32px from the space scale. @default "md" */
  gap?: GridGap;
}

export type GridProps = GridOwnProps & HTMLAttributes<HTMLDivElement>;

export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns = 1, minItemWidth, gap = "md", className, style, ...rest },
  ref
) {
  const { base = 1, md, lg } = typeof columns === "number" ? { base: columns } : columns;
  const vars =
    minItemWidth !== undefined
      ? { "--_min": typeof minItemWidth === "number" ? `${minItemWidth}px` : minItemWidth }
      : { "--_cols-base": base, "--_cols-md": md ?? base, "--_cols-lg": lg ?? md ?? base };

  return (
    <div
      ref={ref}
      data-gap={gap}
      data-auto-fit={minItemWidth !== undefined || undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={{ ...(vars as CSSProperties), ...style }}
      {...rest}
    />
  );
});

Grid.displayName = "Grid";
