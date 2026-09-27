import { forwardRef, type HTMLAttributes, type ReactElement } from "react";
import { Focusable, Tooltip as AriaTooltip, TooltipTrigger } from "react-aria-components";
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
 * aria-describedby (React Aria). Escape hides it. It supplements the
 * trigger's accessible name — an icon-only Button still needs `label`.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { content, children, placement = "top", delay = 500, open, defaultOpen, onOpenChange, className, ...rest },
  ref
) {
  return (
    <TooltipTrigger delay={delay} isOpen={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Focusable>{children as never}</Focusable>
      <AriaTooltip
        ref={ref}
        placement={placement}
        offset={6}
        className={[styles.root, className].filter(Boolean).join(" ")}
        {...(rest as Record<string, unknown>)}
      >
        {content}
      </AriaTooltip>
    </TooltipTrigger>
  );
});

Tooltip.displayName = "Tooltip";
