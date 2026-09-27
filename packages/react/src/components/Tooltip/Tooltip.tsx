import { forwardRef, useRef, type HTMLAttributes, type ReactElement, type RefObject } from "react";
import { Overlay, mergeProps, useObjectRef, useOverlayPosition, useTooltip, useTooltipTrigger } from "react-aria";
import { useTooltipTriggerState, type TooltipTriggerState } from "react-stately";
import { cloneTrigger } from "../../lib/cloneTrigger";
import styles from "./Tooltip.module.css";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";

export interface TooltipOwnProps {
  /** Plain text only — a tooltip is never interactive. */
  content: string;
  /** The element it describes. Must be focusable (e.g. a Button) so keyboard users get it too. */
  children: ReactElement;
  /** Preferred side; flips when there is no room. @default "top" */
  placement?: TooltipPlacement;
  /** Hover delay in ms before it shows. Keyboard focus shows it at once. @default 500 */
  delay?: number;
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type TooltipProps = TooltipOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "content" | "children">;

/**
 * A short hint on hover or keyboard focus, linked to its trigger with
 * aria-describedby (React Aria hooks). Escape hides it. It supplements the
 * trigger's accessible name — an icon-only Button still needs `label`.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { content, children, placement = "top", delay = 500, open, defaultOpen, onOpenChange, ...rest },
  ref
) {
  const state = useTooltipTriggerState({ delay, isOpen: open, defaultOpen, onOpenChange });
  const triggerRef = useRef<HTMLElement>(null);
  const { triggerProps, tooltipProps } = useTooltipTrigger({ delay }, state, triggerRef);
  return (
    <>
      {cloneTrigger(children, triggerProps, triggerRef)}
      {state.isOpen ? (
        <Overlay>
          <Bubble ref={ref} state={state} triggerRef={triggerRef} placement={placement} ariaProps={tooltipProps} {...rest}>
            {content}
          </Bubble>
        </Overlay>
      ) : null}
    </>
  );
});

Tooltip.displayName = "Tooltip";

interface BubbleProps extends HTMLAttributes<HTMLDivElement> {
  state: TooltipTriggerState;
  triggerRef: RefObject<HTMLElement | null>;
  placement: TooltipPlacement;
  /** From useTooltipTrigger: the id and hover handlers that keep it open. */
  ariaProps: object;
}

const Bubble = forwardRef<HTMLDivElement, BubbleProps>(function Bubble(
  { state, triggerRef, placement, ariaProps, className, style, ...rest },
  forwardedRef
) {
  const ref = useObjectRef(forwardedRef);
  const { tooltipProps } = useTooltip(ariaProps, state);
  const { overlayProps, placement: actual } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef: ref,
    placement,
    offset: 6,
    isOpen: state.isOpen,
  });
  return (
    <div
      {...mergeProps(rest, tooltipProps)}
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={{ ...overlayProps.style, ...style }}
      data-placement={actual ?? placement}
    />
  );
});
