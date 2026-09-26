import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "../Button/Button";

describe("ButtonGroup", () => {
  it("renders as a group role containing its buttons", () => {
    render(
      <ButtonGroup>
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole("group");
    expect(group).toContainElement(screen.getByRole("button", { name: "Week" }));
  });

  it("defaults to horizontal orientation", () => {
    render(
      <ButtonGroup>
        <Button>Day</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("reflects the vertical orientation", () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>Day</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-orientation", "vertical");
  });
});
