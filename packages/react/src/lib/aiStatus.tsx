import { Badge, type BadgeIntent } from "../components/Badge/Badge";
import styles from "./aiStatus.module.css";

/** Where a tool call or agent step stands. */
export type RunStatus = "pending" | "running" | "success" | "error";

const LABEL: Record<RunStatus, string> = { pending: "Pending", running: "Running", success: "Done", error: "Failed" };
const INTENT: Record<RunStatus, BadgeIntent> = { pending: "neutral", running: "accent", success: "success", error: "danger" };

/**
 * A run's status as a soft Badge. The word is always there, so color is never
 * the only signal (WCAG 1.4.1); `running` adds a small turning ring.
 */
export function StatusBadge({ status, label }: { status: RunStatus; label?: string }) {
  return (
    <Badge intent={INTENT[status]} appearance="soft" size="sm" data-status={status}>
      {status === "running" ? <span className={styles.ring} aria-hidden="true" /> : null}
      {label ?? LABEL[status]}
    </Badge>
  );
}
