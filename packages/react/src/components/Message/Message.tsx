import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Message.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface MessageListOwnProps {}

export type MessageListProps = MessageListOwnProps & HTMLAttributes<HTMLOListElement>;

/** The conversation transcript - a real <ol>, so each turn is a numbered item a screen reader can jump between. */
export const MessageList = forwardRef<HTMLOListElement, MessageListProps>(function MessageList(
  { className, ...rest },
  ref
) {
  return <ol ref={ref} className={[styles.list, className].filter(Boolean).join(" ")} {...rest} />;
});

MessageList.displayName = "MessageList";

export type MessageAuthor = "user" | "assistant" | "system";

export interface MessageOwnProps {
  author: MessageAuthor;
  /** Shown next to the name - a real image or initials, e.g. from Avatar. */
  avatar?: ReactNode;
  name: string;
  /** A timestamp or other secondary line, e.g. "2:41 PM". */
  metadata?: string;
  /** True when this message is visually grouped with the one before it (same author, no repeated name/avatar). */
  grouped?: boolean;
  /** Marks this message as still arriving, for a live region wrapper - see MessageScroller. */
  live?: boolean;
  /** Play the mount-only enter animation. Never true when re-rendering existing history. @default false */
  animateOnMount?: boolean;
  children?: ReactNode;
}

export type MessageProps = MessageOwnProps;

/**
 * One <li> wrapping a real <article>, so screen readers can jump
 * message to message. animateOnMount is the caller's own signal for
 * "this message is genuinely new" - set it once, for the render where a
 * message first appears, and leave it alone afterward. The animation
 * itself is a single, non-looping CSS keyframe, so it plays once and
 * holds its end state; it never replays just because the transcript
 * re-renders (a token streaming into this or another message, a new
 * sibling arriving) as long as the caller isn't flipping the flag back
 * on for existing history.
 */
export function Message({ author, avatar, name, metadata, grouped = false, live = false, animateOnMount = false, children }: MessageProps) {
  return (
    <li className={styles.item}>
      <article
        className={[styles.article, animateOnMount ? styles.animateOnMount : ""].filter(Boolean).join(" ")}
        data-author={author}
        aria-live={live ? "polite" : undefined}
      >
        {!grouped ? (
          <header className={styles.header}>
            {avatar ? <span className={styles.avatar}>{avatar}</span> : null}
            <span className={styles.name}>{name}</span>
            {metadata ? <span className={styles.metadata}>{metadata}</span> : null}
          </header>
        ) : null}
        <div className={styles.body}>{children}</div>
      </article>
    </li>
  );
}

export type MessageTone = "neutral" | "accent" | "muted" | "danger";
export type MessageAlign = "start" | "center" | "end";

export interface MessageBubbleOwnProps {
  /** @default "neutral" */
  tone?: MessageTone;
  /** @default "start" */
  align?: MessageAlign;
  /** Renders as a real <details> instead of a max-height clamp, so "show more" is genuinely operable, not just visually collapsed. */
  expandable?: boolean;
  /** Shown as the <summary> when expandable. @default "Show more" */
  expandLabel?: string;
  children?: ReactNode;
}

export type MessageBubbleProps = MessageBubbleOwnProps;

export function MessageBubble({ tone = "neutral", align = "start", expandable = false, expandLabel = "Show more", children }: MessageBubbleProps) {
  if (expandable) {
    return (
      <details className={styles.bubble} data-tone={tone} data-align={align}>
        <summary className={styles.expandSummary}>{expandLabel}</summary>
        <div className={styles.bubbleContent}>{children}</div>
      </details>
    );
  }

  return (
    <div className={styles.bubble} data-tone={tone} data-align={align}>
      <div className={styles.bubbleContent}>{children}</div>
    </div>
  );
}
