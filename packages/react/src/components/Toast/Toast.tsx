import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Toast.module.css";

export interface ToastOwnProps {
  text: string;
  /** Called when the dismiss button is activated. Omit to render without a dismiss button. */
  onDismiss?: () => void;
}

export type ToastProps = ToastOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "role">;

export const Toast = forwardRef<HTMLDivElement, ToastProps>(function Toast(
  { text, onDismiss, className, ...rest },
  ref
) {
  return (
    <div ref={ref} role="status" className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <span>{text}</span>
      {onDismiss ? (
        <button type="button" className={styles.dismiss} aria-label="Dismiss" onClick={onDismiss}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 5 L15 15 M15 5 L5 15" />
          </svg>
        </button>
      ) : null}
    </div>
  );
});

Toast.displayName = "Toast";
