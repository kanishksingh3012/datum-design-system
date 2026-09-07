import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sources, Source, Citation } from "./Sources";

describe("Sources", () => {
  it("renders a labeled region wrapping a real list of real links", () => {
    render(
      <Sources>
        <Source number={1} title="WAI-ARIA APG" href="https://www.w3.org/WAI/ARIA/apg/" />
        <Source number={2} title="MDN" href="https://developer.mozilla.org" />
      </Sources>
    );
    expect(screen.getByRole("region", { name: "Sources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /WAI-ARIA APG/ })).toHaveAttribute(
      "href",
      "https://www.w3.org/WAI/ARIA/apg/"
    );
  });

  it("renders an inline citation as a real, labeled link pointing at its source", () => {
    render(<Citation number={1} href="#source-1" />);
    expect(screen.getByRole("link", { name: "Source 1" })).toHaveAttribute("href", "#source-1");
  });
});
