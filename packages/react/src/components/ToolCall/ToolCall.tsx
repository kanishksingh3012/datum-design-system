import type { ReactNode } from "react";
import { Disclosure, type DisclosureProps } from "../../lib/Disclosure";
import { StatusBadge, type RunStatus } from "../../lib/aiStatus";
import styles from "./ToolCall.module.css";

export type ToolCallStatus = RunStatus;

export interface ToolCallOwnProps {
  /** The tool's name, e.g. "search_web". Set in code type. */
  name: string;
  /** @default "pending" */
  status?: ToolCallStatus;
  /** What the tool was called with, shown as code. */
  input?: ReactNode;
  /** What it returned, shown as code. */
  output?: ReactNode;
  /** Why it failed; shown with `status="error"`. */
  error?: ReactNode;
  /** Whether the details are shown (controlled). */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Anything else to show in the panel. */
  children?: ReactNode;
}

export type ToolCallProps = ToolCallOwnProps & Omit<DisclosureProps, keyof ToolCallOwnProps | "title" | "icon" | "meta" | "streaming" | "live">;

const WrenchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8Z" />
  </svg>
);

/**
 * One tool call an agent made: its name and a status badge on one line, the
 * input, output or error behind it. The status is a word as well as a color.
 */
export function ToolCall({ name, status = "pending", input, output, error, children, ...rest }: ToolCallProps) {
  return (
    <Disclosure {...rest} data-status={status} title={<span className={styles.name}>{name}</span>} icon={<WrenchIcon />} meta={<StatusBadge status={status} />}>
      <div className={styles.sections}>
        {input !== undefined ? (
          <section>
            <div className={styles.label}>Input</div>
            <pre className={styles.code}>{input}</pre>
          </section>
        ) : null}
        {output !== undefined && status !== "error" ? (
          <section>
            <div className={styles.label}>Output</div>
            <pre className={styles.code}>{output}</pre>
          </section>
        ) : null}
        {error !== undefined && status === "error" ? (
          <section>
            <div className={styles.label}>Error</div>
            <pre className={styles.code} data-error="">{error}</pre>
          </section>
        ) : null}
        {children}
      </div>
    </Disclosure>
  );
}
