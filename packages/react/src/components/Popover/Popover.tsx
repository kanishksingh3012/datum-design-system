import { forwardRef, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode, type RefObject } from "react";
import { DismissButton, Overlay, mergeProps, useButton, useDialog, useObjectRef, useOverlayTrigger, usePopover, type AriaButtonProps } from "react-aria";
import { useOverlayTriggerState, type OverlayTriggerState } from "react-stately";
import { cloneTrigger } from "../../lib/cloneTrigger";
import styles from "./Popover.module.css";

export type PopoverPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "right";

export interface PopoverOwnProps {
  /** The element that opens the popover, usually a Button. */
  trigger: ReactElement;
  children: ReactNode;
  /** A heading at the top that also names the popover. Without one, the trigger's text names it (or pass `aria-label`). */
  title?: ReactNode;
  /** Preferred side; flips when there is no room. @default "bottom" */
  placement?: PopoverPlacement;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** `ref`, `className` and every other prop go on the panel. */
export type PopoverProps = PopoverOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children" | "title">;

const toAriaPlacement = (placement: PopoverPlacement) => placement.replace("-", " ") as "bottom";

/**
 * Rich, interactive content anchored to a trigger — a small form, filters,
 * details. A dialog on React Aria's overlay hooks (`useOverlayTrigger`,
 * `usePopover`, `useDialog`): focus moves in on open and back to the trigger
 * on close; Escape or a click outside closes it.
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { trigger, children, title, placement = "bottom", open, defaultOpen, onOpenChange, ...rest },
  ref
) {
  const state = useOverlayTriggerState({ isOpen: open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement>(null);
  const { triggerProps, overlayProps } = useOverlayTrigger({ type: "dialog" }, state, triggerRef);
  const { buttonProps } = useButton(triggerProps as AriaButtonProps, triggerRef);
  const ownId = (trigger.props as { id?: string }).id;
  const fallbackId = useId();
  const triggerId = ownId ?? fallbackId;
  return (
    <>
      {cloneTrigger(trigger, { ...buttonProps, id: triggerId }, triggerRef)}
      {state.isOpen ? (
        <Panel ref={ref} state={state} triggerRef={triggerRef} placement={placement} title={title} triggerId={triggerId} {...mergeProps(overlayProps, rest)}>
          {children}
        </Panel>
      ) : null}
    </>
  );
});

Popover.displayName = "Popover";

interface PanelProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  state: OverlayTriggerState;
  triggerRef: RefObject<HTMLElement | null>;
  placement: PopoverPlacement;
  title?: ReactNode;
  triggerId: string;
}

const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { state, triggerRef, placement, title, triggerId, className, style, children, ...rest },
  forwardedRef
) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const dialogRef = useObjectRef(forwardedRef);
  const titleId = useId();
  const { popoverProps } = usePopover({ triggerRef, popoverRef, placement: toAriaPlacement(placement), offset: 8 }, state);
  const named = title ? { "aria-labelledby": titleId } : rest["aria-label"] || rest["aria-labelledby"] ? {} : { "aria-labelledby": triggerId };
  const { dialogProps, titleProps } = useDialog({ id: rest.id, "aria-label": rest["aria-label"], ...named }, dialogRef);
  return (
    <Overlay>
      <div {...popoverProps} ref={popoverRef} className={styles.popover}>
        <DismissButton onDismiss={state.close} />
        <div
          {...mergeProps(rest, dialogProps)}
          {...named}
          ref={dialogRef}
          className={[styles.root, className].filter(Boolean).join(" ")}
          style={style}
        >
          {title ? (
            <h2 {...titleProps} id={titleId} className={styles.title}>
              {title}
            </h2>
          ) : null}
          {children}
        </div>
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
});
