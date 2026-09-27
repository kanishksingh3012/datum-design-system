import { useRef, type ReactNode } from "react";
import { useButton, useToast, useToastRegion } from "react-aria";
import { ToastQueue, useToastQueue, type QueuedToast, type ToastState } from "react-stately";
import { CloseIcon, StatusIcon } from "../../lib/statusIcons";
import { Button } from "../Button/Button";
import styles from "./Toast.module.css";

export type ToastIntent = "neutral" | "success" | "danger" | "warning" | "info";
export type ToastPosition = "top-center" | "top-end" | "bottom-center" | "bottom-end";

export interface ToastOptions {
  /** What the message means. Every intent but neutral shows its icon. @default "neutral" */
  intent?: ToastIntent;
  /** The message in a few words. */
  title?: ReactNode;
  /** Detail under the title. */
  description?: ReactNode;
  /** One follow-up action, e.g. Undo. Activating it also closes the toast. */
  action?: { label: string; onAction: () => void };
  /** Milliseconds until it closes itself; paused while the pointer or focus is on any toast. `null` stays until dismissed. @default 5000 */
  duration?: number | null;
  /** Called when the toast closes, by timeout, dismiss or action. */
  onClose?: () => void;
}

export type ToastContent = Omit<ToastOptions, "duration" | "onClose">;

/** The queue behind `toast()`. Pass your own to a Toaster to run a separate stack. */
export const toastQueue = new ToastQueue<ToastContent>({ maxVisibleToasts: 5 });

/** Shows a toast in the Toaster; returns its key. */
export function toast({ duration = 5000, onClose, ...content }: ToastOptions, queue = toastQueue): string {
  return queue.add(content, { timeout: duration ?? undefined, onClose });
}
/** Closes a toast by the key `toast()` returned. */
toast.close = (key: string, queue = toastQueue) => queue.close(key);

export interface ToasterProps {
  /** Corner or edge the stack sits in; the newest toast is nearest the edge. @default "bottom-end" */
  position?: ToastPosition;
  /** @default toastQueue, the queue `toast()` adds to */
  queue?: ToastQueue<ToastContent>;
  /** Name of the landmark region (reachable with F6). @default "Notifications" */
  "aria-label"?: string;
}

/** Renders the toast stack. Mount one near the root of the app. */
export function Toaster({ position = "bottom-end", queue = toastQueue, ...props }: ToasterProps) {
  const state = useToastQueue(queue);
  return state.visibleToasts.length > 0 ? <ToastRegion {...props} position={position} state={state} /> : null;
}

function ToastRegion({ position, state, ...props }: Omit<ToasterProps, "queue"> & { state: ToastState<ToastContent> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { regionProps } = useToastRegion({ "aria-label": "Notifications", ...props }, state, ref);
  return (
    <div {...regionProps} ref={ref} className={styles.region} data-position={position}>
      {state.visibleToasts.map((t) => (
        <Toast key={t.key} toast={t} state={state} />
      ))}
    </div>
  );
}

function Toast({ toast: queued, state }: { toast: QueuedToast<ToastContent>; state: ToastState<ToastContent> }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { toastProps, contentProps, titleProps, descriptionProps, closeButtonProps } = useToast({ toast: queued }, state, ref);
  const { buttonProps } = useButton(closeButtonProps, closeRef);
  const { intent = "neutral", title, description, action } = queued.content;

  return (
    <div {...toastProps} ref={ref} className={styles.toast} data-intent={intent}>
      <div {...contentProps} className={styles.content}>
        {intent !== "neutral" ? <StatusIcon intent={intent} className={styles.icon} /> : null}
        <div className={styles.text}>
          {title ? <div {...titleProps} className={styles.title}>{title}</div> : null}
          {description ? <div {...descriptionProps} className={styles.description}>{description}</div> : null}
        </div>
      </div>
      {action ? (
        <Button
          size="sm"
          intent="neutral"
          appearance="outline"
          className={styles.action}
          onClick={() => {
            action.onAction();
            state.close(queued.key);
          }}
        >
          {action.label}
        </Button>
      ) : null}
      <button {...buttonProps} ref={closeRef} className={styles.close}>
        <CloseIcon />
      </button>
    </div>
  );
}
