import type { ReactNode } from "react";
import styles from "./ToolCall.module.css";

export type ToolCallStatus = "pending" | "running" | "complete" | "error";

export interface ToolCallOwnProps {
  /** The tool's name, e.g. "search_web" or "read_file". */
  name: string;
  status: ToolCallStatus;
  /** @default false */
  defaultOpen?: boolean;
  children?: ReactNode;
}

export type ToolCallProps = ToolCallOwnProps;

const STATUS_LABEL: Record<ToolCallStatus, string> = {
  pending: "Pending",
  running: "Running",
  complete: "Complete",
  error: "Error",
};

/**
 * Collapsible agent tool status - every status carries real visible text
 * (STATUS_LABEL), not just a colored dot, so color is never the only
 * signal (WCAG 1.4.1).
 */
export function ToolCall({ name, status, defaultOpen = false, children }: ToolCallProps) {
  return (
    <details className={styles.root} open={defaultOpen}>
      <summary className={styles.summary}>
        <span className={styles.name}>{name}</span>
        <span className={styles.status} data-status={status}>
          {STATUS_LABEL[status]}
        </span>
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
