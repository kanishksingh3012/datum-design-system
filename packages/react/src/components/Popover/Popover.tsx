import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import styles from "./Popover.module.css";

/**
 * The HTML popover attribute (declarative popovertarget triggering, free
 * light-dismiss and top-layer stacking) isn't typed in the @types/react
 * version this package targets and isn't implemented in jsdom either
 * (confirmed: showPopover/hidePopover are undefined) - the same gap that
 * shaped Dialog. Rather than cast attributes through `as any` for
 * something untestable here, Popover uses plain controlled state plus
 * real outside-click and Escape handling, matching the accessibility
 * contract (dismissible, returns focus) without the native attribute.
 */
export interface PopoverOwnProps {
  trigger: ReactElement<{ onClick?: () => void; "aria-expanded"?: boolean; "aria-haspopup"?: string }>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

export type PopoverOwnPropsOnly = PopoverOwnProps;

export function Popover({ trigger, open: controlledOpen, onOpenChange, children }: PopoverOwnProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const contentId = useId();
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  function setOpen(next: boolean) {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (contentRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const clonedTrigger = isValidElement(trigger)
    ? cloneElement(trigger, {
        ref: triggerRef,
        onClick: () => setOpen(!open),
        "aria-expanded": open,
        "aria-haspopup": "dialog",
        "aria-controls": open ? contentId : undefined,
      } as never)
    : trigger;

  return (
    <span className={styles.root}>
      {clonedTrigger}
      {open ? (
        <div ref={contentRef} id={contentId} className={styles.content}>
          {children}
        </div>
      ) : null}
    </span>
  );
}
