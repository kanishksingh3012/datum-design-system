export interface CodeToken {
  text: string;
  className?: string;
  color?: string;
}

export interface CodeLine {
  tokens: CodeToken[];
}

/** Turns a plain, un-highlighted source string into CodeLine[] - one un-styled token per line. */
export function linesFromCode(code: string): CodeLine[] {
  return code.split("\n").map((line) => ({ tokens: [{ text: line }] }));
}

/** Recovers the plain-text source from CodeLine[] - what a copy of the code should contain. */
export function linesText(lines: CodeLine[]): string {
  return lines.map((line) => line.tokens.map((token) => token.text).join("")).join("\n");
}
