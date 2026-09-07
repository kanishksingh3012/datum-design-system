import { forwardRef, type ButtonHTMLAttributes } from "react";
import styles from "./Toggle.module.css";

export interface ToggleOwnProps {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

export type ToggleProps = ToggleOwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange">;

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { pressed = false, onPressedChange, className, type = "button", onClick, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-pressed={pressed}
      data-pressed={pressed || undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      onClick={(event) => {
        onClick?.(event);
        onPressedChange?.(!pressed);
      }}
      {...rest}
    />
  );
});

Toggle.displayName = "Toggle";
