import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders a real <footer>, the contentinfo landmark", () => {
    render(<Footer>&copy; Datum</Footer>);
    expect(screen.getByRole("contentinfo").tagName).toBe("FOOTER");
  });
});
