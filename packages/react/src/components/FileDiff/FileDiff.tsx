import type { ReactNode } from "react";
import type { CodeToken } from "../../lib/codeTokens";
import { SyntaxTokens } from "../../lib/SyntaxTokens";
import { Disclosure, type DisclosureProps } from "../../lib/Disclosure";
import { ScrollArea } from "../ScrollArea/ScrollArea";
import styles from "./FileDiff.module.css";

export type DiffRowKind = "add" | "remove" | "context" | "hunk";

export interface DiffRow {
  kind: DiffRowKind;
  oldLine?: number;
  newLine?: number;
  /** Plain text of the line. */
  content?: string;
  /** Or tokens tagged by kind, styled like CodeBlock's. */
  tokens?: CodeToken[];
}

export interface FileDiffOwnProps {
  path: string;
  rows: DiffRow[];
  /** Rows still arriving: the diff is held open. @default false */
  streaming?: boolean;
  /** Settle closed shortly after streaming ends, unless the reader toggled it. @default true */
  collapseOnComplete?: boolean;
  /** Whether the diff is shown (controlled). */
  open?: boolean;
  /** @default false */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type FileDiffProps = FileDiffOwnProps & Omit<DisclosureProps, keyof FileDiffOwnProps | "title" | "icon" | "meta" | "live" | "children">;

const MARKER: Record<DiffRowKind, string> = { add: "+", remove: "−", context: "", hunk: "" };
const SPOKEN: Partial<Record<DiffRowKind, string>> = { add: "Added", remove: "Removed" };

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z M14 2v6h6" />
  </svg>
);

/**
 * A file's changes as a real table: old and new line numbers in their own
 * cells, a +/− marker that is real text (and spoken as "Added"/"Removed"),
 * added and removed lines on the success and danger subtle fills. Wide lines
 * scroll sideways inside the card, never the page.
 */
export function FileDiff({ path, rows, ...rest }: FileDiffProps) {
  const added = rows.filter((r) => r.kind === "add").length;
  const removed = rows.filter((r) => r.kind === "remove").length;
  const meta: ReactNode = (
    <span className={styles.counts}>
      <span data-kind="add" aria-label={`${added} added`}>+{added}</span>
      <span data-kind="remove" aria-label={`${removed} removed`}>−{removed}</span>
    </span>
  );

  return (
    <Disclosure {...rest} title={<span className={styles.path}>{path}</span>} icon={<FileIcon />} meta={meta}>
      <ScrollArea orientation="horizontal" padding="none" label={`Changes to ${path}`} className={styles.scroll}>
        <table className={styles.table}>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={styles.row} data-kind={row.kind}>
                {row.kind === "hunk" ? (
                  <td colSpan={4} className={styles.hunk}>{row.content}</td>
                ) : (
                  <>
                    <td className={styles.number} aria-label={row.oldLine ? `Old line ${row.oldLine}` : undefined}>{row.oldLine ?? ""}</td>
                    <td className={styles.number} aria-label={row.newLine ? `New line ${row.newLine}` : undefined}>{row.newLine ?? ""}</td>
                    <td className={styles.marker}>
                      <span aria-hidden="true">{MARKER[row.kind]}</span>
                      {SPOKEN[row.kind] ? <span className={styles.srOnly}>{SPOKEN[row.kind]}</span> : null}
                    </td>
                    <td className={styles.content}>{row.tokens ? <SyntaxTokens tokens={row.tokens} /> : row.content}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </Disclosure>
  );
}
