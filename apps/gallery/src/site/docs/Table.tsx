import { useMemo, useState, type ReactNode } from "react";
import { Badge, Button, Selection, SortDescriptor, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@datum-design/react";
import { A11y, Demo } from "./kit";

const intent = { Paid: "success", Overdue: "danger", Draft: "neutral" } as const;
type Invoice = { id: string; client: string; status: "Paid" | "Overdue" | "Draft"; amount: number };
const invoices: Invoice[] = [
  { id: "INV-101", client: "Acme Inc.", status: "Paid", amount: 1200 },
  { id: "INV-102", client: "Globex", status: "Overdue", amount: 860.5 },
  { id: "INV-103", client: "Initech", status: "Draft", amount: 4300 },
  { id: "INV-104", client: "Umbrella Corporation", status: "Paid", amount: 99 },
  { id: "INV-105", client: "Hooli", status: "Overdue", amount: 2150 },
  { id: "INV-106", client: "Stark Industries", status: "Paid", amount: 12800 },
  { id: "INV-107", client: "Wayne Enterprises", status: "Draft", amount: 640 },
];
const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
function SortedTable() {
  const [sort, setSort] = useState<SortDescriptor>({ column: "amount", direction: "descending" });
  const rows = useMemo(() => {
    const dir = sort.direction === "descending" ? -1 : 1;
    return [...invoices].sort((a, b) => dir * (sort.column === "amount" ? a.amount - b.amount : a.client.localeCompare(b.client)));
  }, [sort]);
  return (
    <Table aria-label="Invoices" selectionMode="multiple" sortDescriptor={sort} onSortChange={setSort} defaultSelectedKeys={new Set(["INV-102"])}>
      <TableHeader>
        <TableColumn key="client" isRowHeader allowsSorting>Client</TableColumn>
        <TableColumn key="status">Status</TableColumn>
        <TableColumn key="amount" align="end" allowsSorting>Amount</TableColumn>
      </TableHeader>
      <TableBody items={rows}>
        {(r) => (
          <TableRow key={r.id}>
            <TableCell>{r.client}</TableCell>
            <TableCell textValue={r.status}><Badge intent={intent[r.status]} appearance="soft" size="sm">{r.status}</Badge></TableCell>
            <TableCell>{money(r.amount)}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
type Row = [string, string, string, string];
function Props({ rows }: { rows: Row[] }) {
  return (
    <table className="props-table">
      <thead><tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr></thead>
      <tbody>{rows.map(([p, t, d, n]) => <tr key={p}><th scope="row"><code>{p}</code></th><td><code>{t}</code></td><td><code>{d}</code></td><td>{n}</td></tr>)}</tbody>
    </table>
  );
}

export default function TableDoc() {
  const [state, setState] = useState<"empty" | "loading" | "error">("empty");
  return (
    <>
    <section className="component-doc" id="table">
      <h1>Table</h1>
      <p className="dek">A data grid on React Aria's <b>useTable</b> + <b>useTableState</b>: arrow keys move between cells, sortable headers take <b>sortDescriptor</b>, rows select with Datum Checkboxes. It fills its parent's width, with the columns sharing it, and scrolls sideways inside its own <b>radius.card</b> box when they can't fit, so it never widens the page; the header sticks when <b>maxHeight</b> is set.</p>
      <div className="example-box" style={{ display: "block" }}><SortedTable /></div>
      <div className="doc-section">
        <h2>Empty, loading and error</h2>
        <p className="lead">The body is replaced, never the header: <b>emptyState</b>, skeleton rows while <b>loading</b> (aria-busy), or <b>error</b> as an alert.</p>
        <Demo style={{ display: "block" }}>
          <div style={{ display: "flex", gap: "var(--space-compact)", marginBottom: "var(--space-default)" }}>
            {(["empty", "loading", "error"] as const).map((s) => (
              <Button key={s} size="sm" intent="neutral" appearance="outline" pressed={state === s} onPressedChange={() => setState(s)}>{s}</Button>
            ))}
          </div>
          <Table aria-label="Invoices" loading={state === "loading"} error={state === "error" ? "Couldn’t load invoices. Try again." : undefined} emptyState="No invoices yet.">
            <TableHeader>
              <TableColumn key="client" isRowHeader>Client</TableColumn>
              <TableColumn key="amount" align="end">Amount</TableColumn>
            </TableHeader>
            <TableBody>{[]}</TableBody>
          </Table>
        </Demo>
      </div>
      <div className="doc-section">
        <h2>Properties</h2>
        <Props rows={[
          ["aria-label", "string", "—", "Or aria-labelledby"],
          ["selectionMode", "none · single · multiple", "none", "multiple adds a checkbox column"],
          ["selectedKeys / defaultSelectedKeys / onSelectionChange", "Selection", "—", "\"all\" when every row is selected"],
          ["sortDescriptor / defaultSortDescriptor / onSortChange", "{ column, direction }", "—", "Sort the rows you pass"],
          ["disabledKeys", "Iterable<Key>", "—", ""],
          ["emptyState / loading / loadingRows / error", "ReactNode / boolean / number / ReactNode", "No results. / false / 3 / —", ""],
          ["maxHeight", "number | string", "—", "Scrolls the body under a sticky header"],
          ["TableColumn", "isRowHeader, allowsSorting, align", "—", "align: start · center · end"],
        ]} />
      </div>
      <A11y items={[
          ["Tab", "Moves into the grid once; arrow keys then move between cells (role=\"grid\")."],
          ["Enter / Space", "On a sortable header, sorts; aria-sort announces the direction."],
          ["Selection", "Rows select with Space or the Datum Checkbox in the first column."],
        ]} />
    </section>

    </>
  );
}
