import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import styles from "./TodoList.module.css";

export type TodoItemStatus = "pending" | "active" | "done" | "error";

export interface TodoListOwnProps {
  /** @default "Plan" */
  title?: string;
  /** @default false */
  defaultOpen?: boolean;
  children?: ReactNode;
}

export type TodoListProps = TodoListOwnProps;

/**
 * An agent's task plan. The completion count is derived from direct
 * TodoItem children by default - the same convenience Kernel UI's
 * version offers - since that's the common case; pass total/completed
 * explicitly if items are nested inside other wrappers where counting
 * children wouldn't see them.
 */
export function TodoList({ title = "Plan", defaultOpen = false, children }: TodoListProps) {
  const items = Children.toArray(children).filter(
    (child): child is ReactElement<TodoItemOwnProps> => isValidElement(child)
  );
  const total = items.length;
  const completed = items.filter((item) => item.props.status === "done").length;

  return (
    <details className={styles.root} open={defaultOpen}>
      <summary className={styles.summary}>
        <span>{title}</span>
        <span className={styles.count}>
          {completed} of {total} done
        </span>
      </summary>
      <ol className={styles.list}>{children}</ol>
    </details>
  );
}

const STATUS_LABEL: Record<TodoItemStatus, string> = {
  pending: "Pending",
  active: "In progress",
  done: "Done",
  error: "Error",
};

export interface TodoItemOwnProps {
  status: TodoItemStatus;
  children?: ReactNode;
  metadata?: string;
}

export type TodoItemProps = TodoItemOwnProps;

/** All four status marks render at once and cross-fade on data-status, so a status change is one attribute write. */
export function TodoItem({ status, children, metadata }: TodoItemProps) {
  return (
    <li className={styles.item} data-status={status}>
      <span className={styles.marks} aria-hidden="true">
        <span className={styles.mark} data-mark="pending" />
        <span className={styles.mark} data-mark="active" />
        <span className={styles.mark} data-mark="done" />
        <span className={styles.mark} data-mark="error" />
      </span>
      <span className={styles.label}>
        {children}
        <span className={styles.visuallyHidden}> ({STATUS_LABEL[status]})</span>
        {metadata ? <span className={styles.metadata}> {metadata}</span> : null}
      </span>
    </li>
  );
}
