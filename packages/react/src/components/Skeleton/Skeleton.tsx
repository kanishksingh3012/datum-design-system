import { forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import styles from "./Skeleton.module.css";

export type SkeletonShape = "text" | "rect" | "circle";

export interface SkeletonOwnProps {
  /** A line of text / a block such as an image / a round avatar. @default "text" */
  shape?: SkeletonShape;
  /** Number of text lines; the last of several is shorter, like a paragraph. Text only. @default 1 */
  lines?: number;
  /** Pulses while loading. Always off under reduced motion. @default true */
  animated?: boolean;
  /** Width; for a circle, also its height. @default "100%" (circle: 40px) */
  width?: CSSProperties["width"];
  /** Height of a rect. @default 120px */
  height?: CSSProperties["height"];
}

export type SkeletonProps = SkeletonOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, "children">;

/**
 * Placeholder while content loads. Decorative (aria-hidden): mark the region
 * that is loading with aria-busy instead.
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { shape = "text", lines = 1, animated = true, width, height, className, style, ...rest },
  ref
) {
  const count = shape === "text" ? Math.max(1, Math.floor(lines)) : 1;
  return (
    <span
      ref={ref}
      aria-hidden="true"
      data-shape={shape}
      data-animated={animated || undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={{ width, height: shape === "rect" ? height : undefined, ...style }}
      {...rest}
    >
      {shape === "text" ? Array.from({ length: count }, (_, i) => <span key={i} className={styles.line} />) : null}
    </span>
  );
});

Skeleton.displayName = "Skeleton";
