import { forwardRef, type ButtonHTMLAttributes, type ReactElement } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "default" | "sm";

export interface ButtonOwnProps {
  /** Visual weight and semantic color. @default "primary" */
  variant?: ButtonVariant;
  /** `default` meets the 44px WCAG 2.5.5 target; `sm` is 36px, dense contexts only. @default "default" */
  size?: ButtonSize;
  /** Implies `disabled` and shows the inline spinner. @default false */
  loading?: boolean;
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

export type ButtonProps = ButtonOwnProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "default",
    loading = false,
    disabled = false,
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

  const content = (
    <>
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {children}
    </>
  );

  const sharedProps = {
    className: [styles.root, className].filter(Boolean).join(" "),
    "data-variant": variant,
    "data-size": size,
    "data-loading": loading || undefined,
    "aria-busy": loading || undefined,
    onClick: isDisabled ? undefined : onClick,
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
