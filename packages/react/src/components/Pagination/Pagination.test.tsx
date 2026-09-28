import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination, pageRange } from "./Pagination";

describe("pageRange", () => {
  it("lists every page when they fit", () => {
    expect(pageRange(5, 3)).toEqual([1, 2, 3, 4, 5]);
  });
  it("keeps the first, the last and siblings around the current page", () => {
    expect(pageRange(12, 1)).toEqual([1, 2, 3, 4, 5, "…", 12]);
    expect(pageRange(12, 6)).toEqual([1, "…", 5, 6, 7, "…", 12]);
    expect(pageRange(12, 12)).toEqual([1, "…", 8, 9, 10, 11, 12]);
    expect(pageRange(20, 10, 2)).toEqual([1, "…", 8, 9, 10, 11, 12, "…", 20]);
  });
});

describe("Pagination", () => {
  it("is a labelled nav; defaults to page 1, size md; the current page has aria-current", () => {
    render(<Pagination pageCount={12} data-testid="pages" />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toHaveAttribute("data-size", "md");
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  it("moves with page buttons and arrows (uncontrolled) and reports each change", async () => {
    const onValueChange = vi.fn();
    render(<Pagination pageCount={12} defaultValue={5} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onValueChange).toHaveBeenLastCalledWith(6);
    expect(screen.getByRole("button", { name: "Page 6" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(screen.getByRole("button", { name: "Page 12" }));
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("stays on the controlled value", async () => {
    const onValueChange = vi.fn();
    render(<Pagination pageCount={12} value={3} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Page 4" }));
    expect(onValueChange).toHaveBeenCalledWith(4);
    expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute("aria-current", "page");
  });

  it("shows more siblings when asked", () => {
    render(<Pagination pageCount={20} defaultValue={10} siblings={2} />);
    expect(screen.getByRole("button", { name: "Page 8" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 12" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Page 7" })).toBeNull();
  });

  it("compact shows 'Page n of m' with arrows only", () => {
    render(<Pagination pageCount={12} defaultValue={3} compact size="sm" />);
    expect(screen.getByText("Page 3 of 12")).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByRole("navigation")).toHaveAttribute("data-size", "sm");
  });

  it("renders pages as links with getHref", () => {
    render(<Pagination pageCount={3} defaultValue={1} getHref={(p) => `?page=${p}`} />);
    expect(screen.getByRole("link", { name: "Page 2" })).toHaveAttribute("href", "?page=2");
    expect(screen.getByRole("link", { name: "Next page" })).toHaveAttribute("href", "?page=2");
  });
});
