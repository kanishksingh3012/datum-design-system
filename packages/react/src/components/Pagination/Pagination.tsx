import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import styles from "./Pagination.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PaginationOwnProps {}

export type PaginationProps = PaginationOwnProps & Omit<HTMLAttributes<HTMLElement>, "aria-label">;

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { className, children, ...rest },
  ref
) {
  return (
    <nav ref={ref} aria-label="pagination" className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      <ol className={styles.list}>{children}</ol>
    </nav>
  );
});

Pagination.displayName = "Pagination";

export interface PaginationItemOwnProps {
  current?: boolean;
}

export type PaginationItemProps = PaginationItemOwnProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const PaginationItem = forwardRef<HTMLButtonElement, PaginationItemProps>(function PaginationItem(
  { current, className, type = "button", ...rest },
  ref
) {
  return (
    <li>
      <button
        ref={ref}
        type={type}
        aria-current={current ? "page" : undefined}
        data-current={current || undefined}
        className={[styles.item, className].filter(Boolean).join(" ")}
        {...rest}
      />
    </li>
  );
});

PaginationItem.displayName = "PaginationItem";

export const PaginationPrevious = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function PaginationPrevious({ className, type = "button", children = "Previous", ...rest }, ref) {
    return (
      <li>
        <button ref={ref} type={type} className={[styles.step, className].filter(Boolean).join(" ")} {...rest}>
          {children}
        </button>
      </li>
    );
  }
);
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function PaginationNext({ className, type = "button", children = "Next", ...rest }, ref) {
    return (
      <li>
        <button ref={ref} type={type} className={[styles.step, className].filter(Boolean).join(" ")} {...rest}>
          {children}
        </button>
      </li>
    );
  }
);
PaginationNext.displayName = "PaginationNext";

export function PaginationEllipsis() {
  return (
    <li aria-hidden="true" className={styles.ellipsis}>
      &hellip;
    </li>
  );
}
PaginationEllipsis.displayName = "PaginationEllipsis";
