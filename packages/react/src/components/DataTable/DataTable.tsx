import { useMemo, type HTMLAttributes, type ReactNode } from "react";
import type { Key, Selection, SortDescriptor } from "react-stately";
import { useControllableState } from "../../lib/useControllableState";
import { Pagination } from "../Pagination/Pagination";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, type TableAlign, type TableSelectionMode } from "../Table/Table";
import { TextField } from "../TextField/TextField";
import styles from "./DataTable.module.css";

export interface DataTableColumn<Row> {
  /** Identifies the column, and reads `row[key]` when there's no `value`. */
  key: string;
  label: ReactNode;
  /** The sort and search value. @default row[key] */
  value?: (row: Row) => string | number;
  /** How the cell renders. @default the value */
  render?: (row: Row) => ReactNode;
  /** @default false */
  sortable?: boolean;
  /** @default "start" */
  align?: TableAlign;
  /** Names the row, for screen readers and selection checkboxes. The first column is used if none is set. */
  rowHeader?: boolean;
}

export interface DataTableOwnProps<Row> {
  /** Names the table (and its search field). */
  label: string;
  columns: DataTableColumn<Row>[];
  rows: Row[];
  /** Each row's stable key. */
  rowKey: (row: Row) => Key;
  /** @default "none" */
  selectionMode?: TableSelectionMode;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  /** The sorted column (controlled); rows are sorted here by the column's `value`. */
  sortDescriptor?: SortDescriptor;
  defaultSortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  /** Rows per page; omit to show every row. */
  pageSize?: number;
  /** The current page, from 1 (controlled). */
  page?: number;
  /** @default 1 */
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  /** Show a search field that filters rows on every column's value. @default false */
  searchable?: boolean;
  /** The search text (controlled). */
  search?: string;
  /** @default "" */
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** Actions beside the search field, e.g. an export Button. */
  toolbar?: ReactNode;
  /** @default false */
  loading?: boolean;
  error?: ReactNode;
  /** Shown when nothing matches. @default "No results." */
  emptyState?: ReactNode;
  onRowAction?: (key: Key) => void;
}

export type DataTableProps<Row> = DataTableOwnProps<Row> & Omit<HTMLAttributes<HTMLDivElement>, "children">;

const read = <Row,>(column: DataTableColumn<Row>, row: Row) =>
  column.value ? column.value(row) : ((row as Record<string, unknown>)[column.key] as string | number | undefined) ?? "";

/**
 * Table with the work done: sorting by each column's value, a search field,
 * pagination, and row selection — every piece of state as a trio. The count of
 * matching rows is announced politely as the search narrows it.
 */
export function DataTable<Row>({
  label,
  columns,
  rows,
  rowKey,
  selectionMode = "none",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  sortDescriptor: sortProp,
  defaultSortDescriptor,
  onSortChange,
  pageSize,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  searchable = false,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  toolbar,
  loading = false,
  error,
  emptyState,
  onRowAction,
  className,
  ...rest
}: DataTableProps<Row>) {
  const [sort, setSort] = useControllableState<SortDescriptor | undefined>(sortProp, defaultSortDescriptor, onSortChange as (d?: SortDescriptor) => void);
  const [page, setPage] = useControllableState(pageProp, defaultPage, onPageChange);
  const [search, setSearch] = useControllableState(searchProp, defaultSearch, onSearchChange);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) => columns.some((c) => String(read(c, row)).toLowerCase().includes(needle)));
  }, [rows, columns, search]);

  const sorted = useMemo(() => {
    const column = sort && columns.find((c) => c.key === sort.column);
    if (!column) return filtered;
    const dir = sort!.direction === "descending" ? -1 : 1;
    return [...filtered].sort((a, b) => {
      const x = read(column, a);
      const y = read(column, b);
      return dir * (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true }));
    });
  }, [filtered, columns, sort]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const current = Math.min(Math.max(1, page), pageCount);
  const visible = pageSize ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted;
  // React keys are strings: map each row's key to its string form and back, so number keys round-trip
  const original = useMemo(() => new Map(rows.map((row) => [String(rowKey(row)), rowKey(row)])), [rows, rowKey]);
  const toTable = (keys?: Selection) => (keys === undefined || keys === "all" ? keys : new Set([...keys].map(String)));
  const fromTable = (keys: Selection): Selection => (keys === "all" ? keys : new Set([...keys].map((k) => original.get(String(k)) ?? k)));
  const headerKey = (columns.find((c) => c.rowHeader) ?? columns[0])?.key;

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} {...rest}>
      {searchable || toolbar ? (
        <div className={styles.toolbar}>
          {searchable ? (
            <div className={styles.search}>
              <TextField
                label={`Search ${label.toLowerCase()}`}
                type="search"
                size="sm"
                clearable
                value={search}
                onValueChange={(v) => {
                  setSearch(v);
                  setPage(1);
                }}
              />
            </div>
          ) : null}
          {toolbar ? <div className={styles.actions}>{toolbar}</div> : null}
        </div>
      ) : null}
      <Table
        aria-label={label}
        selectionMode={selectionMode}
        selectedKeys={toTable(selectedKeys)}
        defaultSelectedKeys={toTable(defaultSelectedKeys)}
        onSelectionChange={onSelectionChange && ((keys) => onSelectionChange(fromTable(keys)))}
        sortDescriptor={sort}
        onSortChange={(d) => {
          setSort(d);
          setPage(1);
        }}
        loading={loading}
        error={error}
        emptyState={emptyState ?? (search ? `Nothing matches “${search}”.` : "No results.")}
        onRowAction={onRowAction && ((key) => onRowAction(original.get(String(key)) ?? key))}
      >
        <TableHeader>
          {columns.map((c) => (
            <TableColumn key={c.key} allowsSorting={c.sortable} isRowHeader={c.key === headerKey} align={c.align}>
              {c.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {visible.map((row) => (
            <TableRow key={String(rowKey(row))}>
              {columns.map((c) => (
                <TableCell key={c.key} textValue={String(read(c, row))}>
                  {c.render ? c.render(row) : read(c, row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={styles.footer}>
        <span className={styles.count} role="status">
          {loading || error ? "" : `${sorted.length} ${sorted.length === 1 ? "row" : "rows"}${search ? " match" : ""}`}
        </span>
        {pageSize && pageCount > 1 ? <Pagination pageCount={pageCount} value={current} onValueChange={setPage} size="sm" /> : null}
      </div>
    </div>
  );
}
