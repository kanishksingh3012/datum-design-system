import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "./Switch";

const row = (el: HTMLElement) => el.closest("label")!;

describe("Switch", () => {
  it("is a native input with role=switch, md, label at the end, off by default", () => {
    render(<Switch label="Wi-Fi" />);
    const sw = screen.getByRole("switch", { name: "Wi-Fi" });
    expect(sw.tagName).toBe("INPUT");
    expect(sw).not.toBeChecked();
    expect(row(sw)).toHaveAttribute("data-size", "md");
    expect(row(sw)).toHaveAttribute("data-label-position", "end");
  });

  it("flips on click and Space, reporting each change", async () => {
    const onCheckedChange = vi.fn();
    render(<Switch label="Wi-Fi" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByText("Wi-Fi"));
    expect(screen.getByRole("switch")).toBeChecked();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("switch")).not.toBeChecked();
    expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
  });

  it("follows checked when controlled", async () => {
    render(<Switch label="Locked" checked />);
    await userEvent.click(screen.getByText("Locked"));
    expect(screen.getByRole("switch")).toBeChecked();
  });

  it("reflects size, labelPosition, description and disabled", () => {
    render(<Switch label="Beta" description="Try new features" size="sm" labelPosition="start" disabled />);
    const sw = screen.getByRole("switch");
    expect(sw).toHaveAccessibleDescription("Try new features");
    expect(sw).toBeDisabled();
    expect(row(sw)).toHaveAttribute("data-size", "sm");
    expect(row(sw)).toHaveAttribute("data-label-position", "start");
  });
});
