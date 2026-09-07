import type { ReactNode } from "react";
import { useAutoCollapse } from "../../lib/useAutoCollapse";
import styles from "./Reasoning.module.css";

export interface ReasoningOwnProps {
  /** @default "Reasoning" */
  title?: string;
  /** While true, the trace is held open regardless of prior manual toggles. */
  streaming?: boolean;
  /** Settle closed ~600ms after streaming ends, unless the user has manually toggled it. @default true */
  collapseOnComplete?: boolean;
  children?: ReactNode;
}

export type ReasoningProps = ReasoningOwnProps;

/**
 * A collapsible <details>/<summary> disclosure that auto-opens while
 * streaming and settles closed shortly after streaming ends - but only
 * on that edge, and only if the reader hasn't manually opened or closed
 * it themselves in the meantime. A manual toggle is never silently
 * overridden by the auto-collapse timer (see src/lib/useAutoCollapse.ts,
 * shared with FileDiff).
 */
export function Reasoning({ title = "Reasoning", streaming = false, collapseOnComplete = true, children }: ReasoningProps) {
  const detailsRef = useAutoCollapse(streaming, collapseOnComplete);

  return (
    <details ref={detailsRef} className={styles.root}>
      <summary className={styles.summary}>
        {title}
        {streaming ? (
          <span className={styles.liveDot} role="status" aria-label="Still reasoning">
            <span aria-hidden="true" />
          </span>
        ) : null}
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
