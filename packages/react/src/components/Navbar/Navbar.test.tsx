import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar, type NavbarLink } from "./Navbar";

const links: NavbarLink[] = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs", badge: "New" },
  { label: "Resources", items: [{ label: "Blog", href: "/blog" }, { label: "Guides", href: "/guides" }] },
  {
    label: "Products",
    columns: [
      { title: "Build", items: [{ label: "Editor", href: "/editor", description: "Write and preview" }] },
      { title: "Ship", items: [{ label: "Deploy", href: "/deploy" }] },
    ],
  },
];

describe("Navbar", () => {
  it("defaults to standard, solid, sticky, default size, bordered, md breakpoint", () => {
    render(<Navbar links={links} logo="Datum" />);
    const root = screen.getByRole("banner");
    expect(root).toHaveAttribute("data-layout", "standard");
    expect(root).toHaveAttribute("data-appearance", "solid");
    expect(root).toHaveAttribute("data-position", "sticky");
    expect(root).toHaveAttribute("data-size", "default");
    expect(root).toHaveAttribute("data-bordered", "true");
    expect(root).toHaveAttribute("data-breakpoint", "md");
  });

  it("reflects layout, appearance, position, size, bordered and breakpoint", () => {
    render(<Navbar links={links} layout="centered" appearance="inverse" position="fixed" size="compact" bordered={false} mobileBreakpoint="lg" />);
    const root = screen.getByRole("banner");
    expect(root).toHaveAttribute("data-layout", "centered");
    expect(root).toHaveAttribute("data-appearance", "inverse");
    expect(root).toHaveAttribute("data-position", "fixed");
    expect(root).toHaveAttribute("data-size", "compact");
    expect(root).not.toHaveAttribute("data-bordered");
    expect(root).toHaveAttribute("data-breakpoint", "lg");
  });

  it("marks the current page from activeHref, and a menu holding it", () => {
    render(<Navbar links={links} activeHref="/docs" />);
    const nav = screen.getAllByRole("navigation", { name: "Main" })[0];
    expect(within(nav).getByRole("link", { name: /Docs/ })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("lets link.active override activeHref, and marks a group active from its children", () => {
    render(<Navbar links={[{ label: "Home", href: "/", active: false }, ...links.slice(2)]} activeHref="/blog" />);
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("button", { name: "Resources" })).toHaveAttribute("data-active", "true");
  });

  it("renders a string badge as a Badge after the label", () => {
    render(<Navbar links={links} />);
    expect(screen.getByRole("link", { name: "Docs New" })).toBeInTheDocument();
  });

  it("opens a dropdown of link items", async () => {
    render(<Navbar links={links} />);
    await userEvent.click(screen.getByRole("button", { name: "Resources" }));
    const blog = screen.getByRole("menuitem", { name: "Blog" });
    expect(blog.tagName).toBe("A");
    expect(blog).toHaveAttribute("href", "/blog");
  });

  it("opens a mega menu: one column per group, with descriptions", async () => {
    render(<Navbar links={links} />);
    await userEvent.click(screen.getByRole("button", { name: "Products" }));
    expect(screen.getByRole("menu")).toHaveAttribute("data-columns", "2");
    expect(screen.getByRole("menuitem", { name: "Editor" })).toHaveAccessibleDescription("Write and preview");
  });

  it("renders the logo, search, actions and announcement slots", () => {
    render(<Navbar logo={<a href="/">Datum</a>} search={<input aria-label="Search" />} actions={<button>Sign in</button>} announcement="v2 is out" />);
    expect(screen.getByRole("link", { name: "Datum" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByText("v2 is out")).toBeInTheDocument();
  });

  it("opens the mobile menu in a Sheet with groups as accordions, and closes on navigation", async () => {
    const onOpenChange = vi.fn();
    render(<Navbar links={links} activeHref="/blog" onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    const dialog = screen.getByRole("dialog", { name: "Menu" });
    // the group holding the current page starts open
    expect(within(dialog).getByRole("button", { name: "Resources" })).toHaveAttribute("aria-expanded", "true");
    expect(within(dialog).getByRole("link", { name: "Blog" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(within(dialog).getByRole("button", { name: "Products" }));
    expect(within(dialog).getByRole("link", { name: "Editor" })).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole("link", { name: "Home" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("is controlled with open", () => {
    render(<Navbar links={links} open />);
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
  });

  it("hides on scroll down and returns on scroll up when hideOnScroll", () => {
    render(<Navbar links={links} hideOnScroll />);
    const root = screen.getByRole("banner");
    act(() => {
      window.scrollY = 400;
      fireEvent.scroll(window);
    });
    expect(root).toHaveAttribute("data-hidden", "true");
    act(() => {
      window.scrollY = 300;
      fireEvent.scroll(window);
    });
    expect(root).not.toHaveAttribute("data-hidden");
  });

  it("marks a transparent bar scrolled once the page moves", () => {
    window.scrollY = 0;
    render(<Navbar appearance="transparent" />);
    const root = screen.getByRole("banner");
    expect(root).not.toHaveAttribute("data-scrolled");
    act(() => {
      window.scrollY = 10;
      fireEvent.scroll(window);
    });
    expect(root).toHaveAttribute("data-scrolled", "true");
    window.scrollY = 0;
  });
});
