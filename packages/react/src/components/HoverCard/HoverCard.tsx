import { forwardRef, useEffect, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode, type RefObject } from "react";
import { Overlay, mergeProps, useFocus, useHover, useKeyboard, useObjectRef, useOverlayPosition } from "react-aria";
import { useOverlayTriggerState, type OverlayTriggerState } from "react-stately";
import { cloneTrigger } from "../../lib/cloneTrigger";
import styles from "./HoverCard.module.css";

export type HoverCardPlacement = "top" | "right" | "bottom" | "left";

export interface HoverCardOwnProps {
  /** The element it previews, usually a Link. Must be focusable so keyboard users get it too. */
  trigger: ReactElement;
  /** A preview: a profile, a page summary. Supplementary only — never the one way to reach an action. */
  children: ReactNode;
  /** Preferred side; flips when there is no room. @default "bottom" */
  placement?: HoverCardPlacement;
  /** ms before it opens on hover or focus. @default 500 */
  openDelay?: number;
  /** ms before it closes once the pointer or focus leaves (time to move onto the card). @default 300 */
  closeDelay?: number;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** `ref`, `className` and every other prop go on the card. */
export type HoverCardProps = HoverCardOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children">;

/**
 * A preview card on hover or keyboard focus, for sighted pointer and keyboard
 * users. It stays open while the pointer is on the trigger or the card, and
 * Escape closes it. The trigger is described by the card while it is open.
 * Built on React Aria's `useHover`, `useFocus`, `useKeyboard` and
 * `useOverlayPosition` with `useOverlayTriggerState`.
 */
export const HoverCard = forwardRef<HTMLDivElement, HoverCardProps>(function HoverCard(
  { trigger, children, placement = "bottom", openDelay = 500, closeDelay = 300, open, defaultOpen, onOpenChange, ...rest },
  ref
) {
  const state = useOverlayTriggerState({ isOpen: open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement>(null);
  const cardId = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // the pointer is on the card: leaving the trigger (or its focus) doesn't close it
  const onCard = useRef(false);
  const clear = () => clearTimeout(timer.current);
  const later = (fn: () => void, ms: number) => {
    clear();
    timer.current = setTimeout(fn, ms);
  };
  useEffect(() => clear, []);

  const show = () => later(state.open, openDelay);
  const hide = () => {
    if (onCard.current) clear();
    else later(state.close, closeDelay);
  };
  const { hoverProps } = useHover({ onHoverStart: show, onHoverEnd: hide });
  const { focusProps } = useFocus({ onFocus: show, onBlur: hide });
  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === "Escape" && state.isOpen) {
        clear();
        state.close();
      } else e.continuePropagation();
    },
  });
  const { hoverProps: cardHoverProps } = useHover({
    onHoverStart: () => {
      onCard.current = true;
      clear();
    },
    onHoverEnd: () => {
      onCard.current = false;
      hide();
    },
  });

  return (
    <>
      {cloneTrigger(trigger, mergeProps(hoverProps, focusProps, keyboardProps, { "aria-describedby": state.isOpen ? cardId : undefined }), triggerRef)}
      {state.isOpen ? (
        <Overlay>
          <Card ref={ref} id={cardId} state={state} triggerRef={triggerRef} placement={placement} {...mergeProps(rest, cardHoverProps)}>
            {children}
          </Card>
        </Overlay>
      ) : null}
    </>
  );
});

HoverCard.displayName = "HoverCard";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  state: OverlayTriggerState;
  triggerRef: RefObject<HTMLElement | null>;
  placement: HoverCardPlacement;
}

const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ state, triggerRef, placement, className, style, ...rest }, forwardedRef) {
  const ref = useObjectRef(forwardedRef);
  const { overlayProps, placement: actual } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: ref,
    placement,
    offset: 8,
    isOpen: state.isOpen,
  });
  return (
    <div
      {...rest}
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={{ ...overlayProps.style, ...style }}
      data-placement={actual ?? placement}
    />
  );
});
