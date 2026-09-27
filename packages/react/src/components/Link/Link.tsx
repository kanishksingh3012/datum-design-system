import { forwardRef, type AnchorHTMLAttributes } from "react";
import styles from "./Link.module.css";

export type LinkTone = "accent" | "neutral" | "inherit";
export type LinkUnderline = "always" | "hover" | "none";
export type LinkSize = "inherit" | "sm" | "md";

export interface LinkOwnProps {
  /** `inherit` takes the color of the surrounding text. @default "accent" */
  tone?: LinkTone;
  /**
   * Links inside running text keep `always`, so they aren't told apart by
   * color alone. `hover` and `none` are for standalone links (nav, footers,
   * cards). @default "always"
   */
  underline?: LinkUnderline;
  /**
   * Opens in a new tab with `rel="noopener noreferrer"`, adds an arrow icon
   * and tells screen readers it opens a new tab. @default false
   */
  external?: boolean;
  /** `inherit` matches the surrounding text. @default "inherit" */
  size?: LinkSize;
}

export type LinkProps = LinkOwnProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { tone = "accent", underline = "always", external = false, size = "inherit", className, children, ...rest },
  ref
) {
  return (
    <a
      ref={ref}
      data-tone={tone}
      data-underline={underline}
      data-size={size}
      data-external={external || undefined}
      className={[styles.root, className].filter(Boolean).join(" ")}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      {...rest}
    >
      {children}
      {external && (
        <>
          <svg className={styles.icon} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M6 3.5h6.5V10M12.5 3.5 4 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.srOnly}> (opens in a new tab)</span>
        </>
      )}
    </a>
  );
});

Link.displayName = "Link";
