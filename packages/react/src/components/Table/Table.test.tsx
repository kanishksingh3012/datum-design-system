import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./Table";

describe("Table", () => {
  it("renders a real <table> with a real <caption> and <th scope>", () => {
    render(
      <Table>
        <TableCaption>Recent orders</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>#1001</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("table", { name: "Recent orders" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Order" })).toHaveAttribute("scope", "col");
  });

  it("stays role=table, never grid, even with a sortable column", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="ascending" onSort={() => {}}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Jane</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByRole("grid")).not.toBeInTheDocument();
  });

  it("puts a real button inside a sortable th and sets aria-sort on the th itself", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortDirection="ascending" onSort={onSort}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody />
      </Table>
    );
    const header = screen.getByRole("columnheader", { name: "Name" });
    expect(header).toHaveAttribute("aria-sort", "ascending");
    await user.click(screen.getByRole("button", { name: "Name" }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("omits aria-sort and the button for a non-sortable column", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody />
      </Table>
    );
    expect(screen.getByRole("columnheader", { name: "Status" })).not.toHaveAttribute("aria-sort");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
