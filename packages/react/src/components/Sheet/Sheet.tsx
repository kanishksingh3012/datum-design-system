import { forwardRef, type HTMLAttributes } from "react";
import { ModalFrame, ModalPanel, type DialogChildren, type ModalControlProps } from "../Dialog/Dialog";
import styles from "./Sheet.module.css";

export type SheetSide = "top" | "right" | "bottom" | "left";
export type SheetSize = "sm" | "md" | "lg";

export interface SheetOwnProps extends ModalControlProps {
  /** The edge it slides in from. @default "right" */
  side?: SheetSide;
  /** 320 / 420 / 560px — width from the left or right, height from the top or bottom. @default "md" */
  size?: SheetSize;
  /** DialogHeader, DialogBody, DialogFooter — the same slots as Dialog — or a function that receives `close`. */
  children?: DialogChildren;
}

export type SheetProps = SheetOwnProps & Omit<HTMLAttributes<HTMLElement>, "role" | "children">;

/**
 * A panel that slides in from an edge — filters, settings, mobile
 * navigation. It is a modal dialog (React Aria hooks): focus is trapped and
 * returns to the trigger, Escape and a click on the scrim close it.
 */
export const Sheet = forwardRef<HTMLElement, SheetProps>(function Sheet(
  { open, defaultOpen, onOpenChange, trigger, side = "right", size = "md", className, children, ...rest },
  ref
) {
  return (
    <ModalFrame
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      trigger={trigger}
      dismissible
      overlayClassName={styles.overlay}
    >
      <ModalPanel
        ref={ref}
        dismissible
        className={[styles.root, className].filter(Boolean).join(" ")}
        data-side={side}
        data-size={size}
        {...rest}
      >
        {children}
      </ModalPanel>
    </ModalFrame>
  );
});

Sheet.displayName = "Sheet";
