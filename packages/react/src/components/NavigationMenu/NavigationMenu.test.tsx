import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "./NavigationMenu";

function Menu() {
  return (
    <NavigationMenu label="Main">
      <NavigationMenuItem>
        <NavigationMenuLink href="/" active>
          Home
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent>
          <a href="/widgets">Widgets</a>
          <a href="/gadgets">Gadgets</a>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenu>
  );
}

describe("NavigationMenu", () => {
  it("renders a real nav landmark with a real link for a plain top-level entry, not role=menu", () => {
    render(<Menu />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("is closed until the trigger is clicked, then shows the panel content", async () => {
    const user = userEvent.setup();
    render(<Menu />);
    expect(screen.queryByText("Widgets")).not.toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: "Products" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Widgets")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Menu />);
    const trigger = screen.getByRole("button", { name: "Products" });
    await user.click(trigger);
    await user.keyboard("{Escape}");
    expect(screen.queryByText("Widgets")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes on an outside click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Menu />
        <button>Outside</button>
      </div>
    );
    await user.click(screen.getByRole("button", { name: "Products" }));
    expect(screen.getByText("Widgets")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByText("Widgets")).not.toBeInTheDocument();
  });

  it("throws a clear error when Trigger/Content are used outside a NavigationMenuItem", () => {
    expect(() => render(<NavigationMenuTrigger>Bad</NavigationMenuTrigger>)).toThrow(
      "NavigationMenuTrigger must be used inside a NavigationMenuItem"
    );
  });
});
