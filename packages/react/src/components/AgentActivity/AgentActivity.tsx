import type { ReactNode } from "react";
import { Reasoning } from "../Reasoning/Reasoning";
import { ToolCall, type ToolCallStatus } from "../ToolCall/ToolCall";
import styles from "./AgentActivity.module.css";

export type AgentActivityStepKind = "reasoning" | "search" | "tool" | "trace";

export interface AgentActivityItemDef {
  kind: AgentActivityStepKind;
  status: ToolCallStatus;
  label: string;
  children?: ReactNode;
}

export interface AgentActivityOwnProps {
  /** @default "Agent activity" */
  label?: string;
  items: AgentActivityItemDef[];
}

export type AgentActivityProps = AgentActivityOwnProps;

const STATUS_LABEL: Record<ToolCallStatus, string> = {
  pending: "Pending",
  running: "Running",
  complete: "Complete",
  error: "Error",
};

/**
 * One chronological stream of reasoning, searches, tool calls, and
 * traces. Reasoning and tool steps delegate their body to the existing
 * Reasoning and ToolCall components rather than reimplementing
 * disclosure and status behavior, so those two stay the single source
 * of truth for that behavior and stay usable standalone. Search and
 * trace steps get their own plain disclosure. A step with no children is
 * just a status line - there's nothing to disclose.
 */
export function AgentActivity({ label = "Agent activity", items }: AgentActivityProps) {
  return (
    <ol aria-label={label} className={styles.root}>
      {items.map((item, index) => (
        <li key={index}>
          <AgentActivityItem {...item} />
        </li>
      ))}
    </ol>
  );
}

function AgentActivityItem({ kind, status, label, children }: AgentActivityItemDef) {
  if (!children) {
    return (
      <div className={styles.plainStep}>
        <span>{label}</span>
        <span className={styles.status} data-status={status}>
          {STATUS_LABEL[status]}
        </span>
      </div>
    );
  }

  if (kind === "reasoning") {
    return (
      <Reasoning title={label} streaming={status === "running"}>
        {children}
      </Reasoning>
    );
  }

  if (kind === "tool") {
    return (
      <ToolCall name={label} status={status}>
        {children}
      </ToolCall>
    );
  }

  return (
    <details className={styles.step}>
      <summary className={styles.summary}>
        <span>{label}</span>
        <span className={styles.status} data-status={status}>
          {STATUS_LABEL[status]}
        </span>
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
