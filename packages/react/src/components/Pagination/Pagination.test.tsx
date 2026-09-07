import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Pagination, PaginationItem, PaginationPrevious, PaginationNext, PaginationEllipsis } from "./Pagination";

describe("Pagination", () => {
  it("wraps items in a <nav aria-label=pagination> + <ol>", () => {
    render(
      <Pagination>
        <PaginationPrevious disabled />
        <PaginationItem current>1</PaginationItem>
        <PaginationItem>2</PaginationItem>
        <PaginationEllipsis />
        <PaginationNext />
      </Pagination>
    );
    expect(screen.getByRole("navigation", { name: "pagination" })).toBeInTheDocument();
  });

  it("sets aria-current=page on the active page only", () => {
    render(
      <Pagination>
        <PaginationItem current>1</PaginationItem>
        <PaginationItem>2</PaginationItem>
      </Pagination>
    );
    expect(screen.getByRole("button", { name: "1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "2" })).not.toHaveAttribute("aria-current");
  });

  it("disables the Previous button on the first page", () => {
    render(
      <Pagination>
        <PaginationPrevious disabled />
        <PaginationItem current>1</PaginationItem>
      </Pagination>
    );
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
  });
});
