import { forwardRef, useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { linesFromCode, linesText, type CodeLine } from "../../lib/codeTokens";
import { SyntaxTokens } from "../../lib/SyntaxTokens";
import { Button } from "../Button/Button";
import { ScrollArea } from "../ScrollArea/ScrollArea";
import styles from "./CodeBlock.module.css";

export interface CodeBlockOwnProps {
  /** Pre-tokenized lines, each token tagged with its `kind`. Use `code` for plain source. */
  lines?: CodeLine[];
  /** Plain source text, when there's no tokenizer. */
  code?: string;
  /** Shown in the header, e.g. "tsx". */
  language?: string;
  /** Shown in the header before the language, e.g. "src/index.ts". */
  title?: ReactNode;
  /** @default true */
  lineNumbers?: boolean;
  /** Show the copy button. @default true */
  copyable?: boolean;
}

export type CodeBlockProps = CodeBlockOwnProps & Omit<HTMLAttributes<HTMLElement>, "title">;

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/**
 * A figure of code: a header with the file and language and a copy button,
 * over lines that scroll sideways inside their own box. Syntax is monochrome —
 * tokens are styled by kind with weight, style and the two text colors. Line
 * numbers are aria-hidden and unselectable, so a copy is only the code. Lines
 * are keyed by index, so streamed output updates only the last line.
 */
export const CodeBlock = forwardRef<HTMLElement, CodeBlockProps>(function CodeBlock(
  { lines, code, language, title, lineNumbers = true, copyable = true, className, ...rest },
  ref
) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  const resolved = lines ?? linesFromCode(code ?? "");
  const label = [typeof title === "string" ? title : undefined, language].filter(Boolean).join(", ") || "Code";

  async function copy() {
    try {
      await navigator.clipboard?.writeText(linesText(resolved));
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <figure ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <figcaption className={styles.header}>
        <span className={styles.meta}>
          {title ? <span className={styles.title}>{title}</span> : null}
          {language ? <span className={styles.language}>{language}</span> : null}
        </span>
        {copyable ? (
          <Button intent="neutral" appearance="ghost" size="sm" prefix={copied ? <CheckIcon /> : <CopyIcon />} onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
        <span className={styles.srOnly} role="status">{copied ? "Copied to clipboard" : ""}</span>
      </figcaption>
      <ScrollArea orientation="horizontal" padding="none" label={label} className={styles.scroll}>
        <pre className={styles.pre} data-numbers={lineNumbers || undefined}>
          <code className={styles.code}>
            {resolved.map((line, i) => (
              <span key={i} className={styles.line}>
                {lineNumbers ? <span className={styles.number} aria-hidden="true">{i + 1}</span> : null}
                <span className={styles.content}>
                  <SyntaxTokens tokens={line.tokens} />
                  {"\n"}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </ScrollArea>
    </figure>
  );
});

CodeBlock.displayName = "CodeBlock";
