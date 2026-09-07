import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Card.module.css";

export type CardVariant = "flat" | "elevated";

export interface CardOwnProps {
  /** @default "flat" */
  variant?: CardVariant;
}

export type CardProps = CardOwnProps & HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = "flat", className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      data-variant={variant}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    />
  );
});

Card.displayName = "Card";
