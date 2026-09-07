import { useState } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "./DatePicker";

// Same jsdom gap as Dialog.test.tsx - see there for the full rationale.
beforeAll(() => {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
      this.setAttribute("open", "");
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      if (!this.open) return;
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    };
  }
});

function Harness() {
  const [value, setValue] = useState<string | null>(null);
  return <DatePicker label="Start date" value={value} onChange={setValue} />;
}

describe("DatePicker", () => {
  it("defaults the trigger's accessible name to 'Choose date' with nothing selected", () => {
    render(<Harness />);
    expect(screen.getByRole("button", { name: "Choose date" })).toBeInTheDocument();
  });

  it("opens a real grid with weekday column headers on trigger click", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Choose date" }));
    expect(screen.getByRole("grid")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Sun" })).toHaveAttribute("scope", "col");
  });

  it("picking a day commits it, closes the dialog, and updates the trigger's accessible name", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Choose date" }));
    const day15 = screen.getAllByRole("gridcell").map((cell) => cell.querySelector("button")!).find((btn) => btn.textContent === "15" && !btn.hasAttribute("data-outside"));
    await user.click(day15!);
    expect(screen.getByRole("button", { name: /^Change date, / })).toBeInTheDocument();
  });

  it("moves focus a day at a time with arrow keys without leaving the grid buttons", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Choose date" }));
    const focused = document.activeElement as HTMLButtonElement;
    expect(focused.tagName).toBe("BUTTON");
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).not.toBe(focused);
    expect((document.activeElement as HTMLElement).tagName).toBe("BUTTON");
  });
});
