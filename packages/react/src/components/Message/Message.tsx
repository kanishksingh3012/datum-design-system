import { forwardRef, useContext, type HTMLAttributes, type ReactNode } from "react";
import { MessageLogContext } from "../../lib/messageLog";
import styles from "./Message.module.css";

export type MessageListProps = HTMLAttributes<HTMLOListElement>;

/** The transcript: a real <ol>, so each turn is a list item a screen reader can jump between. */
export const MessageList = forwardRef<HTMLOListElement, MessageListProps>(function MessageList({ className, ...rest }, ref) {
  return <ol ref={ref} className={[styles.list, className].filter(Boolean).join(" ")} {...rest} />;
});

MessageList.displayName = "MessageList";

export type MessageAuthor = "user" | "assistant" | "system";

export interface MessageOwnProps {
  /** A user's turn sits in a tinted bubble at the end; an assistant's reads as plain text; system notes are centered captions. */
  author: MessageAuthor;
  /** Shown before the name, e.g. an Avatar. */
  avatar?: ReactNode;
  /** Who wrote it. Shown unless `grouped`; always given to assistive tech. */
  name: string;
  /** A timestamp or other detail beside the name, e.g. "2:41 PM". */
  metadata?: ReactNode;
  /** Follows a message by the same author: the header is hidden. @default false */
  grouped?: boolean;
  /** Still arriving: marked aria-busy (announced once, when it settles) with a caret at the end. @default false */
  streaming?: boolean;
  /** A row under the message, e.g. copy and retry buttons. Hidden while streaming. */
  actions?: ReactNode;
  /** Play the one-time enter animation. Set it only on the render where a message first appears. @default false */
  animateOnMount?: boolean;
  children?: ReactNode;
}

export type MessageProps = MessageOwnProps & Omit<HTMLAttributes<HTMLLIElement>, "children">;

/**
 * One turn: an <li> around a real <article> labelled by its author. Inside a
 * MessageScroller the log announces it; on its own, a streaming message is its
 * own polite live region. Either way it is aria-busy while tokens arrive, so it
 * is read once when complete rather than on every token.
 */
export const Message = forwardRef<HTMLLIElement, MessageProps>(function Message(
  { author, avatar, name, metadata, grouped = false, streaming = false, actions, animateOnMount = false, className, children, ...rest },
  ref
) {
  const inLog = useContext(MessageLogContext);
  return (
    <li ref={ref} className={[styles.item, className].filter(Boolean).join(" ")} data-author={author} {...rest}>
      <article
        className={styles.article}
        data-animate={animateOnMount || undefined}
        aria-label={grouped ? name : undefined}
        aria-busy={streaming || undefined}
        aria-live={!inLog && streaming ? "polite" : undefined}
      >
        {!grouped && author !== "system" ? (
          <header className={styles.header}>
            {avatar ? <span className={styles.avatar}>{avatar}</span> : null}
            <span className={styles.name}>{name}</span>
            {metadata ? <span className={styles.metadata}>{metadata}</span> : null}
          </header>
        ) : null}
        <div className={styles.body} data-streaming={streaming || undefined}>
          {children}
        </div>
        {actions && !streaming ? <div className={styles.actions}>{actions}</div> : null}
      </article>
    </li>
  );
});

Message.displayName = "Message";
