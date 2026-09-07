import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./Label";

describe("Label", () => {
  it("renders a real <label> and associates via htmlFor", () => {
    render(
      <>
        <Label htmlFor="custom-control">Volume</Label>
        <input id="custom-control" />
      </>
    );
    expect(screen.getByLabelText("Volume")).toBeInTheDocument();
  });
});
