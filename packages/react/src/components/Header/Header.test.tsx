import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("renders a real <header>, the banner landmark", () => {
    render(<Header>Site title</Header>);
    expect(screen.getByRole("banner").tagName).toBe("HEADER");
  });
});
