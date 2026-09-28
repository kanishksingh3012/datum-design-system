import { useMemo, useState, type ReactNode } from "react";
import {
  Badge, Button, DataTable, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, type DataTableColumn, type SortDescriptor,
} from "@datum-design/react";

type Row = [string, string, string, string];
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
const intent = { Paid: "success", Overdue: "danger", Draft: "neutral" } as const;

const columns: DataTableColumn<Invoice>[] = [
  { key: "id", label: "Invoice", sortable: true },
  { key: "client", label: "Client", sortable: true, rowHeader: true },
  { key: "status", label: "Status", sortable: true, render: (r) => <Badge intent={intent[r.status]} appearance="soft" size="sm">{r.status}</Badge> },
  { key: "amount", label: "Amount", sortable: true, align: "end", render: (r) => money(r.amount) },
];

function Props({ rows }: { rows: Row[] }) {
  return (
    <table className="props-table">
      <thead><tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr></thead>
      <tbody>{rows.map(([p, t, d, n]) => <tr key={p}><th scope="row"><code>{p}</code></th><td><code>{t}</code></td><td><code>{d}</code></td><td>{n}</td></tr>)}</tbody>
    </table>
  );
}

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

const Demo = ({ children }: { children: ReactNode }) => <div className="sample-box demo-on-page" style={{ display: "block" }}>{children}</div>;

export function DataSection() {
  const [state, setState] = useState<"empty" | "loading" | "error">("empty");
  return (
    <>
      <section className="component-doc" id="table">
        <h1>Table</h1>
        <p className="dek">A data grid on React Aria's <b>useTable</b> + <b>useTableState</b>: arrow keys move between cells, sortable headers take <b>sortDescriptor</b>, rows select with Datum Checkboxes. It scrolls sideways inside its own <b>radius.card</b> box and never widens the page; the header sticks when <b>maxHeight</b> is set.</p>
        <div className="example-box" style={{ display: "block" }}><SortedTable /></div>
        <div className="doc-section">
          <h2>Empty, loading and error</h2>
          <p className="lead">The body is replaced, never the header: <b>emptyState</b>, skeleton rows while <b>loading</b> (aria-busy), or <b>error</b> as an alert.</p>
          <Demo>
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
      </section>

      <section className="component-doc" id="data-table">
        <h1>Data Table</h1>
        <p className="dek">Table with the work done: sorting by each column's <b>value</b>, a search field, pagination and selection, each state a trio. The matching row count is announced politely as the search narrows it.</p>
        <div className="example-box" style={{ display: "block" }}>
          <DataTable label="Invoices" columns={columns} rows={invoices} rowKey={(r) => r.id} searchable selectionMode="multiple" pageSize={5} toolbar={<Button intent="neutral" appearance="outline" size="sm">Export</Button>} />
        </div>
        <div className="doc-section">
          <h2>Properties</h2>
          <Props rows={[
            ["label / columns / rows / rowKey", "string / DataTableColumn[] / Row[] / (row) => Key", "—", "Column: key, label, value?, render?, sortable?, align?, rowHeader?"],
            ["page / defaultPage / onPageChange", "number", "1", "With pageSize"],
            ["search / defaultSearch / onSearchChange", "string", "\"\"", "With searchable"],
            ["selectionMode, selectedKeys trio, sortDescriptor trio", "as Table", "—", "Number keys round-trip"],
            ["toolbar", "ReactNode", "—", "Actions beside the search"],
            ["loading / error / emptyState / onRowAction", "as Table", "—", ""],
          ]} />
        </div>
      </section>
    </>
  );
}
