import { forwardRef, useEffect, useImperativeHandle, useRef, type ReactNode } from "react";
import styles from "./Dialog.module.css";

export interface DialogOwnProps {
  open: boolean;
  title: string;
  body?: string;
  /** Fires on both a Cancel/Delete button (native <form method="dialog">) and Escape. */
  onClose: () => void;
  /** Actions - typically inside a <form method="dialog"> so closing needs no custom JS. */
  children?: ReactNode;
}

export type DialogProps = DialogOwnProps;

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
  { open, title, body, onClose, children },
  ref
) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<Element | null>(null);
  useImperativeHandle(ref, () => dialogRef.current as HTMLDialogElement);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      triggerRef.current = document.activeElement;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function handleClose() {
      onClose();
      const trigger = triggerRef.current;
      if (trigger instanceof HTMLElement) trigger.focus();
    }
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog ref={dialogRef} className={styles.root} aria-labelledby="datum-dialog-title">
      <div className={styles.panel}>
        <h2 className={styles.title} id="datum-dialog-title">
          {title}
        </h2>
        {body ? <p className={styles.body}>{body}</p> : null}
        {children}
      </div>
    </dialog>
  );
});

Dialog.displayName = "Dialog";
