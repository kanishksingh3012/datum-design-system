import type { ReactNode } from "react";
import { Disclosure, type DisclosureProps } from "../../lib/Disclosure";
import styles from "./Reasoning.module.css";

export interface ReasoningOwnProps {
  /** The trigger's label once reasoning is done, e.g. "Thought for 12 seconds". @default "Reasoning" */
  title?: ReactNode;
  /** The trigger's label while streaming. @default "Thinking…" */
  streamingTitle?: ReactNode;
  /** The trace is still arriving: held open, announced politely once it settles. @default false */
  streaming?: boolean;
  /** Settle closed shortly after streaming ends, unless the reader toggled it. @default true */
  collapseOnComplete?: boolean;
  /** Whether the trace is shown (controlled). */
  open?: boolean;
  /** Whether the trace starts shown (uncontrolled). @default false */
  defaultOpen?: boolean;
  /** Called with the new open state. */
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export type ReasoningProps = ReasoningOwnProps & Omit<DisclosureProps, keyof ReasoningOwnProps | "icon" | "meta" | "live">;

const BrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18h6 M10 22h4 M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
  </svg>
);

/**
 * A model's reasoning trace, collapsed behind one line. It opens while the
 * trace streams and settles closed shortly after — never overriding a reader
 * who opened or closed it by hand. The trace is a polite live region, busy
 * while streaming, so it is read once when it settles rather than per token.
 */
export function Reasoning({ title = "Reasoning", streamingTitle = "Thinking…", streaming = false, children, ...rest }: ReasoningProps) {
  return (
    <Disclosure {...rest} title={streaming ? streamingTitle : title} icon={<BrainIcon />} streaming={streaming} live>
      <div className={styles.trace}>{children}</div>
    </Disclosure>
  );
}
