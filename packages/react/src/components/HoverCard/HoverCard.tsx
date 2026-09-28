import { forwardRef, useEffect, useId, useRef, type HTMLAttributes, type ReactElement, type ReactNode, type Ref, type RefObject } from "react";
import { Overlay, mergeProps, mergeRefs, useFocus, useFocusWithin, useHover, useKeyboard, useObjectRef, useOverlayPosition } from "react-aria";
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

const TABBABLE = 'a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex]';
const tabbables = (root: Element) =>
  [...root.querySelectorAll<HTMLElement>(TABBABLE)].filter((el) => el.tabIndex >= 0 && !el.closest("[hidden], [inert]"));

/**
 * A preview card on hover or keyboard focus, for sighted pointer and keyboard
 * users. It stays open while the pointer or focus is on the trigger or the
 * card: Tab from the trigger moves into the card's links, and Tab past the
 * last one moves on to what follows the trigger. Escape closes it. The trigger is described by the card while it is open.
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
  // the pointer (or focus) is on the card: leaving the trigger doesn't close it
  const onCard = useRef(false);
  const inCard = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const clear = () => clearTimeout(timer.current);
  const later = (fn: () => void, ms: number) => {
    clear();
    timer.current = setTimeout(fn, ms);
  };
  useEffect(() => clear, []);

  const show = () => later(state.open, openDelay);
  const hide = () => {
    if (onCard.current || inCard.current) clear();
    else later(state.close, closeDelay);
  };
  const { hoverProps } = useHover({ onHoverStart: show, onHoverEnd: hide });
  const { focusProps } = useFocus({ onFocus: show, onBlur: hide });
  const { keyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      if (e.key === "Escape" && state.isOpen) {
        clear();
        state.close();
      } else if (e.key === "Tab" && !e.shiftKey && state.isOpen && cardRef.current) {
        // the card is portalled to the end of the page: Tab takes focus into it, as if it followed the trigger
        const first = tabbables(cardRef.current)[0];
        if (first) {
          e.preventDefault();
          clear();
          first.focus();
        } else e.continuePropagation();
      } else e.continuePropagation();
    },
  });
  const { focusWithinProps } = useFocusWithin({
    onFocusWithinChange: (focused) => {
      inCard.current = focused;
      if (focused) clear();
      else hide();
    },
  });
  const { keyboardProps: cardKeyboardProps } = useKeyboard({
    onKeyDown: (e) => {
      const card = cardRef.current;
      const trigger = triggerRef.current;
      if (!card || !trigger) return e.continuePropagation();
      if (e.key === "Escape") {
        clear();
        state.close();
        trigger.focus();
        return;
      }
      if (e.key !== "Tab") return e.continuePropagation();
      const inside = tabbables(card);
      const edge = e.shiftKey ? inside[0] : inside[inside.length - 1];
      if (e.target !== edge) return e.continuePropagation();
      // leaving the card: back to the trigger, or on to whatever follows the trigger
      e.preventDefault();
      let next: HTMLElement | undefined = trigger;
      if (!e.shiftKey) {
        next = tabbables(document.body).find(
          (el) => !card.contains(el) && Boolean(trigger.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
        );
        state.close();
      }
      (next ?? trigger).focus();
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
          <Card ref={mergeRefs(ref, cardRef) as Ref<HTMLDivElement>} id={cardId} state={state} triggerRef={triggerRef} placement={placement} {...mergeProps(rest, cardHoverProps, focusWithinProps, cardKeyboardProps)}>
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
