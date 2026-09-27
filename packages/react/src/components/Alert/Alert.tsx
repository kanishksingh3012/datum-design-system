import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useOverlayTriggerState } from "react-stately";
import { CloseIcon, StatusIcon } from "../../lib/statusIcons";
import styles from "./Alert.module.css";

export type AlertIntent = "info" | "success" | "warning" | "danger" | "neutral";
export type AlertAppearance = "soft" | "outline" | "solid";

export interface AlertOwnProps {
  /** What the message means; picks the icon. `danger` interrupts screen readers (role="alert"), the rest are polite. @default "info" */
  intent?: AlertIntent;
  /** Tint / border only / the solid fill of the intent, for banners. @default "soft" */
  appearance?: AlertAppearance;
  /** The message in a few words. */
  title?: ReactNode;
  /** Detail under the title. */
  description?: ReactNode;
  /** A Button or Link. Sits under the text, or at the end of the row in a solid banner. */
  action?: ReactNode;
  /**
   * Square ends and no side borders, for an alert that runs edge to edge of
   * the viewport (a page banner). Only when it genuinely touches both edges —
   * anywhere else it keeps radius.card. @default false
   */
  fullBleed?: boolean;
  /** Shows a close button that hides the alert. @default false */
  dismissible?: boolean;
  /** Whether the alert is shown (controlled). */
  open?: boolean;
  /** Whether the alert starts shown (uncontrolled). @default true */
  defaultOpen?: boolean;
  /** Called with `false` when the alert is dismissed. */
  onOpenChange?: (open: boolean) => void;
}

export type AlertProps = AlertOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "role" | "title">;

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    intent = "info",
    appearance = "soft",
    title,
    description,
    action,
    fullBleed = false,
    dismissible = false,
    open,
    defaultOpen = true,
    onOpenChange,
    className,
    children,
    ...rest
  },
  ref
) {
  const state = useOverlayTriggerState({ isOpen: open, defaultOpen, onOpenChange });
  if (!state.isOpen) return null;

  return (
    <div
      ref={ref}
      role={intent === "danger" ? "alert" : "status"}
      data-intent={intent}
      data-appearance={appearance}
      data-full-bleed={fullBleed || undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...rest}
    >
      <StatusIcon intent={intent} className={styles.icon} />
      <div className={styles.content}>
        {title ? <div className={styles.title}>{title}</div> : null}
        {description ? <div className={styles.description}>{description}</div> : null}
        {children}
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
      {dismissible ? (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={state.close}>
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
});

Alert.displayName = "Alert";
