import type { CodeToken } from "./codeTokens";
import styles from "./codeSyntax.module.css";

/** Renders a line's tokens, each styled by its kind. */
export function SyntaxTokens({ tokens }: { tokens: CodeToken[] }) {
  return (
    <>
      {tokens.map((token, i) =>
        !token.kind || token.kind === "plain" ? (
          token.className ? <span key={i} className={token.className}>{token.text}</span> : token.text
        ) : (
          <span key={i} className={[styles.token, token.className].filter(Boolean).join(" ")} data-kind={token.kind}>
            {token.text}
          </span>
        )
      )}
    </>
  );
}
