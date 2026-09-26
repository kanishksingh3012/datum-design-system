import { forwardRef, type AnchorHTMLAttributes } from "react";
import styles from "./Link.module.css";

export type LinkUnderline = "always" | "hover" | "none";
export type LinkDecorationStyle = "solid" | "dotted" | "dashed";

export interface LinkOwnProps {
  /** @default "always" */
  underline?: LinkUnderline;
  /** Only visible when the underline is showing. @default "solid" */
  decorationStyle?: LinkDecorationStyle;
}

export type LinkProps = LinkOwnProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { underline = "always", decorationStyle = "solid", className, style, ...rest },
  ref
) {
  return (
    <a
      ref={ref}
      data-underline={underline}
      className={[styles.root, className].filter(Boolean).join(" ")}
      style={{ textDecorationStyle: decorationStyle, ...style }}
      {...rest}
    />
  );
});

Link.displayName = "Link";
