import { useId, useMemo, useState } from "react";
import { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../Table/Table";
import { Pagination, PaginationItem, PaginationPrevious, PaginationNext } from "../Pagination/Pagination";
import styles from "./DataTable.module.css";

export interface DataTableColumn<Row> {
  key: string;
  label: string;
  accessor: (row: Row) => string;
  sortable?: boolean;
}

export interface DataTableOwnProps<Row> {
  caption: string;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  /** Rows per page. Omit to disable pagination. */
  pageSize?: number;
}

export type DataTableProps<Row> = DataTableOwnProps<Row>;

/**
 * Layers sort/filter/paginate behavior on top of Table - which stays a
 * real role=table throughout, since none of this interaction (sorting a
 * column, filtering rows, paging through them) is the kind of 2D
 * cell-to-cell navigation that would call for role=grid.
 */
export function DataTable<Row>({ caption, columns, rows, rowKey, pageSize }: DataTableProps<Row>) {
  const filterId = useId();
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAscending, setSortAscending] = useState(true);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!filter.trim()) return rows;
    const needle = filter.trim().toLowerCase();
    return rows.filter((row) => columns.some((column) => column.accessor(row).toLowerCase().includes(needle)));
  }, [rows, columns, filter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const column = columns.find((candidate) => candidate.key === sortKey);
    if (!column) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const result = column.accessor(a).localeCompare(column.accessor(b));
      return sortAscending ? result : -result;
    });
    return copy;
  }, [filtered, columns, sortKey, sortAscending]);

  const totalPages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const currentPage = Math.min(page, totalPages);
  const pageRows = pageSize ? sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize) : sorted;

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortAscending((value) => !value);
    } else {
      setSortKey(key);
      setSortAscending(true);
    }
    setPage(1);
  }

  return (
    <div className={styles.root}>
      <div className={styles.toolbar}>
        <label className={styles.filterLabel} htmlFor={filterId}>
          Filter {caption}
        </label>
        <input
          id={filterId}
          type="text"
          className={styles.filterInput}
          value={filter}
          onChange={(event) => {
            setFilter(event.currentTarget.value);
            setPage(1);
          }}
        />
      </div>
      <Table>
        <TableCaption>{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            {columns.map((column) =>
              column.sortable ? (
                <TableHead
                  key={column.key}
                  sortDirection={sortKey === column.key ? (sortAscending ? "ascending" : "descending") : "none"}
                  onSort={() => toggleSort(column.key)}
                >
                  {column.label}
                </TableHead>
              ) : (
                <TableHead key={column.key}>{column.label}</TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageRows.map((row) => (
            <TableRow key={rowKey(row)}>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.accessor(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pageSize && totalPages > 1 ? (
        <Pagination>
          <PaginationPrevious disabled={currentPage === 1} onClick={() => setPage((p) => p - 1)} />
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <PaginationItem
              key={pageNumber}
              current={pageNumber === currentPage}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </PaginationItem>
          ))}
          <PaginationNext disabled={currentPage === totalPages} onClick={() => setPage((p) => p + 1)} />
        </Pagination>
      ) : null}
    </div>
  );
}
