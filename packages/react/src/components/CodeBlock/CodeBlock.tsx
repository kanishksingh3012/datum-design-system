import { useState } from "react";
import { linesFromCode, linesText, type CodeLine } from "../../lib/codeTokens";
import styles from "./CodeBlock.module.css";

export interface CodeBlockOwnProps {
  /** Pre-tokenized lines from a highlighter (Shiki, Prism, your own). Use `code` instead for plain, un-highlighted source. */
  lines?: CodeLine[];
  /** Plain source text - an alternative to `lines` when there's no highlighter available. */
  code?: string;
  /** Shown in the figure's caption, e.g. "typescript" or "src/index.ts". */
  language?: string;
}

export type CodeBlockProps = CodeBlockOwnProps;

/**
 * Highlights nothing itself - pass pre-tokenised lines from a real
 * highlighter, or a plain string. Lines are keyed by index, so appending
 * streamed output updates only the last line instead of remounting the
 * ones above it (no flicker, no lost text selection). Line numbers are
 * aria-hidden and unselectable so a copy contains code, never the gutter.
 */
export function CodeBlock({ lines, code, language }: CodeBlockOwnProps) {
  const [copied, setCopied] = useState(false);
  const resolvedLines = lines ?? linesFromCode(code ?? "");

  async function handleCopy() {
    const text = linesText(resolvedLines);
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <figure className={styles.root}>
      <figcaption className={styles.caption}>
        <span>{language}</span>
        <button type="button" className={styles.copy} onClick={handleCopy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className={styles.pre}>
        <code className={styles.code}>
          {resolvedLines.map((line, index) => (
            <span key={index} className={styles.line}>
              <span className={styles.lineNumber} aria-hidden="true">
                {index + 1}
              </span>
              <span className={styles.lineContent}>
                {line.tokens.map((token, tokenIndex) => (
                  <span
                    key={tokenIndex}
                    className={token.className}
                    style={token.color ? { color: token.color } : undefined}
                  >
                    {token.text}
                  </span>
                ))}
              </span>
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
