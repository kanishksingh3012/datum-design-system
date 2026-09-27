import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a native button element by default", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" }).tagName).toBe("BUTTON");
  });

  it("defaults to intent=accent, appearance=solid and size=md", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("data-intent", "accent");
    expect(button).toHaveAttribute("data-appearance", "solid");
    expect(button).toHaveAttribute("data-size", "md");
  });

  it("reflects every intent × appearance combination via data attributes", () => {
    const intents = ["accent", "neutral", "danger"] as const;
    const appearances = ["solid", "soft", "outline", "ghost"] as const;
    for (const intent of intents) {
      for (const appearance of appearances) {
        render(
          <Button intent={intent} appearance={appearance}>
            {`${intent}-${appearance}`}
          </Button>
        );
        const button = screen.getByRole("button", { name: `${intent}-${appearance}` });
        expect(button).toHaveAttribute("data-intent", intent);
        expect(button).toHaveAttribute("data-appearance", appearance);
      }
    }
  });

  it("reflects size and fullWidth via data attributes", () => {
    render(
      <Button size="sm" fullWidth>
        Delete
      </Button>
    );
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveAttribute("data-size", "sm");
    expect(button).toHaveAttribute("data-full-width", "true");
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
    expect(button).toHaveAttribute("data-disabled", "true");
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("blocks clicks while loading but keeps the button focusable", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("data-loading", "true");
    button.focus();
    expect(button).toHaveFocus();
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

  it("keeps prefix, label and suffix in place while loading and overlays a spinner", () => {
    const { container } = render(
      <Button loading prefix={<span data-testid="prefix">P</span>} suffix={<span data-testid="suffix">S</span>}>
        Continue
      </Button>
    );
    expect(screen.getByTestId("prefix")).toBeInTheDocument();
    expect(screen.getByTestId("suffix")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "P Continue S" })).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector("[data-spinner]")).toHaveAttribute("aria-hidden", "true");
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

  it("does not toggle while loading", async () => {
    const onPressedChange = vi.fn();
    render(
      <Button pressed={false} onPressedChange={onPressedChange} loading>
        Favorite
      </Button>
    );
    await userEvent.click(screen.getByRole("button", { name: "Favorite" }));
    expect(onPressedChange).not.toHaveBeenCalled();
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
