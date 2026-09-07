import { forwardRef, type AnchorHTMLAttributes, type HTMLAttributes } from "react";
import styles from "./Breadcrumbs.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BreadcrumbsOwnProps {}

export type BreadcrumbsProps = BreadcrumbsOwnProps & Omit<HTMLAttributes<HTMLElement>, "aria-label">;

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { className, children, ...rest },
  ref
) {
  return (
    <nav ref={ref} aria-label="breadcrumb" className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <ol className={styles.list}>{children}</ol>
    </nav>
  );
});

Breadcrumbs.displayName = "Breadcrumbs";

export interface BreadcrumbItemOwnProps {
  /** Marks this as the current page - rendered as text, not a link, with aria-current="page". */
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
