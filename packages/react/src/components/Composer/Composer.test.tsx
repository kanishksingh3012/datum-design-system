import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Composer } from "./Composer";

function Harness({ onSubmit, thinking = false }: { onSubmit: (v: string) => void; thinking?: boolean }) {
  const [value, setValue] = useState("");
  return <Composer label="Message" value={value} onChange={setValue} onSubmit={onSubmit} thinking={thinking} />;
}

describe("Composer", () => {
  it("renders a real, labeled textarea", () => {
    render(<Harness onSubmit={() => {}} />);
    expect(screen.getByLabelText("Message").tagName).toBe("TEXTAREA");
  });

  it("submits on Enter and inserts a newline on Shift+Enter", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Harness onSubmit={onSubmit} />);
    const input = screen.getByLabelText("Message");
    await user.type(input, "line one{Shift>}{Enter}{/Shift}line two");
    expect(input).toHaveValue("line one\nline two");
    expect(onSubmit).not.toHaveBeenCalled();
    await user.type(input, "{Enter}");
    expect(onSubmit).toHaveBeenCalledWith("line one\nline two");
  });

  it("disables the input and shows real 'Thinking...' status text instead of the send button while thinking", () => {
    render(<Harness onSubmit={() => {}} thinking />);
    expect(screen.getByLabelText("Message")).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Thinking...");
    expect(screen.queryByRole("button", { name: "Send" })).not.toBeInTheDocument();
  });

  it("disables Send when the input is empty", () => {
    render(<Harness onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });
});
