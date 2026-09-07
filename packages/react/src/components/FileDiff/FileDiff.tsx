import type { CodeToken } from "../../lib/codeTokens";
import { useAutoCollapse } from "../../lib/useAutoCollapse";
import styles from "./FileDiff.module.css";

export type DiffRowKind = "add" | "remove" | "context" | "hunk";

export interface DiffRow {
  kind: DiffRowKind;
  oldLine?: number;
  newLine?: number;
  content?: string;
  tokens?: CodeToken[];
}

export interface FileDiffOwnProps {
  path: string;
  rows: DiffRow[];
  /** True while rows are still arriving - holds the disclosure open. */
  streaming?: boolean;
  /** Settle closed ~600ms after streaming ends, unless manually toggled. @default true */
  collapseOnComplete?: boolean;
}

export type FileDiffProps = FileDiffOwnProps;

const MARKER: Record<DiffRowKind, string> = {
  add: "+",
  remove: "-",
  context: " ",
  hunk: "@@",
};

/**
 * A diff is tabular data, so it's a real <table> with line numbers in
 * their own cells - copying a diff copies the code, not the gutter. The
 * +/- marker is real text (MARKER), never color alone. Shares
 * useAutoCollapse with Reasoning: stays open while streaming, settles
 * closed ~600ms after, never overriding a manual toggle.
 */
export function FileDiff({ path, rows, streaming = false, collapseOnComplete = true }: FileDiffOwnProps) {
  const detailsRef = useAutoCollapse(streaming, collapseOnComplete);
  const added = rows.filter((row) => row.kind === "add").length;
  const removed = rows.filter((row) => row.kind === "remove").length;

  return (
    <details ref={detailsRef} className={styles.root}>
      <summary className={styles.summary}>
        <span className={styles.path}>{path}</span>
        <span className={styles.counts}>
          <span className={styles.added}>+{added}</span>
          <span className={styles.removed}>-{removed}</span>
        </span>
      </summary>
      <table className={styles.table}>
        <caption className={styles.caption}>Changes to {path}</caption>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={styles.row} data-kind={row.kind}>
              <td className={styles.lineNumber}>{row.oldLine ?? ""}</td>
              <td className={styles.lineNumber}>{row.newLine ?? ""}</td>
              <td className={styles.marker}>{MARKER[row.kind]}</td>
              <td className={styles.content}>
                {row.tokens
                  ? row.tokens.map((token, tokenIndex) => (
                      <span key={tokenIndex} style={token.color ? { color: token.color } : undefined}>
                        {token.text}
                      </span>
                    ))
                  : row.content}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}
