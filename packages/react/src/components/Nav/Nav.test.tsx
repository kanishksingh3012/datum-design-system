import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Nav, NavLink } from "./Nav";

describe("Nav", () => {
  it("renders a real <nav> with a <ul> of links", () => {
    render(
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/about">About</NavLink>
      </Nav>
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("sets aria-current=page on the active link only", () => {
    render(
      <Nav>
        <NavLink href="/" active>
          Home
        </NavLink>
        <NavLink href="/about">About</NavLink>
      </Nav>
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("aria-current");
  });
});
