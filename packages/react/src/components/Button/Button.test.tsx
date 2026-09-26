import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a native button element by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" }).tagName).toBe("BUTTON");
  });

  it("defaults to variant=primary and size=md", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-variant", "primary");
    expect(button).toHaveAttribute("data-size", "md");
  });

  it("reflects every documented variant via data-variant", () => {
    const variants = ["primary", "secondary", "tertiary", "outline", "text", "link", "danger", "danger-soft"] as const;
    for (const variant of variants) {
      render(<Button variant={variant}>Action</Button>);
    }
    for (const variant of variants) {
      expect(screen.getAllByRole("button").some((b) => b.getAttribute("data-variant") === variant)).toBe(true);
    }
  });

  it("reflects variant and size props via data attributes", () => {
    render(
      <Button variant="danger" size="sm">
        Delete
      </Button>
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveAttribute("data-variant", "danger");
    expect(button).toHaveAttribute("data-size", "sm");
  });

  it("disables the button and blocks clicks when disabled", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("treats loading as implicitly disabled and exposes aria-busy", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("fires onClick when enabled", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports polymorphism via the render prop, using aria-disabled instead of disabled", () => {
    render(
      <Button disabled render={(props) => <a href="/billing" {...props} />}>
        Go to billing
      </Button>
    );
    const link = screen.getByRole("link", { name: "Go to billing" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).not.toHaveAttribute("disabled");
  });

  it("renders prefix before and suffix after the label", () => {
    render(
      <Button prefix={<span data-testid="prefix">P</span>} suffix={<span data-testid="suffix">S</span>}>
        Continue
      </Button>
    );
    const button = screen.getByRole("button", { name: "P Continue S" });
    const prefix = screen.getByTestId("prefix");
    const suffix = screen.getByTestId("suffix");
    expect(button.firstChild).toBe(prefix);
    expect(button.lastChild).toBe(suffix);
  });

  it("replaces prefix with the spinner while loading, and hides suffix", () => {
    render(
      <Button loading prefix={<span data-testid="prefix">P</span>} suffix={<span data-testid="suffix">S</span>}>
        Continue
      </Button>
    );
    expect(screen.queryByTestId("prefix")).not.toBeInTheDocument();
    expect(screen.queryByTestId("suffix")).not.toBeInTheDocument();
  });

  it("renders icon-only with the label as its accessible name", () => {
    render(
      <Button iconOnly label="Search" data-testid="glyph">
        <svg aria-hidden="true" />
      </Button>
    );
    const button = screen.getByRole("button", { name: "Search" });
    expect(button).toHaveAttribute("data-icon-only", "true");
  });

  it("acts as an uncontrolled-free toggle when pressed is provided", async () => {
    const onPressedChange = vi.fn();
    render(
      <Button pressed={false} onPressedChange={onPressedChange}>
        Favorite
      </Button>
    );
    const button = screen.getByRole("button", { name: "Favorite" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).not.toHaveAttribute("data-pressed");
    await userEvent.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("reflects pressed=true via aria-pressed and data-pressed", () => {
    render(
      <Button pressed onPressedChange={() => {}}>
        Favorite
      </Button>
    );
    const button = screen.getByRole("button", { name: "Favorite" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAttribute("data-pressed", "true");
  });

  it("does not expose aria-pressed when pressed is never passed", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).not.toHaveAttribute("aria-pressed");
  });

  it("reflects the floating (FAB) treatment via data-floating", () => {
    render(
      <Button floating iconOnly label="New project">
        <svg aria-hidden="true" />
      </Button>
    );
    expect(screen.getByRole("button", { name: "New project" })).toHaveAttribute("data-floating", "true");
  });
});
