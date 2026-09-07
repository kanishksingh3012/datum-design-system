import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio } from "./Radio";

describe("Radio", () => {
  it("renders a real radio input with the label as its accessible name", () => {
    render(<Radio name="plan" value="basic" label="Basic" />);
    expect(screen.getByRole("radio", { name: "Basic" })).toBeInTheDocument();
  });

  it("only allows one option checked per shared name group", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Radio name="plan" value="basic" label="Basic" defaultChecked />
        <Radio name="plan" value="pro" label="Pro" />
      </>
    );
    const basic = screen.getByRole("radio", { name: "Basic" });
    const pro = screen.getByRole("radio", { name: "Pro" });
    expect(basic).toBeChecked();
    await user.click(pro);
    expect(pro).toBeChecked();
    expect(basic).not.toBeChecked();
  });

  it("respects the disabled prop", () => {
    render(<Radio name="plan" value="team" label="Team" disabled />);
    expect(screen.getByRole("radio", { name: "Team" })).toBeDisabled();
  });
});
