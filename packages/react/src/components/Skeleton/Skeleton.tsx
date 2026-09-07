import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Skeleton.module.css";

export type SkeletonShape = "text" | "avatar";

export interface SkeletonOwnProps {
  /** @default "text" */
  shape?: SkeletonShape;
  /** @default "100%" */
  width?: string;
}

export type SkeletonProps = SkeletonOwnProps & Omit<HTMLAttributes<HTMLSpanElement>, "style">;

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { shape = "text", width = "100%", className, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      data-shape={shape}
      style={{ width }}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});

Skeleton.displayName = "Skeleton";
