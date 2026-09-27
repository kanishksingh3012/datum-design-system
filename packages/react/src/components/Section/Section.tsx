import { createElement, forwardRef, type HTMLAttributes } from "react";
import styles from "./Section.module.css";

export type SectionSpacing = "sm" | "md" | "lg";
export type SectionTone = "default" | "muted" | "accent";
export type SectionElement = "section" | "div" | "header" | "footer";

export interface SectionOwnProps {
  /** Vertical padding: 32 / 64 / 96px. @default "md" */
  spacing?: SectionSpacing;
  /** Background: `bg.page`, `bg.surface` or `bg.accentSubtle`. @default "default" */
  tone?: SectionTone;
  /** @default "section" */
  as?: SectionElement;
}

export type SectionProps = SectionOwnProps & HTMLAttributes<HTMLElement>;

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { spacing = "md", tone = "default", as: Element = "section", className, ...rest },
  ref
) {
  return createElement(Element, {
    ref,
    "data-spacing": spacing,
    "data-tone": tone,
    className: [styles.root, className].filter(Boolean).join(" "),
    ...rest,
  });
});

Section.displayName = "Section";
