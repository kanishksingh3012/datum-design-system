import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@datum-design/react";

/** A static reference table built on Datum's Table. The first column is the row header. */
export function DocTable({ label, columns, rows }: { label: string; columns: string[]; rows: string[][] }) {
  return (
    <Table aria-label={label}>
      <TableHeader>
        {columns.map((c, i) => <TableColumn key={c} isRowHeader={i === 0}>{c}</TableColumn>)}
      </TableHeader>
      <TableBody>
        {rows.map((r) => (
          <TableRow key={r[0]}>
            {r.map((cell, i) => <TableCell key={i}>{cell}</TableCell>)}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
