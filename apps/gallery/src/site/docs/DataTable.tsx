import { type ReactNode } from "react";
import { Badge, Button, DataTable, DataTableColumn, Table } from "@datum-design/react";
import { A11y, Demo } from "./kit";

type Invoice = { id: string; client: string; status: "Paid" | "Overdue" | "Draft"; amount: number };
const intent = { Paid: "success", Overdue: "danger", Draft: "neutral" } as const;
const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
const columns: DataTableColumn<Invoice>[] = [
  { key: "id", label: "Invoice", sortable: true },
  { key: "client", label: "Client", sortable: true, rowHeader: true },
  { key: "status", label: "Status", sortable: true, render: (r) => <Badge intent={intent[r.status]} appearance="soft" size="sm">{r.status}</Badge> },
  { key: "amount", label: "Amount", sortable: true, align: "end", render: (r) => money(r.amount) },
];
const invoices: Invoice[] = [
  { id: "INV-101", client: "Acme Inc.", status: "Paid", amount: 1200 },
  { id: "INV-102", client: "Globex", status: "Overdue", amount: 860.5 },
  { id: "INV-103", client: "Initech", status: "Draft", amount: 4300 },
  { id: "INV-104", client: "Umbrella Corporation", status: "Paid", amount: 99 },
  { id: "INV-105", client: "Hooli", status: "Overdue", amount: 2150 },
  { id: "INV-106", client: "Stark Industries", status: "Paid", amount: 12800 },
  { id: "INV-107", client: "Wayne Enterprises", status: "Draft", amount: 640 },
];
type Row = [string, string, string, string];
function Props({ rows }: { rows: Row[] }) {
  return (
    <table className="props-table">
      <thead><tr><th scope="col">Prop</th><th scope="col">Values</th><th scope="col">Default</th><th scope="col">Notes</th></tr></thead>
      <tbody>{rows.map(([p, t, d, n]) => <tr key={p}><th scope="row"><code>{p}</code></th><td><code>{t}</code></td><td><code>{d}</code></td><td>{n}</td></tr>)}</tbody>
    </table>
  );
}

export default function DataTableDoc() {
  return (
    <>
    <section className="component-doc" id="data-table">
      <h1>Data Table</h1>
      <p className="dek">Table with the work done: sorting by each column's <b>value</b>, a search field, pagination and selection, each state a trio. Like Table, it fills its parent's width. The matching row count is announced politely as the search narrows it.</p>
      <Demo box="example" style={{ display: "block" }}>
        <DataTable label="Invoices" columns={columns} rows={invoices} rowKey={(r) => r.id} searchable selectionMode="multiple" pageSize={5} toolbar={<Button intent="neutral" appearance="outline" size="sm">Export</Button>} />
      </Demo>
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
      <A11y items={[
          ["Search", "The filter field is labelled; the number of matching rows is announced in a status region."],
          ["Grid", "Inherits Table's keyboard model: arrow keys between cells, Enter / Space to sort."],
          ["Pagination", "A labelled nav with the current page marked."],
        ]} />
    </section>
    </>
  );
}
