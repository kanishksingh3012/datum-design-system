import { cloneElement, isValidElement, useId, useRef, useState, type ReactElement, type ReactNode } from "react";
import styles from "./HoverCard.module.css";

export interface HoverCardOwnProps {
  trigger: ReactElement;
  children: ReactNode;
  /** ms to wait before opening on hover/focus. @default 300 */
  openDelay?: number;
  /** ms to wait before closing after the pointer/focus leaves. @default 150 */
  closeDelay?: number;
}

export function HoverCard({ trigger, children, openDelay = 300, closeDelay = 150 }: HoverCardOwnProps) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearPendingTimeout() {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function scheduleOpen() {
    clearPendingTimeout();
    timeoutRef.current = setTimeout(() => setOpen(true), openDelay);
  }

  function scheduleClose() {
    clearPendingTimeout();
    timeoutRef.current = setTimeout(() => setOpen(false), closeDelay);
  }

  const clonedTrigger = isValidElement(trigger)
    ? cloneElement(trigger, {
        onMouseEnter: scheduleOpen,
        onMouseLeave: scheduleClose,
        onFocus: scheduleOpen,
        onBlur: scheduleClose,
        "aria-describedby": open ? contentId : undefined,
      } as never)
    : trigger;

  return (
    <span className={styles.root} onMouseEnter={clearPendingTimeout} onMouseLeave={scheduleClose}>
      {clonedTrigger}
      {open ? (
        <div id={contentId} role="tooltip" className={styles.content}>
          {children}
        </div>
      ) : null}
    </span>
  );
}
