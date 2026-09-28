import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Footer } from "./Footer";

const columns = [
  { title: "Product", links: [{ label: "Pricing", href: "/pricing" }, { label: "Changelog", href: "/changelog" }] },
  { title: "Company", links: [{ label: "About", href: "/about" }] },
];

describe("Footer", () => {
  it("renders a contentinfo landmark, muted by default", () => {
    render(<Footer bottom="© Datum" />);
    expect(screen.getByRole("contentinfo")).toHaveAttribute("data-tone", "muted");
  });

  it("renders each column as a heading and a named list of links inside a Footer nav", () => {
    render(<Footer columns={columns} />);
    const nav = screen.getByRole("navigation", { name: "Footer" });
    expect(within(nav).getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(["Product", "Company"]);
    const product = within(nav).getByRole("list", { name: "Product" });
    expect(within(product).getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "/pricing");
  });

  it("renders the lead (children), the bottom row and tone=default", () => {
    render(
      <Footer tone="default" bottom={<span>© 2026 Datum</span>}>
        <strong>Datum</strong>
      </Footer>
    );
    expect(screen.getByRole("contentinfo")).toHaveAttribute("data-tone", "default");
    expect(screen.getByText("Datum")).toBeInTheDocument();
    expect(screen.getByText("© 2026 Datum")).toBeInTheDocument();
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("sizes its content with maxWidth, xl by default", () => {
    const { container, rerender } = render(<Footer bottom="©" />);
    expect(container.querySelector("[data-size]")).toHaveAttribute("data-size", "xl");
    rerender(<Footer bottom="©" maxWidth="lg" />);
    expect(container.querySelector("[data-size]")).toHaveAttribute("data-size", "lg");
  });

  it("forwards its ref and merges className", () => {
    let node: HTMLElement | null = null;
    render(<Footer ref={(el) => (node = el)} className="custom" />);
    expect(node).toBe(screen.getByRole("contentinfo"));
    expect(node!.className).toContain("custom");
  });
});
