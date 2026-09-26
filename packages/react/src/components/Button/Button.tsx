import { forwardRef, type ButtonHTMLAttributes, type MouseEvent, type ReactElement, type ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "outline"
  | "text"
  | "link"
  | "danger"
  | "danger-soft";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonOwnProps {
  /** Visual weight and semantic color. @default "primary" */
  variant?: ButtonVariant;
  /** `md` meets the 44px WCAG 2.5.5 target; `sm` is 36px (dense contexts only), `lg` is 52px. @default "md" */
  size?: ButtonSize;
  /** Implies `disabled` and shows the inline spinner in the prefix slot. @default false */
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
   * Toggle mode: passing `pressed` (paired with `onPressedChange`) turns
   * this into a persistent on/off toggle button, exposed via aria-pressed.
   * Pressed styling overrides `variant` with a filled-accent treatment,
   * regardless of which variant is set.
   */
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Floating Action Button treatment: larger, elevated, and circular when
   * `iconOnly` or a wide pill otherwise. Layout (fixed positioning) is left
   * to the consumer. @default false
   */
  floating?: boolean;
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

export type ButtonProps = ButtonOwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> & {
  children?: React.ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    prefix,
    suffix,
    disabled = false,
    iconOnly = false,
    label,
    pressed,
    onPressedChange,
    floating = false,
    render,
    className,
    children,
    type = "button",
    onClick,
    ...rest
  },
  ref
) {
  const isDisabled = disabled || loading;
  const isToggle = pressed !== undefined;

  const content = (
    <>
      {loading ? <span className={styles.spinner} aria-hidden="true" /> : prefix}
      {children}
      {!loading && suffix}
    </>
  );

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (isToggle) onPressedChange?.(!pressed);
  };

  const sharedProps = {
    className: [styles.root, className].filter(Boolean).join(" "),
    "data-variant": variant,
    "data-size": size,
    "data-loading": loading || undefined,
    "data-icon-only": iconOnly || undefined,
    "data-floating": floating || undefined,
    "data-pressed": isToggle && pressed ? true : undefined,
    "aria-busy": loading || undefined,
    "aria-pressed": isToggle ? pressed : undefined,
    "aria-label": label,
    onClick: isDisabled ? undefined : handleClick,
    children: content,
    ...rest,
  };

  if (render) {
    return render({
      ...sharedProps,
      "aria-disabled": isDisabled || undefined,
      tabIndex: isDisabled ? -1 : undefined,
    });
  }

  return <button ref={ref} type={type} disabled={isDisabled} {...sharedProps} />;
});

Button.displayName = "Button";
