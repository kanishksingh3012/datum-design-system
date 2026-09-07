import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./IconButton.module.css";

export interface IconButtonOwnProps {
  /**
   * Required - becomes the button's aria-label. There is no visible text
   * fallback for an icon-only button, so this is not optional the way it
   * would be on a component that also renders a label.
   */
  label: string;
  /** The icon glyph itself, e.g. an inline SVG. */
  children: ReactNode;
}

export type IconButtonProps = IconButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, children, className, type = "button", ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
});

IconButton.displayName = "IconButton";
