import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type DataTableColumn } from "./DataTable";

type Person = { id: number; name: string; age: number };
const rows: Person[] = [
  { id: 1, name: "Grace", age: 85 },
  { id: 2, name: "Ada", age: 36 },
  { id: 3, name: "Linus", age: 54 },
];
const columns: DataTableColumn<Person>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "age", label: "Age", sortable: true, align: "end" },
];
const names = () => within(screen.getByRole("grid")).getAllByRole("rowheader").map((c) => c.textContent);

describe("DataTable", () => {
  it("sorts by a column's value, numbers as numbers", async () => {
    render(<DataTable label="People" columns={columns} rows={rows} rowKey={(r) => r.id} />);
    expect(names()).toEqual(["Grace", "Ada", "Linus"]);
    await userEvent.click(screen.getByRole("columnheader", { name: /Age/ }));
    expect(names()).toEqual(["Ada", "Linus", "Grace"]);
    await userEvent.click(screen.getByRole("columnheader", { name: /Age/ }));
    expect(names()).toEqual(["Grace", "Linus", "Ada"]);
  });

  it("filters with the search trio and announces the count", async () => {
    const onSearchChange = vi.fn();
    render(<DataTable label="People" columns={columns} rows={rows} rowKey={(r) => r.id} searchable onSearchChange={onSearchChange} />);
    await userEvent.type(screen.getByRole("searchbox", { name: "Search people" }), "li");
    expect(onSearchChange).toHaveBeenLastCalledWith("li");
    expect(names()).toEqual(["Linus"]);
    expect(screen.getByRole("status")).toHaveTextContent("1 row match");
    await userEvent.type(screen.getByRole("searchbox"), "zz");
    expect(screen.getByText("Nothing matches “lizz”.")).toBeInTheDocument();
  });

  it("pages through rows with the page trio", async () => {
    const onPageChange = vi.fn();
    render(<DataTable label="People" columns={columns} rows={rows} rowKey={(r) => r.id} pageSize={2} onPageChange={onPageChange} />);
    expect(names()).toEqual(["Grace", "Ada"]);
    await userEvent.click(screen.getByRole("button", { name: /page 2/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(names()).toEqual(["Linus"]);
  });

  it("selects rows through the selection trio", async () => {
    const onSelectionChange = vi.fn();
    render(<DataTable label="People" columns={columns} rows={rows} rowKey={(r) => r.id} selectionMode="multiple" defaultSelectedKeys={new Set([2])} onSelectionChange={onSelectionChange} />);
    expect(screen.getByRole("checkbox", { name: "Select Ada" })).toBeChecked();
    await userEvent.click(screen.getByRole("checkbox", { name: "Select Grace" }));
    expect([...onSelectionChange.mock.calls[0][0]].sort()).toEqual([1, 2]);
  });

  it("passes loading and error through", () => {
    const { rerender } = render(<DataTable label="People" columns={columns} rows={rows} rowKey={(r) => r.id} loading />);
    expect(screen.getByRole("grid")).toHaveAttribute("aria-busy", "true");
    rerender(<DataTable label="People" columns={columns} rows={[]} rowKey={(r) => r.id} error="Failed to load." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load.");
  });
});
