import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes } from "react";
import styles from "./Sources.module.css";

export interface SourcesOwnProps {
  /** @default "Sources" */
  title?: string;
}

export type SourcesProps = SourcesOwnProps & Omit<HTMLAttributes<HTMLElement>, "title">;

/** Cited sources for a grounded answer - a real <section> with an accessible heading, wrapping a real <ul>. */
export const Sources = forwardRef<HTMLElement, SourcesProps>(function Sources(
  { title = "Sources", className, children, ...rest },
  ref
) {
  return (
    <section ref={ref} aria-label={title} className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <h3 className={styles.heading}>{title}</h3>
      <ul className={styles.list}>{children}</ul>
    </section>
  );
});

Sources.displayName = "Sources";

export interface SourceOwnProps {
  /** The number shown before the title - matches the inline Citation pointing at it. */
  number: number;
  title: string;
}

export type SourceProps = SourceOwnProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">;

export const Source = forwardRef<HTMLAnchorElement, SourceProps>(function Source(
  { number, title, className, ...rest },
  ref
) {
  return (
    <li className={styles.item}>
      <a ref={ref} className={[styles.link, className].filter(Boolean).join(" ")} {...rest}>
        <span className={styles.number} aria-hidden="true">
          {number}
        </span>
        {title}
      </a>
    </li>
  );
});

Source.displayName = "Source";

export interface CitationOwnProps {
  number: number;
  href: string;
}

export type CitationProps = CitationOwnProps;

/** An inline numbered citation chip, e.g. "...as shown in the docs[1]." */
export function Citation({ number, href }: CitationProps) {
  return (
    <a href={href} className={styles.citation} aria-label={`Source ${number}`}>
      {number}
    </a>
  );
}
