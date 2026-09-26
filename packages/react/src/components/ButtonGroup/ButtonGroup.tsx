import { forwardRef, useMemo, type HTMLAttributes } from "react";
import { ButtonGroupContext } from "../../lib/buttonGroupContext";
import type { ButtonAppearance, ButtonIntent, ButtonSize } from "../Button/Button";
import styles from "./ButtonGroup.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupOwnProps {
  /** @default "horizontal" */
  orientation?: ButtonGroupOrientation;
  /**
   * Joins the buttons into one track: no borders between segments, and a
   * pressed segment becomes a raised thumb (use `pressed` on each Button for
   * a view switcher). Without it, the buttons are simply spaced. @default false
   */
  attached?: boolean;
  /** Passed down to every Button; a Button's own prop wins. */
  size?: ButtonSize;
  /** Passed down to every Button in a spaced group; a Button's own prop wins. */
  intent?: ButtonIntent;
  /** Passed down to every Button in a spaced group; a Button's own prop wins. */
  appearance?: ButtonAppearance;
}

export type ButtonGroupProps = ButtonGroupOwnProps & HTMLAttributes<HTMLDivElement>;

/**
 * Related actions as one unit. Vertical groups are as wide as their widest
 * button, and every button shares that width.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { orientation = "horizontal", attached = false, size, intent, appearance, role = "group", className, ...rest },
  ref
) {
  const context = useMemo(() => ({ size, intent, appearance, attached }), [size, intent, appearance, attached]);
  return (
    <ButtonGroupContext.Provider value={context}>
      <div
        ref={ref}
        role={role}
        data-orientation={orientation}
        data-attached={attached || undefined}
        className={[styles.root, className].filter(Boolean).join(" ")}
        {...rest}
      />
    </ButtonGroupContext.Provider>
  );
});

ButtonGroup.displayName = "ButtonGroup";
