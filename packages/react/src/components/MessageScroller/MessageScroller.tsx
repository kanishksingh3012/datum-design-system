import { Children, useEffect, useRef, type ReactNode } from "react";
import { useStickToBottom, type UseStickToBottomOptions } from "../../lib/useStickToBottom";
import { StickToBottomController } from "../../lib/StickToBottomController";
import styles from "./MessageScroller.module.css";

export { useStickToBottom, StickToBottomController };

export interface MessageScrollerOwnProps extends UseStickToBottomOptions {
  children?: ReactNode;
}

export type MessageScrollerProps = MessageScrollerOwnProps;

/**
 * A role="log" container that follows streamed output at the live edge
 * while pinned, and lets go the moment the reader scrolls away - pinning
 * isn't a controlled prop because "is the reader at the bottom?" is a
 * question only the DOM can answer. Seed it with defaultPinned, observe
 * it with onPinnedChange. New content only pulls the view down when
 * still pinned; a reader who's scrolled up to reread something is never
 * yanked back down.
 */
export function MessageScroller({ children, defaultPinned, onPinnedChange, conversationKey }: MessageScrollerProps) {
  const { containerRef, pinned, scrollToBottom } = useStickToBottom({ defaultPinned, onPinnedChange, conversationKey });
  const childCount = Children.count(children);
  const previousCountRef = useRef(childCount);

  useEffect(() => {
    if (childCount !== previousCountRef.current && pinned) {
      scrollToBottom();
    }
    previousCountRef.current = childCount;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childCount, pinned]);

  return (
    <div ref={containerRef} role="log" className={styles.root}>
      {children}
    </div>
  );
}
