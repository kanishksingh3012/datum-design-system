import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Link } from "./Link";

describe("Link", () => {
  it("renders a native anchor with its href", () => {
    render(<Link href="/billing">Billing</Link>);
    const link = screen.getByRole("link", { name: "Billing" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/billing");
  });

  it("defaults to underline=always", () => {
    render(<Link href="/billing">Billing</Link>);
    expect(screen.getByRole("link", { name: "Billing" })).toHaveAttribute("data-underline", "always");
  });

  it("reflects the underline and decorationStyle props", () => {
    render(
      <Link href="/billing" underline="hover" decorationStyle="dashed">
        Billing
      </Link>
    );
    const link = screen.getByRole("link", { name: "Billing" });
    expect(link).toHaveAttribute("data-underline", "hover");
    expect(link).toHaveStyle({ textDecorationStyle: "dashed" });
  });
});
