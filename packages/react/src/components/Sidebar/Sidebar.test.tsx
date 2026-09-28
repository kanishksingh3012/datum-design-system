import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sidebar, type SidebarSection } from "./Sidebar";

const sections: SidebarSection[] = [
  { links: [{ label: "Home", href: "/" }, { label: "Inbox", href: "/inbox", badge: 3 }] },
  { title: "Projects", links: [{ label: "Datum", href: "/p/datum" }] },
];

describe("Sidebar", () => {
  it("renders a named navigation with titled groups and marks the current page", () => {
    render(<Sidebar sections={sections} activeHref="/inbox" label="Workspace" header={<b>Acme</b>} footer="Ada" />);
    const nav = screen.getAllByRole("navigation", { name: "Workspace" })[0];
    expect(within(nav).getByText("Projects")).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Inbox 3" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Ada")).toBeInTheDocument();
  });

  it("puts className and props on the root, with size and breakpoint", () => {
    render(<Sidebar sections={sections} size="sm" mobileBreakpoint="lg" className="app" data-testid="side" />);
    const root = screen.getByTestId("side");
    expect(root).toHaveClass("app");
    expect(root).toHaveAttribute("data-size", "sm");
    expect(root).toHaveAttribute("data-breakpoint", "lg");
  });

  it("opens the links in a Sheet from the menu button, and closes it on navigate", async () => {
    const onOpenChange = vi.fn();
    render(<Sidebar sections={sections} activeHref="/" onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    const dialog = screen.getByRole("dialog", { name: "Sidebar" });
    const link = within(dialog).getByRole("link", { name: "Datum" });
    link.addEventListener("click", (e) => e.preventDefault());
    await userEvent.click(link);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  it("is controlled by open", () => {
    const { rerender } = render(<Sidebar sections={sections} open={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    rerender(<Sidebar sections={sections} open />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
