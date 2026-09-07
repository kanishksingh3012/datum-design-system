import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("renders a real <aside>, the complementary landmark", () => {
    render(<Sidebar>Navigation</Sidebar>);
    expect(screen.getByRole("complementary").tagName).toBe("ASIDE");
  });
});
