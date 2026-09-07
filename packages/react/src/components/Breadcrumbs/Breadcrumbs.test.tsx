import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs, BreadcrumbItem } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("wraps items in a <nav aria-label=breadcrumb> + <ol>", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Settings</BreadcrumbItem>
      </Breadcrumbs>
    );
    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
  });

  it("renders the current item as text with aria-current=page, not a link", () => {
    render(
      <Breadcrumbs>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem current>Settings</BreadcrumbItem>
      </Breadcrumbs>
    );
    const current = screen.getByText("Settings");
    expect(current.tagName).toBe("SPAN");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });
});
