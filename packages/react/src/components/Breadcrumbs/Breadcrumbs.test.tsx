import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";

const trail = (props = {}) => (
  <Breadcrumbs data-testid="crumbs" {...props}>
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
    <BreadcrumbItem href="/docs/components">Components</BreadcrumbItem>
    <BreadcrumbItem href="/docs/components/nav">Navigation</BreadcrumbItem>
    <BreadcrumbItem current>Tabs</BreadcrumbItem>
  </Breadcrumbs>
);

describe("Breadcrumbs", () => {
  it("is a labelled nav with an ordered list; the current item is text with aria-current", () => {
    render(trail());
    expect(screen.getByRole("navigation", { name: "Breadcrumbs" })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.getByText("Tabs")).toHaveAttribute("aria-current", "page");
  });

  it("defaults to separator=chevron and size=md, and reflects both", () => {
    const { rerender } = render(trail());
    expect(screen.getByTestId("crumbs")).toHaveAttribute("data-separator", "chevron");
    expect(screen.getByTestId("crumbs")).toHaveAttribute("data-size", "md");
    rerender(trail({ separator: "slash", size: "sm" }));
    expect(screen.getByTestId("crumbs")).toHaveAttribute("data-separator", "slash");
    expect(screen.getByTestId("crumbs")).toHaveAttribute("data-size", "sm");
  });

  it("draws separators between items only, hidden from screen readers", () => {
    const { container } = render(trail({ separator: "slash" }));
    const separators = container.querySelectorAll('li[aria-hidden="true"]');
    expect(separators).toHaveLength(4);
    expect(separators[0]).toHaveTextContent("/");
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });

  it("collapses the middle past maxItems and expands on the … button", async () => {
    render(trail({ maxItems: 3 }));
    expect(screen.getAllByRole("link").map((a) => a.textContent)).toEqual(["Home", "Navigation"]);
    await userEvent.click(screen.getByRole("button", { name: "Show 2 more" }));
    expect(screen.getAllByRole("link")).toHaveLength(4);
    expect(screen.queryByRole("button")).toBeNull();
  });
});
