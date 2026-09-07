import { forwardRef, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from "react";
import styles from "./Table.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TableOwnProps {}

export type TableProps = TableOwnProps & HTMLAttributes<HTMLTableElement>;

export const Table = forwardRef<HTMLTableElement, TableProps>(function Table({ className, ...rest }, ref) {
  return <table ref={ref} className={[styles.root, className].filter(Boolean).join(" ")} {...rest} />;
});
Table.displayName = "Table";

export const TableCaption = forwardRef<HTMLTableCaptionElement, HTMLAttributes<HTMLTableCaptionElement>>(
  function TableCaption({ className, ...rest }, ref) {
    return <caption ref={ref} className={[styles.caption, className].filter(Boolean).join(" ")} {...rest} />;
  }
);
TableCaption.displayName = "TableCaption";

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableHeader({ className, ...rest }, ref) {
    return <thead ref={ref} className={className} {...rest} />;
  }
);
TableHeader.displayName = "TableHeader";

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  function TableBody({ className, ...rest }, ref) {
    return <tbody ref={ref} className={className} {...rest} />;
  }
);
TableBody.displayName = "TableBody";

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(function TableRow(
  { className, ...rest },
  ref
) {
  return <tr ref={ref} className={[styles.row, className].filter(Boolean).join(" ")} {...rest} />;
});
TableRow.displayName = "TableRow";

export type TableSortDirection = "ascending" | "descending" | "none";

export interface TableHeadOwnProps {
  /** Omit for a non-sortable column. When set, renders a real <button> inside the <th>. */
  sortDirection?: TableSortDirection;
  onSort?: () => void;
}

export type TableHeadProps = TableHeadOwnProps & Omit<ThHTMLAttributes<HTMLTableCellElement>, "onSort">;

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { sortDirection, onSort, className, children, scope = "col", ...rest },
  ref
) {
  return (
    <th
      ref={ref}
      scope={scope}
      aria-sort={sortDirection}
      className={[styles.head, className].filter(Boolean).join(" ")}
      {...rest}
    >
      {onSort ? (
        <button type="button" className={styles.sortButton} onClick={onSort}>
          {children}
          <span className={styles.sortIndicator} aria-hidden="true">
            {sortDirection === "ascending" ? "↑" : sortDirection === "descending" ? "↓" : ""}
          </span>
        </button>
      ) : (
        children
      )}
    </th>
  );
});
TableHead.displayName = "TableHead";

export const TableCell = forwardRef<HTMLTableCellElement, TdHTMLAttributes<HTMLTableCellElement>>(function TableCell(
  { className, ...rest },
  ref
) {
  return <td ref={ref} className={[styles.cell, className].filter(Boolean).join(" ")} {...rest} />;
});
TableCell.displayName = "TableCell";
