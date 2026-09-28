import { Children, forwardRef, useState, type AnchorHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Breadcrumbs.module.css";

export type BreadcrumbsSeparator = "chevron" | "slash";
export type BreadcrumbsSize = "sm" | "md";

export interface BreadcrumbsOwnProps {
  /** Drawn between items, hidden from screen readers. @default "chevron" */
  separator?: BreadcrumbsSeparator;
  /** body-sm / body-md text. @default "md" */
  size?: BreadcrumbsSize;
  /**
   * Past this many items, the middle collapses into "…": the first item and
   * the last `maxItems - 1` stay. The "…" is a button that shows them all.
   */
  maxItems?: number;
}

export type BreadcrumbsProps = BreadcrumbsOwnProps & HTMLAttributes<HTMLElement>;

const Chevron = (
  <svg viewBox="0 0 16 16" focusable="false">
    <path d="M6 3.5l4.5 4.5L6 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { separator = "chevron", size = "md", maxItems, className, children, "aria-label": ariaLabel = "Breadcrumbs", ...rest },
  ref
) {
  const [expanded, setExpanded] = useState(false);
  const items = Children.toArray(children);
  let shown: ReactNode[] = items;
  if (!expanded && maxItems && maxItems >= 2 && items.length > maxItems) {
    shown = [
      items[0],
      <li key="collapsed" className={styles.item}>
        <button
          type="button"
          className={styles.more}
          aria-label={`Show ${items.length - maxItems} more`}
          onClick={() => setExpanded(true)}
        >
          …
        </button>
      </li>,
      ...items.slice(items.length - (maxItems - 1)),
    ];
  }
  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={[styles.root, className].filter(Boolean).join(" ")}
      data-separator={separator}
      data-size={size}
      {...rest}
    >
      <ol className={styles.list}>
        {shown.flatMap((item, i) =>
          i === 0
            ? [item]
            : [
                <li key={`separator-${i}`} className={styles.separator} aria-hidden="true">
                  {separator === "chevron" ? Chevron : "/"}
                </li>,
                item,
              ]
        )}
      </ol>
    </nav>
  );
});

Breadcrumbs.displayName = "Breadcrumbs";

export interface BreadcrumbItemOwnProps {
  /** Marks this as the current page — rendered as text, not a link, with aria-current="page". */
  current?: boolean;
}

export type BreadcrumbItemProps = BreadcrumbItemOwnProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export const BreadcrumbItem = forwardRef<HTMLAnchorElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { current, className, children, ...rest },
  ref
) {
  return (
    <li className={styles.item}>
      {current ? (
        <span aria-current="page" className={styles.current}>
          {children}
        </span>
      ) : (
        <a ref={ref} className={[styles.link, className].filter(Boolean).join(" ")} {...rest}>
          {children}
        </a>
      )}
    </li>
  );
});

BreadcrumbItem.displayName = "BreadcrumbItem";
