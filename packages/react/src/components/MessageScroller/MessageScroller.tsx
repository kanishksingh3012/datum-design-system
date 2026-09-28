import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { MessageLogContext } from "../../lib/messageLog";
import { Button } from "../Button/Button";
import { ScrollArea } from "../ScrollArea/ScrollArea";
import styles from "./MessageScroller.module.css";

/** Within this distance of the bottom (px) still counts as at the bottom. */
const THRESHOLD = 24;

export interface MessageScrollerOwnProps {
  /** Names the conversation for assistive tech. @default "Conversation" */
  label?: string;
  /** Caps the height; the transcript scrolls inside. Or size it with CSS. */
  maxHeight?: number | string;
  /** Start pinned to the latest message. @default true */
  defaultPinned?: boolean;
  /** Called when the reader scrolls away from the bottom (false) or back to it (true). */
  onPinnedChange?: (pinned: boolean) => void;
  /** The button that returns to the latest message. @default "Jump to latest" */
  jumpLabel?: string;
  children?: ReactNode;
}

export type MessageScrollerProps = MessageScrollerOwnProps & HTMLAttributes<HTMLDivElement>;

const ArrowDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 5v14 M19 12l-7 7-7-7" />
  </svg>
);

/**
 * The transcript's scroll box (a ScrollArea) around a role="log". It stays
 * pinned to the bottom while content grows — a new message or a streaming one
 * getting longer — until the reader scrolls up; then it holds still and shows
 * "Jump to latest". Whether the reader is at the bottom is read from the DOM,
 * so it isn't a controlled prop: seed it with `defaultPinned`, observe it with
 * `onPinnedChange`. To start a new conversation fresh, give it a new `key`.
 */
export const MessageScroller = forwardRef<HTMLDivElement, MessageScrollerProps>(function MessageScroller(
  { label = "Conversation", maxHeight, defaultPinned = true, onPinnedChange, jumpLabel = "Jump to latest", className, children, ...rest },
  ref
) {
  const box = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => root.current!);
  const [pinned, setPinnedState] = useState(defaultPinned);
  const pinnedRef = useRef(defaultPinned);
  const onChange = useRef(onPinnedChange);
  onChange.current = onPinnedChange;

  const setPinned = useCallback((next: boolean) => {
    if (next === pinnedRef.current) return;
    pinnedRef.current = next;
    setPinnedState(next);
    onChange.current?.(next);
  }, []);
  // ScrollArea's box wraps its scrolling viewport as its first child
  const viewport = () => (box.current?.firstElementChild as HTMLElement | null) ?? null;
  const toBottom = () => {
    const v = viewport();
    if (v) v.scrollTop = v.scrollHeight;
  };

  // follow new content on every render while pinned (a new message, a longer stream)…
  useLayoutEffect(() => {
    if (pinnedRef.current) toBottom();
  });
  // …and on growth that doesn't re-render this component (images loading, a panel opening)
  useEffect(() => {
    const v = viewport();
    if (!v) return;
    const onScroll = () => setPinned(v.scrollHeight - v.scrollTop - v.clientHeight <= THRESHOLD);
    v.addEventListener("scroll", onScroll, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => pinnedRef.current && toBottom());
    if (log.current) observer?.observe(log.current);
    return () => {
      v.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, [setPinned]);

  return (
    <div ref={root} className={[styles.root, className].filter(Boolean).join(" ")} data-pinned={pinned || undefined} {...rest}>
      <ScrollArea ref={box} label={label} maxHeight={maxHeight} padding="sm" className={styles.scroll}>
        <MessageLogContext.Provider value={true}>
          <div ref={log} role="log" aria-relevant="additions" className={styles.log}>
            {children}
          </div>
        </MessageLogContext.Provider>
      </ScrollArea>
      {!pinned ? (
        <div className={styles.jump}>
          <Button
            intent="neutral"
            size="sm"
            prefix={<ArrowDown />}
            onClick={() => {
              toBottom();
              setPinned(true);
            }}
          >
            {jumpLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
});

MessageScroller.displayName = "MessageScroller";
