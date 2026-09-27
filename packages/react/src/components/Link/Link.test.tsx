import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Link } from "./Link";

describe("Link", () => {
  it("renders a native anchor with its href", () => {
    render(<Link href="/pricing">Pricing</Link>);
    const link = screen.getByRole("link", { name: "Pricing" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/pricing");
  });

  it("defaults to tone=accent, underline=always and size=inherit", () => {
    render(<Link href="#">Docs</Link>);
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("data-tone", "accent");
    expect(link).toHaveAttribute("data-underline", "always");
    expect(link).toHaveAttribute("data-size", "inherit");
    expect(link).not.toHaveAttribute("target");
  });

  it("reflects tone, underline and size via data attributes", () => {
    render(
      <Link href="#" tone="neutral" underline="hover" size="sm">
        Terms
      </Link>
    );
    const link = screen.getByRole("link", { name: "Terms" });
    expect(link).toHaveAttribute("data-tone", "neutral");
    expect(link).toHaveAttribute("data-underline", "hover");
    expect(link).toHaveAttribute("data-size", "sm");
  });

  it("opens external links in a new tab safely and says so to screen readers", () => {
    const { container } = render(
      <Link href="https://example.com" external>
        Example
      </Link>
    );
    const link = screen.getByRole("link", { name: "Example (opens in a new tab)" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAttribute("data-external", "true");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("lets explicit target and rel override the external defaults", () => {
    render(
      <Link href="https://example.com" external rel="noopener" target="_top">
        Example
      </Link>
    );
    const link = screen.getByRole("link", { name: /Example/ });
    expect(link).toHaveAttribute("rel", "noopener");
    expect(link).toHaveAttribute("target", "_top");
  });
});
