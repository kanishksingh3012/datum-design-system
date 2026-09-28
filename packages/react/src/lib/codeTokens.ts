/**
 * What a token is, not what color it is: CodeBlock and FileDiff style each kind
 * with type roles and the two text colors (monochrome syntax), so highlighting
 * holds in every theme and mode without a palette of its own.
 */
export type CodeTokenKind = "plain" | "keyword" | "string" | "number" | "comment" | "function" | "punctuation";

export interface CodeToken {
  text: string;
  /** @default "plain" */
  kind?: CodeTokenKind;
  className?: string;
}

export interface CodeLine {
  tokens: CodeToken[];
}

/** Turns a plain, un-highlighted source string into CodeLine[] - one plain token per line. */
export function linesFromCode(code: string): CodeLine[] {
  return code.split("\n").map((line) => ({ tokens: [{ text: line }] }));
}

/** Recovers the plain-text source from CodeLine[] - what a copy of the code should contain. */
export function linesText(lines: CodeLine[]): string {
  return lines.map((line) => line.tokens.map((token) => token.text).join("")).join("\n");
}
