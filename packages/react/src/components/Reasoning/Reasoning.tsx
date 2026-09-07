import { useEffect, useRef, type ReactNode } from "react";
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

const COLLAPSE_DELAY_MS = 600;

/**
 * A collapsible <details>/<summary> disclosure that auto-opens while
 * streaming and settles closed shortly after streaming ends - but only
 * on that edge, and only if the reader hasn't manually opened or closed
 * it themselves in the meantime. A manual toggle is never silently
 * overridden by the auto-collapse timer.
 */
export function Reasoning({ title = "Reasoning", streaming = false, collapseOnComplete = true, children }: ReasoningProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const userToggledRef = useRef(false);
  const programmaticRef = useRef(false);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;
    function handleToggle() {
      if (programmaticRef.current) {
        programmaticRef.current = false;
        return;
      }
      userToggledRef.current = true;
    }
    details.addEventListener("toggle", handleToggle);
    return () => details.removeEventListener("toggle", handleToggle);
  }, []);

  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;

    if (streaming) {
      userToggledRef.current = false;
      if (!details.open) {
        programmaticRef.current = true;
        details.open = true;
      }
      return;
    }

    if (!collapseOnComplete) return;
    const timer = setTimeout(() => {
      if (!userToggledRef.current && details.open) {
        programmaticRef.current = true;
        details.open = false;
      }
    }, COLLAPSE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [streaming, collapseOnComplete]);

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
