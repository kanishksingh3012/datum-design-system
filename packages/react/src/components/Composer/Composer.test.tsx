import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Composer } from "./Composer";

describe("Composer", () => {
  it("sends the trimmed draft on Enter and clears it; Shift+Enter adds a line", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Composer label="Message" onSubmit={onSubmit} />);
    const field = screen.getByRole("textbox", { name: "Message" });
    await user.type(field, "hi{Shift>}{Enter}{/Shift}there ");
    expect(field).toHaveValue("hi\nthere ");
    await user.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("hi\nthere");
    expect(field).toHaveValue("");
  });

  it("disables Send while the draft is empty", () => {
    render(<Composer label="Message" onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("follows the value trio", async () => {
    const onValueChange = vi.fn();
    render(<Composer label="Message" value="a" onValueChange={onValueChange} onSubmit={() => {}} />);
    await userEvent.type(screen.getByRole("textbox"), "b");
    expect(onValueChange).toHaveBeenCalledWith("ab");
    expect(screen.getByRole("textbox")).toHaveValue("a");
  });

  it("while thinking: stays editable, won't send, and offers Stop", async () => {
    const onSubmit = vi.fn();
    const onStop = vi.fn();
    render(<Composer label="Message" defaultValue="next" thinking onStop={onStop} onSubmit={onSubmit} />);
    expect(screen.getByRole("textbox")).toBeEnabled();
    await userEvent.type(screen.getByRole("textbox"), "{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Stop" }));
    expect(onStop).toHaveBeenCalled();
  });

  it("shows Send as loading while thinking without onStop", () => {
    render(<Composer label="Message" thinking onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("aria-busy", "true");
  });
});
