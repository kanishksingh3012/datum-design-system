import type { ReactNode } from "react";
import { Disclosure } from "../../lib/Disclosure";
import { StatusBadge, type RunStatus } from "../../lib/aiStatus";
import { Reasoning } from "../Reasoning/Reasoning";
import { ToolCall } from "../ToolCall/ToolCall";
import styles from "./AgentActivity.module.css";

export type AgentActivityStepKind = "reasoning" | "search" | "tool" | "trace";

export interface AgentActivityItemDef {
  kind: AgentActivityStepKind;
  status: RunStatus;
  label: string;
  /** The step's detail, behind a disclosure. A step without it is a single status line. */
  children?: ReactNode;
}

export interface AgentActivityOwnProps {
  /** Names the list for assistive tech. @default "Agent activity" */
  label?: string;
  items: AgentActivityItemDef[];
}

export type AgentActivityProps = AgentActivityOwnProps;

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
const ICONS: Record<AgentActivityStepKind, ReactNode> = {
  reasoning: icon("M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"),
  search: icon("M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M21 21l-4.3-4.3"),
  tool: icon("M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8Z"),
  trace: icon("M4 6h16 M4 12h10 M4 18h13"),
};

/**
 * One chronological list of an agent's steps. Reasoning and tool steps are the
 * Reasoning and ToolCall components themselves; search and trace steps use the
 * same disclosure. A step with nothing to disclose is a plain status line.
 */
export function AgentActivity({ label = "Agent activity", items }: AgentActivityProps) {
  return (
    <ol aria-label={label} className={styles.root}>
      {items.map((item, index) => (
        <li key={index} className={styles.item}>
          <Step {...item} />
        </li>
      ))}
    </ol>
  );
}

function Step({ kind, status, label, children }: AgentActivityItemDef) {
  if (children === undefined || children === null) {
    return (
      <div className={styles.line} data-status={status}>
        <span className={styles.icon}>{ICONS[kind]}</span>
        <span className={styles.label}>{label}</span>
        <StatusBadge status={status} />
      </div>
    );
  }
  if (kind === "reasoning") {
    return (
      <Reasoning title={label} streamingTitle={label} streaming={status === "running"}>
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
    <Disclosure title={label} icon={ICONS[kind]} meta={<StatusBadge status={status} />}>
      {children}
    </Disclosure>
  );
}
