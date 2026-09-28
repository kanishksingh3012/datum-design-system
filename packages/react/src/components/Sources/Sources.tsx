import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Sources.module.css";

export interface SourcesOwnProps {
  /** @default "Sources" */
  title?: string;
  /** Level of the title's heading, to fit the page outline. @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

export type SourcesProps = SourcesOwnProps & Omit<HTMLAttributes<HTMLElement>, "title">;

/** The sources behind a grounded answer: a titled section around a list of Source links. */
export const Sources = forwardRef<HTMLElement, SourcesProps>(function Sources(
  { title = "Sources", headingLevel = 3, className, children, ...rest },
  ref
) {
  const Heading = `h${headingLevel}` as const;
  return (
    <section ref={ref} aria-label={title} className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <Heading className={styles.heading}>{title}</Heading>
      <ol className={styles.list}>{children}</ol>
    </section>
  );
});

Sources.displayName = "Sources";

export interface SourceOwnProps {
  /** Matches the Citation that points at it. */
  number: number;
  title: ReactNode;
  /** A second line: the site, a snippet. */
  description?: ReactNode;
}

export type SourceProps = SourceOwnProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "title">;

/** One source: a link row with its number, title and optional second line. */
export const Source = forwardRef<HTMLAnchorElement, SourceProps>(function Source(
  { number, title, description, className, ...rest },
  ref
) {
  return (
    <li id={`source-${number}`} className={styles.item}>
      <a ref={ref} className={[styles.link, className].filter(Boolean).join(" ")} data-lines={description ? 2 : 1} {...rest}>
        <span className={styles.number} aria-hidden="true">{number}</span>
        <span className={styles.text}>
          <span className={styles.title}>{title}</span>
          {description ? <span className={styles.description}>{description}</span> : null}
        </span>
      </a>
    </li>
  );
});

Source.displayName = "Source";

export interface CitationOwnProps {
  number: number;
  /** Where it points: the source itself, or its row (`#source-1`). */
  href: string;
}

export type CitationProps = CitationOwnProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">;

/** An inline numbered citation, e.g. "…as the docs say[1]." Its hit area grows to 44px on touch. */
export const Citation = forwardRef<HTMLAnchorElement, CitationProps>(function Citation(
  { number, href, className, ...rest },
  ref
) {
  return (
    <a ref={ref} href={href} className={[styles.citation, className].filter(Boolean).join(" ")} aria-label={`Source ${number}`} {...rest}>
      {number}
    </a>
  );
});

Citation.displayName = "Citation";
