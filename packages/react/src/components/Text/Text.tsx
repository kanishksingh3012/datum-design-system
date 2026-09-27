import { createElement, forwardRef, type CSSProperties, type HTMLAttributes } from "react";
import styles from "./Text.module.css";

export type TextVariant =
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "paragraph-lg"
  | "paragraph-md"
  | "label"
  | "caption"
  | "overline"
  | "numeric-lg"
  | "numeric-md"
  | "numeric-sm"
  | "code";
export type TextTone = "primary" | "secondary" | "tertiary" | "accent" | "danger" | "success" | "warning";
export type TextWeight = "regular" | "medium" | "semibold";
export type TextElement = "p" | "span" | "div" | "label";

export interface TextOwnProps {
  /** The type role, picked by purpose. Numeric variants use tabular figures. @default "body-md" */
  variant?: TextVariant;
  /** @default "primary" */
  tone?: TextTone;
  /** Overrides the role's weight. Use only when the role's own weight doesn't fit. */
  weight?: TextWeight;
  /** `true` ends one line with an ellipsis; a number clamps to that many lines. @default false */
  truncate?: boolean | number;
  /** @default "p" */
  as?: TextElement;
  /** Passed through when `as="label"`. */
  htmlFor?: string;
}

export type TextProps = TextOwnProps & HTMLAttributes<HTMLElement>;

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = "body-md", tone = "primary", weight, truncate = false, as: Element = "p", className, style, ...rest },
  ref
) {
  const lines = typeof truncate === "number" && truncate > 1 ? truncate : undefined;
  return createElement(Element, {
    ref,
    "data-variant": variant,
    "data-tone": tone,
    "data-weight": weight,
    "data-truncate": lines ? "lines" : truncate ? "line" : undefined,
    className: [styles.root, className].filter(Boolean).join(" "),
    style: lines ? ({ "--_lines": lines, ...style } as CSSProperties) : style,
    ...rest,
  });
});

Text.displayName = "Text";
