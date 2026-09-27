import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ButtonGroup } from "./ButtonGroup";
import { Button } from "../Button/Button";

describe("ButtonGroup", () => {
  it("renders as a group role containing its buttons", () => {
    render(
      <ButtonGroup aria-label="Range">
        <Button>Day</Button>
        <Button>Week</Button>
        <Button>Month</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole("group", { name: "Range" });
    expect(group).toContainElement(screen.getByRole("button", { name: "Week" }));
  });

  it("defaults to a spaced, horizontal group", () => {
    render(
      <ButtonGroup>
        <Button>Day</Button>
      </ButtonGroup>
    );
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("data-orientation", "horizontal");
    expect(group).not.toHaveAttribute("data-attached");
    expect(screen.getByRole("button")).not.toHaveAttribute("data-group");
  });

  it("reflects the vertical orientation", () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>Day</Button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-orientation", "vertical");
  });

  it("passes size, intent and appearance down to every button", () => {
    render(
      <ButtonGroup size="sm" intent="neutral" appearance="outline">
        <Button>Day</Button>
        <Button>Week</Button>
      </ButtonGroup>
    );
    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveAttribute("data-size", "sm");
      expect(button).toHaveAttribute("data-intent", "neutral");
      expect(button).toHaveAttribute("data-appearance", "outline");
    }
  });

  it("lets a button's own props win over the group's", () => {
    render(
      <ButtonGroup size="sm" intent="neutral" appearance="outline">
        <Button>Cancel</Button>
        <Button intent="accent" appearance="solid">
          Save
        </Button>
      </ButtonGroup>
    );
    const save = screen.getByRole("button", { name: "Save" });
    expect(save).toHaveAttribute("data-intent", "accent");
    expect(save).toHaveAttribute("data-appearance", "solid");
    expect(save).toHaveAttribute("data-size", "sm");
  });

  it("marks the group and its buttons when attached", () => {
    render(
      <ButtonGroup attached>
        <Button pressed onPressedChange={() => {}}>
          Day
        </Button>
        <Button pressed={false} onPressedChange={() => {}}>
          Week
        </Button>
      </ButtonGroup>
    );
    expect(screen.getByRole("group")).toHaveAttribute("data-attached", "true");
    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveAttribute("data-group", "attached");
    }
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute("aria-pressed", "true");
  });

  it("does not leak into buttons outside the group", () => {
    render(
      <>
        <ButtonGroup size="lg" attached>
          <Button>Inside</Button>
        </ButtonGroup>
        <Button>Outside</Button>
      </>
    );
    const outside = screen.getByRole("button", { name: "Outside" });
    expect(outside).toHaveAttribute("data-size", "md");
    expect(outside).not.toHaveAttribute("data-group");
  });

  it("draws one sliding thumb only when attached and a segment is pressed", () => {
    const { container, rerender } = render(
      <ButtonGroup attached>
        <Button pressed onPressedChange={() => {}}>
          Day
        </Button>
        <Button pressed={false} onPressedChange={() => {}}>
          Week
        </Button>
      </ButtonGroup>
    );
    const thumbs = () => container.querySelectorAll('[role="group"] > span[aria-hidden="true"]');
    expect(thumbs()).toHaveLength(1);

    rerender(
      <ButtonGroup>
        <Button pressed onPressedChange={() => {}}>
          Day
        </Button>
      </ButtonGroup>
    );
    expect(thumbs()).toHaveLength(0);
  });
});
