import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Container.module.css";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ContainerOwnProps {
  /** Max content width: 640 / 768 / 1024 / 1280px, or `full` for none. @default "xl" */
  size?: ContainerSize;
  /** Adds the responsive page gutter (`grid.margin`) on both sides, outside the max width. @default true */
  padded?: boolean;
}

export type ContainerProps = ContainerOwnProps & HTMLAttributes<HTMLDivElement>;

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = "xl", padded = true, className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      data-size={size}
      data-padded={padded || undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});

Container.displayName = "Container";
