import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, type TableProps } from "./Table";

const people = [
  { id: "a", name: "Ada", role: "Engineer" },
  { id: "b", name: "Grace", role: "Admiral" },
];

function People(props: Partial<TableProps>) {
  return (
    <Table aria-label="People" {...props}>
      <TableHeader>
        <TableColumn key="name" isRowHeader allowsSorting>Name</TableColumn>
        <TableColumn key="role" align="end">Role</TableColumn>
      </TableHeader>
      <TableBody items={props.loading || props.error ? [] : people}>
        {(p) => (
          <TableRow key={p.id}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.role}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("is a labelled grid with column and row headers", () => {
    render(<People />);
    const grid = screen.getByRole("grid", { name: "People" });
    expect(within(grid).getAllByRole("columnheader")).toHaveLength(2);
    expect(within(grid).getAllByRole("rowheader")[0]).toHaveTextContent("Ada");
    expect(screen.getByText("Engineer").closest("td")).toHaveAttribute("data-align", "end");
  });

  it("sorts through the sortDescriptor trio", async () => {
    const onSortChange = vi.fn();
    render(<People defaultSortDescriptor={{ column: "name", direction: "ascending" }} onSortChange={onSortChange} />);
    const header = screen.getByRole("columnheader", { name: "Name" });
    expect(header).toHaveAttribute("aria-sort", "ascending");
    await userEvent.click(header);
    expect(onSortChange).toHaveBeenCalledWith({ column: "name", direction: "descending" });
    expect(header).toHaveAttribute("aria-sort", "descending");
  });

  it("selects rows with checkboxes, and all at once", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<People selectionMode="multiple" onSelectionChange={onSelectionChange} />);
    await user.click(screen.getByRole("checkbox", { name: "Select Ada" }));
    expect(screen.getByRole("row", { name: /Ada/ })).toHaveAttribute("aria-selected", "true");
    expect([...onSelectionChange.mock.lastCall![0]]).toEqual(["a"]);
    await user.click(screen.getByRole("checkbox", { name: "Select all" }));
    expect(onSelectionChange.mock.lastCall![0]).toBe("all");
  });

  it("selects a row by clicking it, and honours controlled selectedKeys", async () => {
    const { rerender } = render(<People selectionMode="single" />);
    await userEvent.click(screen.getByText("Grace"));
    expect(screen.getByRole("row", { name: /Grace/ })).toHaveAttribute("aria-selected", "true");
    rerender(<People selectionMode="single" selectedKeys={new Set(["a"])} />);
    expect(screen.getByRole("row", { name: /Ada/ })).toHaveAttribute("aria-selected", "true");
  });

  it("moves between cells with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<People />);
    await user.tab();
    expect(document.activeElement).toHaveTextContent(/Ada/);
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent(/Grace/);
  });

  it("keeps a directly focused checkbox focused, and arrows on from it", async () => {
    const user = userEvent.setup();
    render(<People selectionMode="multiple" />);
    const ada = screen.getByRole("checkbox", { name: "Select Ada" });
    const grace = screen.getByRole("checkbox", { name: "Select Grace" });
    ada.focus();
    ada.blur();
    grace.focus();
    expect(document.activeElement).toBe(grace);
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(ada);
  });

  it("shows empty, loading and error states", () => {
    const { rerender } = render(
      <Table aria-label="None" emptyState="Nothing here">
        <TableHeader><TableColumn key="a">A</TableColumn></TableHeader>
        <TableBody>{[]}</TableBody>
      </Table>
    );
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    rerender(<People loading />);
    expect(screen.getByRole("grid")).toHaveAttribute("aria-busy", "true");
    rerender(<People error="Couldn’t load people." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Couldn’t load people.");
  });
});
