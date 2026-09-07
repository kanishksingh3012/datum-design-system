import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputOTP } from "./InputOTP";

describe("InputOTP", () => {
  it("renders one real input per digit, each labeled", () => {
    render(<InputOTP label="Verification code" length={4} value="" onChange={() => {}} />);
    expect(screen.getByRole("group", { name: "Verification code" })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("advances focus to the next box after typing a digit", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [value, setValue] = useState("");
      return <InputOTP label="Code" length={4} value={value} onChange={setValue} />;
    }
    render(<Harness />);
    const boxes = screen.getAllByRole("textbox");
    boxes[0].focus();
    await user.keyboard("1");
    expect(boxes[1]).toHaveFocus();
  });

  it("moves focus back on Backspace from an empty box", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [value, setValue] = useState("12");
      return <InputOTP label="Code" length={4} value={value} onChange={setValue} />;
    }
    render(<Harness />);
    const boxes = screen.getAllByRole("textbox");
    boxes[2].focus();
    await user.keyboard("{Backspace}");
    expect(boxes[1]).toHaveFocus();
  });

  it("fills every box from a paste and calls onChange with the joined value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InputOTP label="Code" length={4} value="" onChange={onChange} />);
    const boxes = screen.getAllByRole("textbox");
    boxes[0].focus();
    await user.paste("1234");
    expect(onChange).toHaveBeenCalledWith("1234");
  });
});
