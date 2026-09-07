import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable } from "./DataTable";

interface Person {
  id: string;
  name: string;
  role: string;
}

const people: Person[] = [
  { id: "1", name: "Bea", role: "Engineer" },
  { id: "2", name: "Amir", role: "Designer" },
  { id: "3", name: "Chloe", role: "Engineer" },
  { id: "4", name: "Dev", role: "Manager" },
];

const columns = [
  { key: "name", label: "Name", accessor: (p: Person) => p.name, sortable: true },
  { key: "role", label: "Role", accessor: (p: Person) => p.role },
];

describe("DataTable", () => {
  it("renders a real table with sortable and non-sortable columns", () => {
    render(<DataTable caption="Team" columns={columns} rows={people} rowKey={(p) => p.id} />);
    expect(screen.getByRole("table", { name: "Team" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("aria-sort", "none");
    expect(screen.getByRole("columnheader", { name: "Role" })).not.toHaveAttribute("aria-sort");
  });

  it("sorts rows ascending then descending on repeated header clicks", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Team" columns={columns} rows={people} rowKey={(p) => p.id} />);
    const nameHeaderButton = screen.getByRole("button", { name: "Name" });
    await user.click(nameHeaderButton);
    let cells = screen.getAllByRole("cell").filter((_, i) => i % 2 === 0);
    expect(cells[0]).toHaveTextContent("Amir");
    await user.click(nameHeaderButton);
    cells = screen.getAllByRole("cell").filter((_, i) => i % 2 === 0);
    expect(cells[0]).toHaveTextContent("Dev");
  });

  it("filters rows across every column as the user types", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Team" columns={columns} rows={people} rowKey={(p) => p.id} />);
    await user.type(screen.getByLabelText("Filter Team"), "Engineer");
    expect(screen.getByText("Bea")).toBeInTheDocument();
    expect(screen.getByText("Chloe")).toBeInTheDocument();
    expect(screen.queryByText("Amir")).not.toBeInTheDocument();
  });

  it("paginates rows and lets you page forward with real page controls", async () => {
    const user = userEvent.setup();
    render(<DataTable caption="Team" columns={columns} rows={people} rowKey={(p) => p.id} pageSize={2} />);
    expect(screen.getByText("Bea")).toBeInTheDocument();
    expect(screen.queryByText("Dev")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "2" }));
    expect(screen.getByText("Dev")).toBeInTheDocument();
    expect(screen.queryByText("Bea")).not.toBeInTheDocument();
  });
});
