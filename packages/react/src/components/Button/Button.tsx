import { forwardRef, useContext, type ButtonHTMLAttributes, type MouseEvent, type ReactElement, type ReactNode } from "react";
import { useToggleState } from "react-stately";
import { ButtonGroupContext } from "../../lib/buttonGroupContext";
import styles from "./Button.module.css";

export type ButtonIntent = "accent" | "neutral" | "danger";
export type ButtonAppearance = "solid" | "soft" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonOwnProps {
  /** What the color means. `neutral` + `solid` is the ink button. @default "accent" */
  intent?: ButtonIntent;
  /** How much fill. @default "solid" */
  appearance?: ButtonAppearance;
  /** 32 / 40 / 48px tall with a precise pointer, +4px on touch screens (md becomes 44px). @default "md" */
  size?: ButtonSize;
  /** Blocks clicks, overlays a spinner without changing the button's size, and sets aria-busy. Keeps focus. @default false */
  loading?: boolean;
  /** Icon or element shown before the label. */
  prefix?: ReactNode;
  /** Icon or element shown after the label. */
  suffix?: ReactNode;
  /**
   * Renders icon-only — `children` becomes the glyph and the button turns
   * circular. There is no visible text fallback, so `label` is required
   * in this mode. @default false
   */
  iconOnly?: boolean;
  /**
   * Accessible name. Required when `iconOnly` (becomes aria-label — the
   * only source of an accessible name in that mode). Optional otherwise,
   * since visible label text already provides one.
   */
  label?: string;
  /**
   * Toggle mode: passing `pressed` (controlled, with `onPressedChange`) or
   * `defaultPressed` (uncontrolled) turns this into a persistent on/off
   * toggle button, exposed via aria-pressed. When on, the button takes the
   * solid treatment of its own intent.
   */
  pressed?: boolean;
  /** Toggle mode, uncontrolled: whether the toggle starts on. */
  defaultPressed?: boolean;
  /** Called with the new state whenever a toggle button is pressed. */
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Floating Action Button treatment: larger, elevated, and circular when
   * `iconOnly` or a wide pill otherwise. Layout (fixed positioning) is left
   * to the consumer. @default false
   */
  floating?: boolean;
  /** Stretches to the width of its container. @default false */
  fullWidth?: boolean;
  /**
   * Renders as a different element (e.g. an anchor) instead of a native
   * `<button>`, while keeping Button's styling and disabled semantics.
   * Receives the fully computed DOM props to spread onto that element.
   * Because non-button elements (like `<a>`) don't support the `disabled`
   * attribute, the disabled state is expressed as `aria-disabled` +
   * `tabIndex={-1}` instead when `render` is used.
   */
  render?: (props: Record<string, unknown>) => ReactElement;
}

export type ButtonProps = ButtonOwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick" | "prefix"> & {
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    intent: intentProp,
    appearance: appearanceProp,
    size: sizeProp,
    loading = false,
    prefix,
    suffix,
    disabled = false,
    iconOnly = false,
    label,
    pressed: pressedProp,
    defaultPressed,
    onPressedChange,
    floating = false,
    fullWidth = false,
    render,
    className,
    children,
    type = "button",
    onClick,
    ...rest
  },
  ref
) {
  const group = useContext(ButtonGroupContext);
  const intent = intentProp ?? group?.intent ?? "accent";
  const appearance = appearanceProp ?? group?.appearance ?? "solid";
  const size = sizeProp ?? group?.size ?? "md";
  const isBlocked = disabled || loading;
  const isToggle = pressedProp !== undefined || defaultPressed !== undefined;
  const toggle = useToggleState({ isSelected: pressedProp, defaultSelected: defaultPressed, onChange: onPressedChange });
  const pressed = toggle.isSelected;

  // While loading, the content stays in place (hidden by CSS) and the
  // spinner sits on top of it, so the button never changes size.
  const content = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" data-spinner="" />}
      {prefix}
      {children}
      {suffix}
    </>
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isBlocked) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
    if (isToggle) toggle.toggle();
  };

  const sharedProps = {
    className: [styles.root, className].filter(Boolean).join(" "),
    "data-intent": intent,
    "data-appearance": appearance,
    "data-size": size,
    "data-disabled": disabled || undefined,
    "data-loading": loading || undefined,
    "data-icon-only": iconOnly || undefined,
    "data-floating": floating || undefined,
    "data-full-width": fullWidth || undefined,
    "data-group": group?.attached ? "attached" : undefined,
    "data-pressed": isToggle && pressed ? true : undefined,
    "aria-busy": loading || undefined,
    "aria-pressed": isToggle ? pressed : undefined,
    "aria-label": label,
    onClick: handleClick,
    children: content,
    ...rest,
  };

  if (render) {
    return render({
      ...sharedProps,
      "aria-disabled": isBlocked || undefined,
      tabIndex: disabled ? -1 : undefined,
    });
  }

  // Loading stays focusable (aria-disabled, not disabled) so a submit
  // button doesn't drop keyboard focus mid-request.
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-disabled={loading || undefined}
      {...sharedProps}
    />
  );
});

Button.displayName = "Button";
