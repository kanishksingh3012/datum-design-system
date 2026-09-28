import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { Disclosure, type DisclosureProps } from "../../lib/Disclosure";
import styles from "./TodoList.module.css";

export type TodoItemStatus = "pending" | "active" | "done" | "error";

export interface TodoListOwnProps {
  /** @default "Plan" */
  title?: ReactNode;
  /** Whether the list is shown (controlled). */
  open?: boolean;
  /** @default true */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** TodoItem elements. */
  children?: ReactNode;
}

export type TodoListProps = TodoListOwnProps & Omit<DisclosureProps, keyof TodoListOwnProps | "icon" | "meta" | "streaming" | "live">;

/**
 * An agent's plan: a checklist behind one line that counts what's done
 * ("2 of 5 done", counted from the direct TodoItem children).
 */
export function TodoList({ title = "Plan", defaultOpen = true, children, ...rest }: TodoListProps) {
  const items = Children.toArray(children).filter((c): c is ReactElement<TodoItemOwnProps> => isValidElement(c));
  const done = items.filter((item) => item.props.status === "done").length;

  return (
    <Disclosure {...rest} defaultOpen={defaultOpen} title={title} meta={<span className={styles.count}>{done} of {items.length} done</span>}>
      <ol className={styles.list}>{children}</ol>
    </Disclosure>
  );
}

const STATUS_LABEL: Record<TodoItemStatus, string> = {
  pending: "to do",
  active: "in progress",
  done: "done",
  error: "failed",
};

const MARK: Record<TodoItemStatus, ReactNode> = {
  pending: <circle cx="12" cy="12" r="9" />,
  active: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" data-fill="" />
    </>
  ),
  done: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5 5.5-6" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6 M15 9l-6 6" />
    </>
  ),
};

export interface TodoItemOwnProps {
  /** @default "pending" */
  status?: TodoItemStatus;
  /** A second line: a file, a duration, why it failed. */
  metadata?: ReactNode;
  children?: ReactNode;
}

export type TodoItemProps = TodoItemOwnProps;

/** One task. Its state is a mark and a word for assistive tech, never color alone. */
export function TodoItem({ status = "pending", metadata, children }: TodoItemProps) {
  return (
    <li className={styles.item} data-status={status}>
      <svg className={styles.mark} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {MARK[status]}
      </svg>
      <span className={styles.text}>
        <span className={styles.label}>
          {children}
          <span className={styles.srOnly}> ({STATUS_LABEL[status]})</span>
        </span>
        {metadata ? <span className={styles.metadata}>{metadata}</span> : null}
      </span>
    </li>
  );
}
