import { useRef, type HTMLAttributes, type JSX, type ReactNode } from "react";
import {
  mergeProps,
  useFocusRing,
  useHover,
  useTable,
  useTableCell,
  useTableColumnHeader,
  useTableHeaderRow,
  useTableRow,
  useTableRowGroup,
  useTableSelectAllCheckbox,
  useTableSelectionCheckbox,
} from "react-aria";
import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  useTableState,
  type ColumnProps,
  type Key,
  type Selection,
  type SortDescriptor,
  type TableState,
} from "react-stately";
import { useControllableState } from "../../lib/useControllableState";
import { Checkbox } from "../Checkbox/Checkbox";
import { Skeleton } from "../Skeleton/Skeleton";
import { ScrollArea } from "../ScrollArea/ScrollArea";
import styles from "./Table.module.css";

export type { Selection, SortDescriptor };
export type TableSelectionMode = "none" | "single" | "multiple";
export type TableAlign = "start" | "center" | "end";

export interface TableColumnProps<T> extends ColumnProps<T> {
  /** Text alignment in the column; `end` for numbers. @default "start" */
  align?: TableAlign;
}

/** Collection elements (React Stately's): describe the table, the hooks render it. */
export const TableColumn = Column as <T>(props: TableColumnProps<T>) => JSX.Element;
export { TableHeader, TableBody, Row as TableRow, Cell as TableCell };

export interface TableOwnProps {
  /** Names the table. Pass this or `aria-labelledby`. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** Row selection, with a checkbox column when `multiple`. @default "none" */
  selectionMode?: TableSelectionMode;
  /** The selected rows' keys (controlled). "all" when every row is selected. */
  selectedKeys?: Selection;
  /** The rows selected at first (uncontrolled). */
  defaultSelectedKeys?: Selection;
  /** Called with the new selection. */
  onSelectionChange?: (keys: Selection) => void;
  /** Rows that can't be selected. */
  disabledKeys?: Iterable<Key>;
  /** The sorted column and direction (controlled). */
  sortDescriptor?: SortDescriptor;
  /** The sort to start with (uncontrolled). */
  defaultSortDescriptor?: SortDescriptor;
  /** Called when a sortable header is pressed. Sort the rows you pass in `TableBody`. */
  onSortChange?: (descriptor: SortDescriptor) => void;
  /** Called when a row is activated (Enter, or a click when nothing is selectable). */
  onRowAction?: (key: Key) => void;
  /** Shown in the body when there are no rows. @default "No results." */
  emptyState?: ReactNode;
  /** Rows are loading: skeleton rows replace the body and the table is aria-busy. @default false */
  loading?: boolean;
  /** How many skeleton rows to show while loading. @default 3 */
  loadingRows?: number;
  /** Replaces the body with an error message (role="alert"). */
  error?: ReactNode;
  /** Lets the body scroll under a fixed header. */
  maxHeight?: number | string;
  /** `[TableHeader, TableBody]`. */
  children: [JSX.Element, JSX.Element];
}

export type TableProps = TableOwnProps & Omit<HTMLAttributes<HTMLDivElement>, "children" | "aria-label" | "aria-labelledby">;

type Node = TableState<unknown>["collection"]["headerRows"][number];

/**
 * A data table on React Aria's `useTable` + React Stately's `useTableState`:
 * a role="grid" with arrow-key navigation between cells, sortable headers,
 * and single or multiple row selection (with Datum Checkboxes). It scrolls
 * sideways inside its own box and never widens the page.
 */
export function Table({
  selectionMode = "none",
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  disabledKeys,
  sortDescriptor: sortProp,
  defaultSortDescriptor,
  onSortChange,
  onRowAction,
  emptyState = "No results.",
  loading = false,
  loadingRows = 3,
  error,
  maxHeight,
  className,
  style,
  children,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  ...rest
}: TableProps) {
  const [sortDescriptor, setSort] = useControllableState<SortDescriptor | undefined>(sortProp, defaultSortDescriptor, onSortChange as (d?: SortDescriptor) => void);
  const state = useTableState({
    children: children as Parameters<typeof useTableState>[0]["children"],
    selectionMode,
    selectionBehavior: "toggle",
    showSelectionCheckboxes: selectionMode === "multiple",
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    disabledKeys,
    sortDescriptor,
    onSortChange: (d) => setSort(d),
  });
  const ref = useRef<HTMLTableElement>(null);
  const { gridProps } = useTable({ "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, onRowAction }, state, ref);
  const { collection } = state;
  const columnCount = collection.columnCount;
  const rows = [...collection.getChildren!(collection.body.key)] as Node[];
  const status = error !== undefined && error !== null ? "error" : loading ? "loading" : rows.length === 0 ? "empty" : "rows";

  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-status={status} {...rest}>
      <ScrollArea orientation="both" padding="none" maxHeight={maxHeight} fade={false} tabIndex={-1}>
        <table {...gridProps} ref={ref} className={styles.table} aria-busy={loading || undefined} data-selection={selectionMode}>
          <RowGroup type="thead" className={styles.head}>
            {collection.headerRows.map((headerRow) => (
              <HeaderRow key={headerRow.key} item={headerRow} state={state}>
                {[...collection.getChildren!(headerRow.key)].map((column) =>
                  column.props?.isSelectionCell ? (
                    <SelectAllCell key={column.key} column={column} state={state} />
                  ) : (
                    <ColumnHeader key={column.key} column={column} state={state} />
                  )
                )}
              </HeaderRow>
            ))}
          </RowGroup>
          <RowGroup type="tbody" className={styles.body}>
            {status === "rows"
              ? rows.map((row) => (
                  <TableRowView key={row.key} item={row} state={state}>
                    {[...collection.getChildren!(row.key)].map((cell) =>
                      cell.props?.isSelectionCell ? (
                        <CheckboxCell key={cell.key} cell={cell} state={state} />
                      ) : (
                        <TableCellView key={cell.key} cell={cell} state={state} />
                      )
                    )}
                  </TableRowView>
                ))
              : status === "loading"
                ? Array.from({ length: loadingRows }, (_, i) => (
                    <tr key={i} className={styles.row} aria-hidden="true">
                      {Array.from({ length: columnCount }, (_, c) => (
                        <td key={c} className={styles.cell}>
                          <Skeleton shape="text" width={c === 0 ? "70%" : "50%"} />
                        </td>
                      ))}
                    </tr>
                  ))
                : (
                    <tr role="row">
                      <td role="rowheader" colSpan={columnCount} className={styles.message} data-status={status}>
                        {status === "error" ? <div role="alert">{error}</div> : emptyState}
                      </td>
                    </tr>
                  )}
          </RowGroup>
        </table>
      </ScrollArea>
    </div>
  );
}

function RowGroup({ type: Element, className, children }: { type: "thead" | "tbody"; className: string; children: ReactNode }) {
  const { rowGroupProps } = useTableRowGroup();
  return (
    <Element {...rowGroupProps} className={className}>
      {children}
    </Element>
  );
}

function HeaderRow({ item, state, children }: { item: Node; state: TableState<unknown>; children: ReactNode }) {
  const ref = useRef<HTMLTableRowElement>(null);
  const { rowProps } = useTableHeaderRow({ node: item }, state, ref);
  return (
    <tr {...rowProps} ref={ref}>
      {children}
    </tr>
  );
}

const SortIcon = ({ direction }: { direction?: SortDescriptor["direction"] }) => (
  <svg className={styles.sortIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={direction === "ascending" ? "M12 19V5 M5 12l7-7 7 7" : direction === "descending" ? "M12 5v14 M19 12l-7 7-7-7" : "m7 15 5 5 5-5 M7 9l5-5 5 5"} />
  </svg>
);

function ColumnHeader({ column, state }: { column: Node; state: TableState<unknown> }) {
  const ref = useRef<HTMLTableCellElement>(null);
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const sortable = Boolean(column.props?.allowsSorting);
  const direction = state.sortDescriptor?.column === column.key ? state.sortDescriptor.direction : undefined;
  return (
    <th
      {...mergeProps(columnHeaderProps, focusProps)}
      ref={ref}
      className={styles.columnHeader}
      data-align={column.props?.align ?? "start"}
      data-sortable={sortable || undefined}
      data-sorted={direction ? true : undefined}
      data-focus-visible={isFocusVisible || undefined}
    >
      <span className={styles.headerContent}>
        {column.rendered}
        {sortable ? <SortIcon direction={direction} /> : null}
      </span>
    </th>
  );
}

function TableRowView({ item, state, children }: { item: Node; state: TableState<unknown>; children: ReactNode }) {
  const ref = useRef<HTMLTableRowElement>(null);
  const { rowProps, isSelected, isDisabled } = useTableRow({ node: item }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { hoverProps, isHovered } = useHover({ isDisabled: isDisabled || state.selectionManager.selectionMode === "none" });
  return (
    <tr
      {...mergeProps(rowProps, focusProps, hoverProps)}
      ref={ref}
      className={styles.row}
      data-selected={isSelected || undefined}
      data-disabled={isDisabled || undefined}
      data-hovered={isHovered || undefined}
      data-focus-visible={isFocusVisible || undefined}
    >
      {children}
    </tr>
  );
}

function TableCellView({ cell, state }: { cell: Node; state: TableState<unknown> }) {
  const ref = useRef<HTMLTableCellElement>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();
  const column = cell.column;
  const align = (column?.props as TableColumnProps<unknown> | undefined)?.align ?? "start";
  return (
    <td {...mergeProps(gridCellProps, focusProps)} ref={ref} className={styles.cell} data-align={align} data-focus-visible={isFocusVisible || undefined}>
      {cell.rendered}
    </td>
  );
}

/**
 * Space and Enter on a checkbox belong to it, not to the row's own press handling.
 * And a checkbox focused directly (a click, a screen reader, script) becomes the
 * grid's focused cell first — otherwise the grid would pull focus back to the
 * cell that was focused before.
 */
const checkboxHandlers = (state: TableState<unknown>, key: Key) => ({
  onFocus: () => state.selectionManager.setFocusedKey(key),
  onPointerDown: (e: { stopPropagation: () => void }) => e.stopPropagation(),
  onMouseDown: (e: { stopPropagation: () => void }) => e.stopPropagation(),
  onClick: (e: { stopPropagation: () => void }) => e.stopPropagation(),
  onKeyDown: (e: { key: string; stopPropagation: () => void }) => {
    if (e.key === " " || e.key === "Enter") e.stopPropagation();
  },
});

function CheckboxCell({ cell, state }: { cell: Node; state: TableState<unknown> }) {
  const ref = useRef<HTMLTableCellElement>(null);
  const { gridCellProps } = useTableCell({ node: cell }, state, ref);
  const { checkboxProps } = useTableSelectionCheckbox({ key: cell.parentKey! }, state);
  // named after the row's header cell, as React Aria's own checkbox is ("Select Ada Lovelace")
  const rowName = [...state.collection.getChildren!(cell.parentKey!)].find((c) => c.column?.props?.isRowHeader)?.textValue;
  return (
    <td {...gridCellProps} ref={ref} className={[styles.cell, styles.checkboxCell].join(" ")}>
      <span className={styles.checkbox} {...checkboxHandlers(state, cell.key)}>
        <Checkbox
          label={<span className={styles.srOnly}>{`Select ${rowName ?? ""}`.trim()}</span>}
          checked={Boolean(checkboxProps.isSelected)}
          disabled={checkboxProps.isDisabled}
          onCheckedChange={(v) => checkboxProps.onChange?.(v)}
        />
      </span>
    </td>
  );
}

function SelectAllCell({ column, state }: { column: Node; state: TableState<unknown> }) {
  const ref = useRef<HTMLTableCellElement>(null);
  const { columnHeaderProps } = useTableColumnHeader({ node: column }, state, ref);
  const { checkboxProps } = useTableSelectAllCheckbox(state);
  return (
    <th {...columnHeaderProps} ref={ref} className={[styles.columnHeader, styles.checkboxCell].join(" ")}>
      <span className={styles.checkbox} {...checkboxHandlers(state, column.key)}>
        <Checkbox
          label={<span className={styles.srOnly}>Select all</span>}
          checked={checkboxProps.isIndeterminate ? "indeterminate" : Boolean(checkboxProps.isSelected)}
          disabled={checkboxProps.isDisabled}
          onCheckedChange={(v) => checkboxProps.onChange?.(v)}
        />
      </span>
    </th>
  );
}
