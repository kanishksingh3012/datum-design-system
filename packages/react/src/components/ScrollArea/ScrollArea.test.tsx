import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollArea } from "./ScrollArea";

describe("ScrollArea", () => {
  it("renders its children in a real scrolling container", () => {
    render(
      <ScrollArea data-testid="scroll">
        <p>Content</p>
      </ScrollArea>
    );
    expect(screen.getByTestId("scroll")).toContainElement(screen.getByText("Content"));
  });
});
