import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColorPicker } from "./ColorPicker";

function Harness() {
  const [color, setColor] = useState("#3366ff");
  return <ColorPicker label="Accent color" value={color} onChange={setColor} />;
}

describe("ColorPicker", () => {
  it("renders both a real input type=color and an always-focusable hex text input", () => {
    render(<Harness />);
    expect(screen.getByLabelText("Accent color swatch")).toHaveAttribute("type", "color");
    expect(screen.getByLabelText("Accent color hex value")).toHaveAttribute("type", "text");
  });

  it("commits a typed hex value to onChange once it's a valid 6-digit hex", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const hexInput = screen.getByLabelText("Accent color hex value");
    await user.clear(hexInput);
    await user.type(hexInput, "#ff0000");
    expect(hexInput).toHaveValue("#ff0000");
    expect(screen.getByLabelText("Accent color swatch")).toHaveValue("#ff0000");
  });

  it("reverts an invalid partial hex to the last valid value on blur", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const hexInput = screen.getByLabelText("Accent color hex value");
    await user.clear(hexInput);
    await user.type(hexInput, "#ff");
    await user.tab();
    expect(hexInput).toHaveValue("#3366ff");
  });
});
