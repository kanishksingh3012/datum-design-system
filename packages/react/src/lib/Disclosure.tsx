import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { mergeProps, useButton, useDisclosure } from "react-aria";
import { useDisclosureState } from "react-stately";
import { useControllableState } from "./useControllableState";
import styles from "./Disclosure.module.css";

/** How long a finished stream stays open before it settles closed. */
const COLLAPSE_DELAY_MS = 600;

export interface DisclosureOwnProps {
  /** The trigger's label. */
  title: ReactNode;
  /** A leading icon, drawn in `text.secondary`. */
  icon?: ReactNode;
  /** Trailing detail inside the trigger: a status badge, a count. */
  meta?: ReactNode;
  /** Whether the panel is open (controlled). */
  open?: boolean;
  /** Whether the panel starts open (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Called with the new open state whenever it changes. */
  onOpenChange?: (open: boolean) => void;
  /** Content still arriving: holds the panel open and marks it `aria-busy`. @default false */
  streaming?: boolean;
  /** Settle closed shortly after streaming ends, unless the reader toggled it meanwhile. @default true */
  collapseOnComplete?: boolean;
  /** Announce the panel's content politely once it finishes updating. @default false */
  live?: boolean;
  children?: ReactNode;
}

export type DisclosureProps = DisclosureOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "title">;

/**
 * The expandable card shared by Reasoning, ToolCall, TodoList, FileDiff and
 * AgentActivity: Accordion's trigger (react-aria `useDisclosure` + `useButton`)
 * in a bordered `radius.card` box. While `streaming`, it holds open; on the
 * edge where streaming ends it settles closed, unless the reader opened or
 * closed it by hand in the meantime — a manual toggle is never overridden.
 */
export function Disclosure({
  title,
  icon,
  meta,
  open,
  defaultOpen = false,
  onOpenChange,
  streaming = false,
  collapseOnComplete = true,
  live = false,
  className,
  children,
  ...rest
}: DisclosureProps) {
  const [isOpen, setOpen] = useControllableState(open, defaultOpen || streaming, onOpenChange);
  const touched = useRef(false);
  const wasStreaming = useRef(streaming);

  useEffect(() => {
    const ended = wasStreaming.current && !streaming;
    wasStreaming.current = streaming;
    if (streaming) {
      touched.current = false;
      setOpen(true);
      return;
    }
    if (!ended || !collapseOnComplete) return;
    const timer = setTimeout(() => {
      if (!touched.current) setOpen(false);
    }, COLLAPSE_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming, collapseOnComplete]);

  const state = useDisclosureState({
    isExpanded: isOpen,
    onExpandedChange: (next) => {
      touched.current = true;
      setOpen(next);
    },
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { buttonProps: disclosureProps, panelProps } = useDisclosure({ isExpanded: isOpen }, state, panelRef);
  const { buttonProps } = useButton(disclosureProps, triggerRef);

  return (
    <div
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-expanded={isOpen || undefined}
      data-streaming={streaming || undefined}
      {...rest}
    >
      <button ref={triggerRef} className={styles.trigger} {...mergeProps(buttonProps)}>
        {icon ? <span className={styles.icon}>{icon}</span> : null}
        <span className={styles.title}>{title}</span>
        {meta ? <span className={styles.meta}>{meta}</span> : null}
        <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div ref={panelRef} className={styles.panel} {...panelProps}>
        <div className={styles.content} aria-live={live ? "polite" : undefined} aria-busy={live && streaming ? true : undefined}>
          {children}
        </div>
      </div>
    </div>
  );
}
