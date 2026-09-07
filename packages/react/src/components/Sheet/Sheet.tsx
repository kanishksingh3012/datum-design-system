import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import styles from "./Sheet.module.css";

export type SheetSide = "bottom" | "top" | "left" | "right";

export interface SheetOwnProps {
  open: boolean;
  title: string;
  onClose: () => void;
  /** @default "bottom" */
  side?: SheetSide;
  children?: ReactNode;
}

export type SheetProps = SheetOwnProps;

const DISMISS_THRESHOLD_PX = 80;

/**
 * Built on native <dialog>/.showModal() exactly like Dialog, anchored to
 * an edge via CSS instead of the browser's default centering. Drag-to-
 * dismiss is layered on as a convenience over a pointer handle - the
 * close button is never removed or hidden behind it, since every
 * gesture-based dismissal needs a real, tappable alternative (a common,
 * specifically-flagged miss in bottom-sheet accessibility audits).
 */
export function Sheet({ open, title, onClose, side = "bottom", children }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<Element | null>(null);
  const dragStateRef = useRef<{ startX: number; startY: number } | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

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
      setDragOffset(0);
      const trigger = triggerRef.current;
      if (trigger instanceof HTMLElement) trigger.focus();
    }
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  const axis = side === "left" || side === "right" ? "x" : "y";
  const dismissDirection = side === "top" || side === "left" ? -1 : 1;

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    dragStateRef.current = { startX: event.clientX, startY: event.clientY };
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragStateRef.current) return;
    const delta =
      axis === "x" ? event.clientX - dragStateRef.current.startX : event.clientY - dragStateRef.current.startY;
    const alongDismissDirection = delta * dismissDirection;
    setDragOffset(Math.max(0, alongDismissDirection));
  }

  function handlePointerUp() {
    setDragging(false);
    dragStateRef.current = null;
    if (dragOffset > DISMISS_THRESHOLD_PX) {
      dialogRef.current?.close();
    } else {
      setDragOffset(0);
    }
  }

  const translate = dragOffset * dismissDirection;
  const transform =
    dragOffset > 0
      ? axis === "x"
        ? `translateX(${translate}px)`
        : `translateY(${translate}px)`
      : undefined;

  return (
    <dialog
      ref={dialogRef}
      className={styles.root}
      data-side={side}
      aria-label={title}
      style={transform ? { transform, transition: dragging ? "none" : undefined } : undefined}
    >
      <div className={styles.handleArea} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        <div className={styles.handle} aria-hidden="true" />
      </div>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button type="button" className={styles.close} onClick={() => dialogRef.current?.close()}>
          Close
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </dialog>
  );
}
